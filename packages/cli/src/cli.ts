import { spawn } from "node:child_process";
import { resolveBindaryInfo } from "./binary.js";
const info = resolveBindaryInfo();
const cp = spawn(info.binPath, process.argv.slice(2));
cp.on("exit", process.exit);
