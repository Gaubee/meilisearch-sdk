import { createRequire } from "node:module";
import os from "node:os";
import fs from "node:fs";

const resolveBindaryInfo = () => {
  const req =
    typeof require === "function" ? require : createRequire(process.argv[1]);

  const platform = os.platform();
  const arch = os.arch();
  let packageInfo: { name: string; binPath: string } | undefined;
  if (platform === "win32") {
    packageInfo = {
      name: "@gaubee/meilisearch-windows-amd64",
      binPath: req.resolve(
        "@gaubee/meilisearch-windows-amd64/meilisearch-windows-amd64.exe"
      ),
    };
  } else if (platform === "darwin") {
    if (arch === "arm64") {
      packageInfo = {
        name: "@gaubee/meilisearch-macos-apple-silicon",
        binPath: req.resolve(
          "@gaubee/meilisearch-macos-apple-silicon/meilisearch-macos-apple-silicon"
        ),
      };
    } else if (arch === "x64") {
      packageInfo = {
        name: "@gaubee/meilisearch-macos-amd64",
        binPath: req.resolve(
          "@gaubee/meilisearch-macos-amd64/meilisearch-macos-amd64"
        ),
      };
    }
  } else if (platform === "linux") {
    if (arch === "arm64") {
      packageInfo = {
        name: "@gaubee/meilisearch-linux-aarch64",
        binPath: req.resolve(
          "@gaubee/meilisearch-linux-aarch64/meilisearch-linux-aarch64"
        ),
      };
    } else if (arch === "x64") {
      packageInfo = {
        name: "@gaubee/meilisearch-linux-amd64",
        binPath: req.resolve(
          "@gaubee/meilisearch-linux-amd64/meilisearch-linux-amd64"
        ),
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
import { ChildProcess, spawn, spawnSync } from "node:child_process";
import { parseArgs } from "node:util";

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
      masterKey: Array.isArray(opts)
        ? parseArgs({
            args: opts,
            options: { ["master-key"]: { type: "string" } },
            strict: false,
          })
        : (opts.masterKey ?? ""),
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
            baseInfo.masterKey = info
              .split(">> --master-key ")[1]
              .split(" <<")[0]
              .trim();
          }

          resolve();
        }
      });
      cp.on("error", reject);
    });
    return baseInfo;
  }
}
type SdkOptions = {
  /**
   * Set the path to a configuration file that should be used to setup the engine. Format must be TOML
   */
  configFilePath: string;
  /**
   * Designates the location where database files will be created and retrieved
   *
   * [env: MEILI_DB_PATH=]
   * [default: ./data.ms]
   */
  dbPath: string;

  /**
   * Sets the directory where Meilisearch will create dump files
   *
   * [env: MEILI_DUMP_DIR=]
   * [default: dumps/]
   */
  dumpDir: string;

  /**
   * Configures the instance's environment. Value must be either `production` or `development`
   *
   * [env: MEILI_ENV=]
   * [default: development]
   * [possible values: development, production]
   */
  env: "development" | "production";

  /**
   * Experimental contains filter feature. For more information, see: <https://github.com/orgs/meilisearch/discussions/763>
   *
   * Enables the experimental contains filter operator.
   *
   * [env: MEILI_EXPERIMENTAL_CONTAINS_FILTER=]
   */
  experimentalContainsFilter: boolean;

  /**
   * Experimental drop search after. For more information, see: <https://github.com/orgs/meilisearch/discussions/783>
   *
   * Let you customize after how many seconds Meilisearch should consider a search request irrelevant and drop it. The default value is 60.
   *
   * [env: MEILI_EXPERIMENTAL_DROP_SEARCH_AFTER=]
   * [default: 60]
   */
  experimentalDropSearchAfter: number;

  /**
   *
   * Experimental logs route feature. For more information, see: <https://github.com/orgs/meilisearch/discussions/721>
   *
   * Enables the log routes on the `POST /logs/stream`, `POST /logs/stderr` endpoints, and the `DELETE /logs/stream` to stop receiving logs.
   *
   * [env: MEILI_EXPERIMENTAL_ENABLE_LOGS_ROUTE=]
   *
   */
  experimentalEnableLogsRoute: boolean;
  /**
   *
   * Experimental metrics feature. For more information, see: <https://github.com/meilisearch/meilisearch/discussions/3518>
   *
   * Enables the Prometheus metrics on the `GET /metrics` endpoint.
   *
   * [env: MEILI_EXPERIMENTAL_ENABLE_METRICS=]
   */
  experimentalEnableMetrics: boolean;

  /**
   *
   * Experimental logs mode feature. For more information, see: <https://github.com/orgs/meilisearch/discussions/723>
   *
   * Change the mode of the logs on the console.
   *
   * [env: MEILI_EXPERIMENTAL_LOGS_MODE=]
   * [default: HUMAN]
   */
  experimentalLogsMode: "HUMAN" | "JSON" | "human" | "json";
  /**
   *
   * Experimentally reduces the maximum number of tasks that will be processed at once, see: <https://github.com/orgs/meilisearch/discussions/713>
   *
   * [env: MEILI_EXPERIMENTAL_MAX_NUMBER_OF_BATCHED_TASKS=]
   * [default: 18446744073709551615]
   */
  experimentalMaxNumberOfBatchedTasks: number;
  /**
   *
   * Experimental number of searches per core. For more information, see: <https://github.com/orgs/meilisearch/discussions/784>
   *
   * Lets you customize how many search requests can run on each core concurrently. The default value is 4.
   *
   * [env: MEILI_EXPERIMENTAL_NB_SEARCHES_PER_CORE=]
   * [default: 4]
   */
  experimentalNbSearchesPerCore: number;
  /**
   *
   * Experimental RAM reduction during indexing, do not use in production, see: <https://github.com/meilisearch/product/discussions/652>
   *
   * [env: MEILI_EXPERIMENTAL_REDUCE_INDEXING_MEMORY_USAGE=]
   */
  experimentalReduceIndexingMemoryUsage: boolean;
  /**
   *
   * Enable multiple features that helps you to run meilisearch in a replicated context. For more information, see: <https://github.com/orgs/meilisearch/discussions/725>
   *
   * - /!\ Disable the automatic clean up of old processed tasks, you're in charge of that now - Lets you specify a custom task ID upon registering a task - Lets you execute dry-register a task (get an answer from the route but nothing is actually registered in meilisearch and it won't be processed)
   *
   * [env: MEILI_EXPERIMENTAL_REPLICATION_PARAMETERS=]
   */
  experimentalReplicationParameters: boolean;
  /**
   *
   * Experimental search queue size. For more information, see: <https://github.com/orgs/meilisearch/discussions/729>
   *
   * Lets you customize the size of the search queue. Meilisearch processes your search requests as fast as possible but once the queue is full it starts returning HTTP 503, Service Unavailable. The default value is 1000.
   *
   * [env: MEILI_EXPERIMENTAL_SEARCH_QUEUE_SIZE=]
   * [default: 1000]
   */
  experimentalSearchQueueSize: number;
  /**
   *
   * Sets the HTTP address and port Meilisearch will use
   *
   * [env: MEILI_HTTP_ADDR=]
   * [default: localhost:7700]
   */
  httpAddr: number;
  /**
   *
   * Sets the maximum size of accepted payloads. Value must be given in bytes or explicitly stating a base unit (for instance: 107374182400, '107.7Gb', or '107374 Mb')
   *
   * [env: MEILI_HTTP_PAYLOAD_SIZE_LIMIT=]
   * [default: 100000000]
   */
  httpPayloadSizeLimit: number;
  /**
   *
   * Prevents a Meilisearch instance with an existing database from throwing an error when using `--import-dump`. Instead, the dump will be ignored and Meilisearch will launch using the existing database.
   *
   * This option will trigger an error if `--import-dump` is not defined.
   *
   * [env: MEILI_IGNORE_DUMP_IF_DB_EXISTS=]
   */
  ignoreDumpIfDbExists: boolean;
  /**
   *
   * Prevents Meilisearch from throwing an error when `--import-dump` does not point to a valid dump file. Instead, Meilisearch will start normally without importing any dump.
   *
   * This option will trigger an error if `--import-dump` is not defined.
   *
   * [env: MEILI_IGNORE_MISSING_DUMP=]
   */
  ignoreMissingDump: boolean;
  /**
   *
   * Prevents a Meilisearch instance from throwing an error when `--import-snapshot` does not point to a valid snapshot file.
   *
   * This command will throw an error if `--import-snapshot` is not defined.
   *
   * [env: MEILI_IGNORE_MISSING_SNAPSHOT=]
   */
  ignoreMissingSnapshot: boolean;
  /**
   *
   * Prevents a Meilisearch instance with an existing database from throwing an error when using `--import-snapshot`. Instead, the snapshot will be ignored and Meilisearch will launch using the existing database.
   *
   * This command will throw an error if `--import-snapshot` is not defined.
   *
   * [env: MEILI_IGNORE_SNAPSHOT_IF_DB_EXISTS=]
   */
  ignoreSnapshotIfDbExists: boolean;
  /**
   *
   * Imports the dump file located at the specified path. Path must point to a `.dump` file. If a database already exists, Meilisearch will throw an error and abort launch
   *
   * [env: MEILI_IMPORT_DUMP=]
   */
  importDump: string;
  /**
   *
   * Launches Meilisearch after importing a previously-generated snapshot at the given filepath
   *
   * [env: MEILI_IMPORT_SNAPSHOT=]
   */
  importSnapshot: string;
  /**
   *
   * Defines how much detail should be present in Meilisearch's logs.
   *
   * Meilisearch currently supports six log levels, listed in order of increasing verbosity: OFF, ERROR, WARN, INFO, DEBUG, TRACE.
   *
   * [env: MEILI_LOG_LEVEL=]
   * [default: INFO]
   */
  logLevel: "OFF" | "ERROR" | "WARN" | "INFO" | "DEBUG" | "TRACE";
  /**
   *
   * Sets the instance's master key, automatically protecting all routes except `GET /health`
   *
   * [env: MEILI_MASTER_KEY=]
   */
  masterKey: string;
  /**
   *
   * Sets the maximum amount of RAM Meilisearch can use when indexing. By default, Meilisearch uses no more than two thirds of available memory
   *
   * [env: MEILI_MAX_INDEXING_MEMORY=]
   * [default: "10.666666666045785 GiB"]
   */
  maxIndexingMemory: string;
  /**
   *
   * Sets the maximum number of threads Meilisearch can use during indexation. By default, the indexer avoids using more than half of a machine's total processing units. This ensures Meilisearch is always ready to perform searches, even while you are updating an index
   *
   * [env: MEILI_MAX_INDEXING_THREADS=]
   * [default: 4]
   */
  maxIndexingThreads: number;
  /**
   *
   * Deactivates Meilisearch's built-in telemetry when provided.
   *
   * Meilisearch automatically collects data from all instances that do not opt out using this flag. All gathered data is used solely for the purpose of improving Meilisearch, and can be deleted at any time.
   *
   * [env: MEILI_NO_ANALYTICS=]
   */
  noAnalytics: boolean;

  /**
   *
   * Activates scheduled snapshots when provided. Snapshots are disabled by default.
   *
   * When provided with a value, defines the interval between each snapshot, in seconds.
   *
   * [env: MEILI_SCHEDULE_SNAPSHOT=]
   * [default: ]
   */
  scheduleSnapshot: number;
  /**
   *
   * Sets the directory where Meilisearch will store snapshots
   *
   * [env: MEILI_SNAPSHOT_DIR=]
   * [default: snapshots/]
   */
  snapshotDir: string;
  /**
   *
   * Enables client authentication in the specified path
   *
   * [env: MEILI_SSL_AUTH_PATH=]
   */
  sslAuthPath: string;
  /**
   *
   * Sets the server's SSL certificates
   *
   * [env: MEILI_SSL_CERT_PATH=]
   */
  sslCertPath: string;
  /**
   *
   * Sets the server's SSL key files
   *
   * [env: MEILI_SSL_KEY_PATH=]
   */
  sslKeyPath: string;
  /**
   *
   * Sets the server's OCSP file. *Optional*
   *
   * Reads DER-encoded OCSP response from OCSPFILE and staple to certificate.
   *
   * [env: MEILI_SSL_OCSP_PATH=]
   */
  sslOcspPath: string;
  /**
   *
   * Makes SSL authentication mandatory
   *
   * [env: MEILI_SSL_REQUIRE_AUTH=]
   */
  sslRequireAuth: boolean;
  /**
   *
   * Activates SSL session resumption
   *
   * [env: MEILI_SSL_RESUMPTION=]
   */
  sslResumption: boolean;
  /**
   *
   * Activates SSL tickets
   *
   * [env: MEILI_SSL_TICKETS=]
   */
  sslTickets: boolean;
  /**
   *
   * The Authorization header to send on the webhook URL whenever a task finishes so a third party can be notified
   *
   * [env: MEILI_TASK_WEBHOOK_AUTHORIZATION_HEADER=]
   */
  taskWebhookAuthorizationHeader: string;
  /**
   *
   * Called whenever a task finishes so a third party can be notified
   *
   * [env: MEILI_TASK_WEBHOOK_URL=]
   */
  taskWebhookUrl: string;
};