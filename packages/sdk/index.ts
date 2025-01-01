import { createRequire } from "node:module";
import os from "node:os";

const resolveBindaryInfo = () => {
  const req = createRequire(import.meta.url);

  const platform = os.platform();
  const arch = os.arch();
  let packageInfo: { name: string; binPath: string } | undefined;
  if (platform === "win32") {
    packageInfo = {
      name: "@gaubee/meilisearch-windows-amd64",
      binPath: req.resolve(
        "@gaubee/meilisearch-windows-amd64/meilisearch-windows-amd64.exe"
      ),
    };
  } else if (platform === "darwin") {
    if (arch === "arm64") {
      packageInfo = {
        name: "@gaubee/meilisearch-macos-apple-silicon",
        binPath: req.resolve(
          "@gaubee/meilisearch-macos-apple-silicon/meilisearch-macos-apple-silicon"
        ),
      };
    } else if (arch === "x64") {
      packageInfo = {
        name: "@gaubee/meilisearch-macos-amd64",
        binPath: req.resolve(
          "@gaubee/meilisearch-macos-amd64/meilisearch-macos-amd64"
        ),
      };
    }
  } else if (platform === "linux") {
    if (arch === "arm64") {
      packageInfo = {
        name: "@gaubee/meilisearch-linux-aarch64",
        binPath: req.resolve(
          "@gaubee/meilisearch-linux-aarch64/meilisearch-linux-aarch64"
        ),
      };
    } else if (arch === "x64") {
      packageInfo = {
        name: "@gaubee/meilisearch-linux-amd64",
        binPath: req.resolve(
          "@gaubee/meilisearch-linux-amd64/meilisearch-linux-amd64"
        ),
      };
    }
  }
  if (packageInfo == null) {
    throw new Error(`meilisearch sdk no yet support ${platform}/${arch}`);
  }
  return packageInfo;
};

export class Meilisearch {}

console.log("winBin", binPath);
import { spawn, spawnSync } from "node:child_process";
// import z from "@gaubee/meilisearch-windows-amd64/package.json"
console.time("version");
for await (const zzz of spawn(binPath, ["--version"], { stdio: "pipe" })
  .stdout) {
  console.log("zzz", zzz.toString());
}

console.timeEnd("version");
export const meiliSearch = {};
