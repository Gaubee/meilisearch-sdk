import fs from "node:fs";
import os from "node:os";

export const resolveBindaryInfo = () => {
  const req = require;

  const platform = os.platform();
  const arch = os.arch();
  let packageInfo: { name: string; binPath: string } | undefined;
  if (platform === "win32") {
    packageInfo = {
      name: "@gaubee/meilisearch-windows-amd64",
      binPath: req.resolve("@gaubee/meilisearch-windows-amd64/meilisearch"),
    };
  } else if (platform === "darwin") {
    if (arch === "arm64") {
      packageInfo = {
        name: "@gaubee/meilisearch-macos-apple-silicon",
        binPath: req.resolve("@gaubee/meilisearch-macos-apple-silicon/meilisearch"),
      };
    } else if (arch === "x64") {
      packageInfo = {
        name: "@gaubee/meilisearch-macos-amd64",
        binPath: req.resolve("@gaubee/meilisearch-macos-amd64/meilisearch"),
      };
    }
  } else if (platform === "linux") {
    if (arch === "arm64") {
      packageInfo = {
        name: "@gaubee/meilisearch-linux-aarch64",
        binPath: req.resolve("@gaubee/meilisearch-linux-aarch64/meilisearch"),
      };
    } else if (arch === "x64") {
      packageInfo = {
        name: "@gaubee/meilisearch-linux-amd64",
        binPath: req.resolve("@gaubee/meilisearch-linux-amd64/meilisearch"),
      };
    }
  }
  if (packageInfo == null) {
    throw new Error(`meilisearch sdk no yet support ${platform}/${arch}`);
  }
  try {
    fs.chmodSync(packageInfo.binPath, 493);
  } catch {}

  return packageInfo;
};
