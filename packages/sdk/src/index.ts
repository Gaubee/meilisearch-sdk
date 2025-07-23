import { ChildProcess, spawn, spawnSync } from "node:child_process";
import { parseArgs } from "node:util";
import { resolveBindaryInfo } from "./binary.js";
import type { SdkOptions } from "./options.js";
export type { SdkOptions } from "./options.js";

export class MeilisearchSdk {
  info = resolveBindaryInfo();
  version() {
    return spawnSync(this.info.binPath, ["--version"], {
      stdio: "pipe",
    })
      .stdout.toString()
      .trim()
      .split(" ")[1];
  }
  cp: ChildProcess | undefined;

  stop() {
    this.cp?.kill();
    this.cp = undefined;
  }
  async start(opts: Partial<SdkOptions> | string[] = {}) {
    this.stop();

    const args: string[] = [];
    if (Array.isArray(opts)) {
      args.push(...opts);
    } else {
      for (const key in opts) {
        const value = (opts as any)[key];
        const param = `--${key.replace(/[A-Z]/g, (c) => "-" + c.toLowerCase())}`;
        const type = typeof value;
        if (type === "string") {
          args.push(param, value);
        } else if (type === "number") {
          args.push(param, String(value));
        } else if (type === "boolean") {
          args.push(param);
        }
      }
    }
    const cp = spawn(this.info.binPath, args, {
      stdio: "pipe",
    });

    this.cp = cp;
    cp.stdout.on("data", (chunk) => {
      process.stdout.write(chunk);
    });
    cp.stderr.on("data", (chunk) => {
      process.stderr.write(chunk);
    });

    const baseInfo = {
      config: "", // "none",
      database: "", // "./data.ms",
      server: "", // "http://localhost:7700",
      environment: "", // "development",
      commitSHA: "", // "ba11121cfc822438659ccb4120327c0c211a2796",
      commitDate: "", // "2024-12-12T17:16:53Z",
      version: "", // "1.12.0",
      masterKey:
        (Array.isArray(opts)
          ? (parseArgs({
              args: opts,
              options: { ["master-key"]: { type: "string" } },
              strict: false,
            }).values["master-key"] as string)
          : opts.masterKey) ?? "",
      anonymousTelemetry: true,
      analyticsId: "",
    };
    await new Promise<void>((resolve, reject) => {
      let info = "";
      cp.stderr.on("data", function onHeader(chunk) {
        info += chunk.toString();
        if (info.includes("https://discord.meilisearch.com")) {
          cp.stderr.off("data", onHeader);
          info.split("\n").map((line) => {
            const [key, value] = line.split(":\t").map((it) => it.trim());
            let prop: keyof typeof baseInfo | undefined;
            if (key === "Config file path") {
              prop = "config";
            } else if (key === "Database path") {
              prop = "database";
            } else if (key === "Server listening on") {
              prop = "server";
            } else if (key === "Environment") {
              prop = "environment";
            } else if (key === "Commit SHA") {
              prop = "commitSHA";
            } else if (key === "Commit date") {
              prop = "commitDate";
            } else if (key === "Package version") {
              prop = "version";
            } else if (key === "Anonymous telemetry") {
              prop = "anonymousTelemetry";
            } else if (key === "Instance UID") {
              prop = "analyticsId";
            }
            if (prop) {
              if (prop === "anonymousTelemetry") {
                baseInfo[prop] = value === `"Enabled"`;
              } else {
                baseInfo[prop] = value.slice(1, -1);
              }
            }
          });
          if (info.includes(">> --master-key ")) {
            baseInfo.masterKey = info.split(">> --master-key ")[1].split(" <<")[0].trim();
          }

          resolve();
        }
      });
      cp.on("error", reject);
    });
    return baseInfo;
  }
}
