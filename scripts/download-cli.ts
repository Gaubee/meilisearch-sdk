import { doDownload, DownloadOptions } from "./download-binary";
import fetchRender from "./render";
import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import rootPkg from "../package.json" with { type: "json" };

const args = await yargs(hideBin(process.argv))
  .option("tag", {
    type: "string",
    alias: "t",
    default: rootPkg.meilisearchReleaseTag,
  })
  .option("interactive", {
    type: "boolean",
    alias: "i",
    default: false,
  })
  .option("skip-download", {
    type: "boolean",
    alias: "s",
    default: false,
  })
  .option("use-proxy", {
    type: "boolean",
    alias: "p",
    default: false,
  })
  .option("proxy-url", {
    type: "string",
    default: "https://ghfast.top/",
  }).argv;

const safeArgs = args satisfies DownloadOptions;

if (args.interactive) {
  fetchRender({ ...safeArgs, mode: "fetch" });
} else {
  doDownload({ ...safeArgs, mode: "wget" });
}
