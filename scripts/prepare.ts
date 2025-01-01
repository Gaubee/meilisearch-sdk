import { doDownload } from "./download-binary";
import fetchRender from "./render";
import { parseArgs } from "@std/cli/parse-args";

const args = parseArgs(process.argv.slice(2), {
  string: ["mode"],
  alias: {
    m: "mode",
  },
  default: {
    mode: "fetch",
  },
});
if (args.mode === "fetch") {
  fetchRender();
} else {
  doDownload({ mode: args.mode as any });
}
