import { createWriteStream, statSync } from "node:fs";
import { Writable } from "node:stream";
import { readJson, $, writeJson, FileEntry } from "@gaubee/nodekit";
import path from "node:path";
import rootPkg from "../package.json" with { type: "json" };

const getLatestReleaseTag = async () => {
  const res = await fetch(
    "https://api.github.com/repos/meilisearch/meilisearch/releases/latest"
  );
  if (!res.ok) {
    let errorDetails = "";
    try {
      errorDetails = await res.text();
      const { message, documentation_url } = JSON.parse(errorDetails);
      errorDetails = `${message}\n@see ${documentation_url}`;
    } catch {}
    throw new Error(
      `Failed to fetch latest release tag: ${res.statusText}\n${errorDetails}`
    );
  }
  const data = (await res.json()) as { tag_name: string };
  return data.tag_name;
};

type State =
  | {
      type: "start";
      filename: string;
      total: number;
    }
  | {
      type: "progress";
      chunkSize: number;
    }
  | {
      type: "done";
    };
export interface DownloadOptions {
  emitter?: (state: State) => void;
  mode?: "fetch" | "wget";
  signal?: AbortSignal;
  tag?: string;
  skipDownload?: boolean;
  useProxy?: boolean;
  proxyUrl?: string;
}

export const doDownload = async (opts: DownloadOptions = {}) => {
  const binarys = [
    "meilisearch-linux-aarch64",
    "meilisearch-macos-amd64",
    "meilisearch-windows-amd64.exe",
    "meilisearch-macos-apple-silicon",
    "meilisearch-linux-amd64",
  ];
  const {
    mode = "fetch",
    useProxy = true,
    skipDownload = false,
    proxyUrl = "https://ghfast.top/",
  } = opts;
  let tag = opts.tag;
  if (tag === "latest") {
    tag = await getLatestReleaseTag();
    const rootPkgFile = new FileEntry("package.json");
    const rootPkgContent = rootPkgFile.readJson<typeof rootPkg>();
    rootPkgContent.meilisearchReleaseTag = tag;
    rootPkgFile.writeJson(rootPkgContent);
  }

  const base = `https://github.com/meilisearch/meilisearch/releases/download/${tag}`;
  const emitter = opts.emitter;

  for (const binaryName of binarys) {
    const url = `${base}/${binaryName}`;
    const outfile = `packages/${binaryName.replace("meilisearch-", "").split(".")[0]}/${binaryName}`;
    const downloadUrl = useProxy ? proxyUrl + url : url;
    const outdir = path.dirname(outfile);
    const packageJsonFile = new FileEntry(outdir + "/package.json");
    const packageJson = packageJsonFile.readJson<
      typeof import("../packages/linux-amd64/package.json") & {
        ETag?: string;
      }
    >();

    if (!skipDownload) {
      if (mode === "fetch") {
        const headers = new Headers();
        let existingLength = 0;
        try {
          const stats = statSync(outfile);
          existingLength = stats.size;
          headers.set("Range", `bytes=${existingLength}-`);
          if (packageJson.ETag) {
            headers.set("If-None-Match", packageJson.ETag);
          }
        } catch (error) {
          // File doesn't exist
        }

        emitter?.({ type: "start", filename: binaryName, total: 0 });
        let res = await fetch(downloadUrl, {
          signal: opts.signal,
          headers,
        });

        if (res.status === 304) {
          // Not Modified, file is up to date.
          emitter?.({
            type: "start",
            filename: binaryName,
            total: existingLength,
          });
          emitter?.({ type: "progress", chunkSize: existingLength });
          continue;
        }

        if (res.status === 416) {
          // Range Not Satisfiable, meaning the file is already complete.
          // Re-fetch headers to get the latest ETag for the completed file.
          res = await fetch(downloadUrl, {
            signal: opts.signal,
          });
        }

        if (res.body) {
          packageJson.ETag = res.headers.get("etag") || "";
          packageJsonFile.writeJson({
            ...packageJson,
            ETag: res.headers.get("etag")?.match(/^"(.*)"$/)?.[1] || "",
          });
          let total = +(res.headers.get("content-length") || 0);
          let writeStreamOptions = {};

          if (res.status === 206) {
            total += existingLength;
            writeStreamOptions = { flags: "a" };
          } else if (res.status !== 200) {
            throw new Error(
              `Failed to download file: ${res.status} ${res.statusText}`
            );
          } else {
            existingLength = 0;
          }

          emitter?.({ type: "start", filename: binaryName, total });
          let loaded = existingLength;

          await res.body
            .pipeThrough(
              new TransformStream({
                start() {
                  if (loaded > 0) {
                    emitter?.({ type: "progress", chunkSize: loaded });
                  }
                },
                transform: (chunk, controller) => {
                  controller.enqueue(chunk);
                  loaded += chunk.length;
                  emitter?.({ type: "progress", chunkSize: chunk.length });
                },
              })
            )
            .pipeTo(
              Writable.toWeb(createWriteStream(outfile, writeStreamOptions))
            );
        }
      } else if (mode === "wget") {
        await $.spawn("wget", ["-c", "-S", downloadUrl, "-O", outfile], {
          async stderr(io) {
            let stderr = "";
            for await (const chunk of io) {
              stderr += chunk;
            }

            const match = stderr.match(/ETag: "(.*)"/); // Look for ETag
            if (match) {
              packageJson.ETag = match[1].trim(); // Store ETag with quotes
              packageJsonFile.writeJson(packageJson);
            }
          },
        });
      }
    }

    packageJson.version = rootPkg.version + "-" + tag;
    writeJson(outdir + "/package.json", packageJson);
  }
  emitter?.({ type: "done" });

  const sdkPackageJson = new FileEntry("packages/sdk/package.json");
  const packageJson =
    sdkPackageJson.readJson<typeof import("../packages/sdk/package.json")>();
  packageJson.version = rootPkg.version;
  sdkPackageJson.writeJson(packageJson);
};
