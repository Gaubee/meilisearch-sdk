import { createWriteStream } from "node:fs";
import { Writable } from "node:stream";
import { $ } from "execa";
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
export const doDownload = async (
  opts: {
    emitter?: (state: State) => void;
    mode?: "fetch" | "wget";
    signal?: AbortSignal;
  } = {}
) => {
  const binarys = [
    // "meilisearch-linux-aarch64",
    // "meilisearch-macos-amd64",
    // "meilisearch-windows-amd64.exe",
    // "meilisearch-macos-apple-silicon",
    // "meilisearch-linux-amd64",
  ];
  const base = `https://github.com/meilisearch/meilisearch/releases/download/v1.12.0`;
  const proxy = "https://mirror.ghproxy.com/?q=";
  const { mode = "fetch" } = opts;
  const emitter = opts.emitter;
  for (const binaryName of binarys) {
    const url = `${base}/${binaryName}`;
    const outfile = `packages/${binaryName.replace("meilisearch-", "").split(".")[0]}/${binaryName}`;

    if (mode === "fetch") {
      const res = await fetch(proxy + url, { signal: opts.signal });
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
      await $({
        stdio: "inherit",
      })`wget ${proxy + url} -O ${outfile}`;
    }
  }
  emitter?.({ type: "done" });
};
