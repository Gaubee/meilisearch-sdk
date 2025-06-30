import { createWriteStream } from "node:fs";
import { Writable } from "node:stream";
import { readJson, $, writeJson, FileEntry } from "@gaubee/nodekit";
import path from "node:path";
import rootPkg from "../package.json" with { type: "json" };
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
    tag = "v1.12.0",
    useProxy = true,
    skipDownload = false,
    proxyUrl = "https://ghfast.top/",
  } = opts;
  const base = `https://github.com/meilisearch/meilisearch/releases/download/${tag}`;
  const emitter = opts.emitter;
  for (const binaryName of binarys) {
    const url = `${base}/${binaryName}`;
    const outfile = `packages/${binaryName.replace("meilisearch-", "").split(".")[0]}/${binaryName}`;
    const downloadUrl = useProxy ? proxyUrl + url : url;
    if (!skipDownload) {
      if (mode === "fetch") {
        const res = await fetch(downloadUrl, {
          signal: opts.signal,
        });
        if (res.body) {
          const total = +(res.headers.get("content-length") || 0);
          emitter?.({ type: "start", filename: binaryName, total });

          await res.body
            .pipeThrough(
              new TransformStream({
                transform: (chunk, controller) => {
                  controller.enqueue(chunk);
                  emitter?.({ type: "progress", chunkSize: chunk.length });
                },
              })
            )
            .pipeTo(Writable.toWeb(createWriteStream(outfile)));
        }
      } else if (mode === "wget") {
        await $.spawn("wget", [downloadUrl, "-O", outfile]);
      }
    }

    const outdir = path.dirname(outfile);
    const packageJsonFile = new FileEntry(outdir + "/package.json");
    const packageJson =
      packageJsonFile.readJson<
        typeof import("../packages/linux-amd64/package.json")
      >();
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
