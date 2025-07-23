import type { Asset, GrabConfig } from "@gaubee/grab/config";
import { copy } from "@gaubee/grab/plugins"; // 移除了 clear
import { FileEntry } from "@gaubee/nodekit";
import path from "node:path";
import rootPkg from "./package.json" with { type: "json" };

// 助手函数，用于生成特定平台的资源配置，使其更易于维护
const createAsset = (platform: "linux" | "macos" | "windows", arch: "amd64" | "aarch64", targetName: string): Asset => {
  // 为了 packages 目录名更规范
  const pkgArch = platform === "macos" && arch === "aarch64" ? "apple-silicon" : arch;
  const pkgName = `${platform}-${pkgArch}`;

  return {
    name: [platform, pkgArch],
    plugins: [
      copy({
        targetPath: `packages/${pkgName}/${targetName}`,
      }),
    ],
  };
};

const config: GrabConfig = {
  // 1. 指定 GitHub 仓库
  repo: "meilisearch/meilisearch",

  // 2. 声明式地定义需要的资源
  assets: [
    createAsset("linux", "amd64", "meilisearch"),
    createAsset("linux", "aarch64", "meilisearch"),
    createAsset("macos", "amd64", "meilisearch"),
    createAsset("macos", "aarch64", "meilisearch"),
    createAsset("windows", "amd64", "meilisearch.exe"),
  ],

  // 3. 注入项目特定的业务逻辑
  hooks: {
    onTagFetched: async (tag) => {
      console.log(`[grab] Latest meilisearch tag found: ${tag}. Updating package.json...`);
      const rootPkgFile = new FileEntry("package.json");
      const rootPkgContent = await rootPkgFile.readJson<typeof rootPkg>();
      rootPkgContent.meilisearchReleaseTag = tag;
      await rootPkgFile.writeJson(rootPkgContent);
    },

    onAllComplete: async () => {
      console.log("[grab] All downloads complete. Updating package versions...");
      const rootPkgFile = new FileEntry("package.json");
      const rootPkgContent = await rootPkgFile.readJson<typeof rootPkg>();
      const tag = rootPkgContent.meilisearchReleaseTag;

      if (!tag) {
        console.warn("[grab] Could not find natsServerReleaseTag in root package.json. Skipping version updates.");
        return;
      }

      const version = rootPkg.version + "-" + tag.replace(/^v/, "");

      // 遍历所有 packages 目录下的 package.json 进行更新
      const packagesDir = path.resolve(process.cwd(), "packages");
      const subDirs = await (await import("node:fs/promises")).readdir(packagesDir, { withFileTypes: true });

      for (const dir of subDirs) {
        if (dir.isDirectory() && dir.name !== "sdk" && dir.name !== "demo") {
          const packageJsonFile = new FileEntry(path.join(packagesDir, dir.name, "package.json"));
          try {
            const content = await packageJsonFile.readJson<any>();
            if (content.name.startsWith("@gaubee/meilisearch-")) {
              content.version = version;
              await packageJsonFile.writeJson(content);
              console.log(`[grab] Updated version for ${content.name} to ${version}`);
            }
          } catch (e) {
            console.error("no founc package.json", dir, e);
            // 忽略不存在 package.json 的目录
          }
        }
      }
    },
  },
};

export default config;
