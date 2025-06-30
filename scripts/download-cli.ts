import { doDownload, DownloadOptions } from "./download-binary";
import fetchRender from "./render";
import yargs from "yargs";
import { hideBin } from "yargs/helpers";

const args = await yargs(hideBin(process.argv))
  .option("tag", {
    type: "string",
    alias: "t",
  })
  .option("interactive", {
    type: "boolean",
    alias: "i",
    description: "interactive mode",
    default: false,
  })
  .option("skip-download", {
    type: "boolean",
    default: false,
  })
  .option("use-proxy", {
    type: "boolean",
    default: true,
  })
  .option("proxy-url", {
    type: "string",
    default: "https://ghfast.top/",
  })
  .option("mode", {
    choices: ["fetch", "wget"] as const,
    default: "fetch",
    description:
      "fetch means download single binary, wget means download a whole directory",
  }).argv;

const safeArgs = args as unknown as DownloadOptions;

if (args.interactive) {
  fetchRender(safeArgs);
} else {
  doDownload(safeArgs);
}
