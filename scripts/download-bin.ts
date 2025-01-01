import { $ } from "execa";
const binarys = [
  "meilisearch-linux-aarch64",
  "meilisearch-macos-amd64",
  "meilisearch-windows-amd64.exe",
  "meilisearch-macos-apple-silicon",
  "meilisearch-linux-amd64",
];
const base = `https://github.com/meilisearch/meilisearch/releases/download/v1.12.0`;
for (const binaryName of binarys) {
  await $({
    stdio: "inherit",
  })`wget ${base}/${binaryName} -O packages/${binaryName.replace("meilisearch-", "").split(".")[0]}/${binaryName}`;
}
