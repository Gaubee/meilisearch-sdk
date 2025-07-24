import { defineConfig, type UserConfig } from "tsdown";
export default defineConfig(() => {
  return {
    entry: ["./src/index.ts", "./src/cli.ts"],
    format: ["cjs", "esm"],
    outDir: "bundle",
    dts: true,
  } satisfies UserConfig;
});
