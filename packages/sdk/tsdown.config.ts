import { defineConfig, type UserConfig } from "tsdown";
export default defineConfig(() => {
  return {
    entry: "./src/index.ts",
    format: ["cjs", "esm"],
    outDir: "bundle",
  } satisfies UserConfig;
});
