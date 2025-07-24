# Meilisearch-SDK

## install

```
npm install @gaubee/meilisearch-sdk
```

## sdk usage

```ts
import { MeilisearchSdk } from "@gaubee/meilisearch-sdk";
const sdk = new MeilisearchSdk();
const info = await sdk.start({
  // cli options
  masterKey: "9963b5fe-461e-4425-ad93-e51b11199e46",
  noAnalytics: true,
});

console.log(info);
// {
//   config: "none",
//   database: "./data.ms",
//   server: "http://localhost:7700",
//   environment: "development",
//   commitSHA: "ba11121cfc822438659ccb4120327c0c211a2796",
//   commitDate: "2024-12-12T17:16:53Z",
//   version: "1.12.0",
//   masterKey: "9963b5fe-461e-4425-ad93-e51b11199e46",
//   anonymousTelemetry: false,
//   analyticsId: "",
// }
```

## cli usage

```
Usage: meilisearch [OPTIONS]
Options:
      --config-file-path <CONFIG_FILE_PATH>
          Set the path to a configuration file that should be used to setup the engine. Format must be TOML

      --db-path <DB_PATH>
          Designates the location where database files will be created and retrieved

          [env: MEILI_DB_PATH=]
          [default: ./data.ms]

      --dump-dir <DUMP_DIR>
          Sets the directory where Meilisearch will create dump files

          [env: MEILI_DUMP_DIR=]
          [default: dumps/]

      --env <ENV>
          Configures the instance's environment. Value must be either `production` or `development`

          [env: MEILI_ENV=]
          [default: development]
          [possible values: development, production]

      --experimental-contains-filter
          Experimental contains filter feature. For more information, see: <https://github.com/orgs/meilisearch/discussions/763>

          Enables the experimental contains filter operator.

          [env: MEILI_EXPERIMENTAL_CONTAINS_FILTER=]

      --experimental-drop-search-after <EXPERIMENTAL_DROP_SEARCH_AFTER>
          Experimental drop search after. For more information, see: <https://github.com/orgs/meilisearch/discussions/783>

          Let you customize after how many seconds Meilisearch should consider a search request irrelevant and drop it. The default value is 60.

          [env: MEILI_EXPERIMENTAL_DROP_SEARCH_AFTER=]
          [default: 60]

      --experimental-enable-logs-route
          Experimental logs route feature. For more information, see: <https://github.com/orgs/meilisearch/discussions/721>

          Enables the log routes on the `POST /logs/stream`, `POST /logs/stderr` endpoints, and the `DELETE /logs/stream` to stop receiving logs.

          [env: MEILI_EXPERIMENTAL_ENABLE_LOGS_ROUTE=]

      --experimental-enable-metrics
          Experimental metrics feature. For more information, see: <https://github.com/meilisearch/meilisearch/discussions/3518>

          Enables the Prometheus metrics on the `GET /metrics` endpoint.

          [env: MEILI_EXPERIMENTAL_ENABLE_METRICS=]

      --experimental-logs-mode <EXPERIMENTAL_LOGS_MODE>
          Experimental logs mode feature. For more information, see: <https://github.com/orgs/meilisearch/discussions/723>

          Change the mode of the logs on the console.

          [env: MEILI_EXPERIMENTAL_LOGS_MODE=]
          [default: HUMAN]

      --experimental-max-number-of-batched-tasks <EXPERIMENTAL_MAX_NUMBER_OF_BATCHED_TASKS>
          Experimentally reduces the maximum number of tasks that will be processed at once, see: <https://github.com/orgs/meilisearch/discussions/713>

          [env: MEILI_EXPERIMENTAL_MAX_NUMBER_OF_BATCHED_TASKS=]
          [default: 18446744073709551615]

      --experimental-nb-searches-per-core <EXPERIMENTAL_NB_SEARCHES_PER_CORE>
          Experimental number of searches per core. For more information, see: <https://github.com/orgs/meilisearch/discussions/784>

          Lets you customize how many search requests can run on each core concurrently. The default value is 4.

          [env: MEILI_EXPERIMENTAL_NB_SEARCHES_PER_CORE=]
          [default: 4]

      --experimental-reduce-indexing-memory-usage
          Experimental RAM reduction during indexing, do not use in production, see: <https://github.com/meilisearch/product/discussions/652>

          [env: MEILI_EXPERIMENTAL_REDUCE_INDEXING_MEMORY_USAGE=]

      --experimental-replication-parameters
          Enable multiple features that helps you to run meilisearch in a replicated context. For more information, see: <https://github.com/orgs/meilisearch/discussions/725>

          - /!\ Disable the automatic clean up of old processed tasks, you're in charge of that now - Lets you specify a custom task ID upon registering a task - Lets you execute dry-register a task (get an answer from the route but nothing is actually registered in meilisearch and it won't be processed)

          [env: MEILI_EXPERIMENTAL_REPLICATION_PARAMETERS=]

      --experimental-search-queue-size <EXPERIMENTAL_SEARCH_QUEUE_SIZE>
          Experimental search queue size. For more information, see: <https://github.com/orgs/meilisearch/discussions/729>

          Lets you customize the size of the search queue. Meilisearch processes your search requests as fast as possible but once the queue is full it starts returning HTTP 503, Service Unavailable. The default value is 1000.

          [env: MEILI_EXPERIMENTAL_SEARCH_QUEUE_SIZE=]
          [default: 1000]

  -h, --help
          Print help (see a summary with '-h')

      --http-addr <HTTP_ADDR>
          Sets the HTTP address and port Meilisearch will use

          [env: MEILI_HTTP_ADDR=]
          [default: localhost:7700]

      --http-payload-size-limit <HTTP_PAYLOAD_SIZE_LIMIT>
          Sets the maximum size of accepted payloads. Value must be given in bytes or explicitly stating a base unit (for instance: 107374182400, '107.7Gb', or '107374 Mb')

          [env: MEILI_HTTP_PAYLOAD_SIZE_LIMIT=]
          [default: 100000000]

      --ignore-dump-if-db-exists
          Prevents a Meilisearch instance with an existing database from throwing an error when using `--import-dump`. Instead, the dump will be ignored and Meilisearch will launch using the existing database.

          This option will trigger an error if `--import-dump` is not defined.

          [env: MEILI_IGNORE_DUMP_IF_DB_EXISTS=]

      --ignore-missing-dump
          Prevents Meilisearch from throwing an error when `--import-dump` does not point to a valid dump file. Instead, Meilisearch will start normally without importing any dump.

          This option will trigger an error if `--import-dump` is not defined.

          [env: MEILI_IGNORE_MISSING_DUMP=]

      --ignore-missing-snapshot
          Prevents a Meilisearch instance from throwing an error when `--import-snapshot` does not point to a valid snapshot file.

          This command will throw an error if `--import-snapshot` is not defined.

          [env: MEILI_IGNORE_MISSING_SNAPSHOT=]

      --ignore-snapshot-if-db-exists
          Prevents a Meilisearch instance with an existing database from throwing an error when using `--import-snapshot`. Instead, the snapshot will be ignored and Meilisearch will launch using the existing database.

          This command will throw an error if `--import-snapshot` is not defined.

          [env: MEILI_IGNORE_SNAPSHOT_IF_DB_EXISTS=]

      --import-dump <IMPORT_DUMP>
          Imports the dump file located at the specified path. Path must point to a `.dump` file. If a database already exists, Meilisearch will throw an error and abort launch

          [env: MEILI_IMPORT_DUMP=]

      --import-snapshot <IMPORT_SNAPSHOT>
          Launches Meilisearch after importing a previously-generated snapshot at the given filepath

          [env: MEILI_IMPORT_SNAPSHOT=]

      --log-level <LOG_LEVEL>
          Defines how much detail should be present in Meilisearch's logs.

          Meilisearch currently supports six log levels, listed in order of increasing verbosity: OFF, ERROR, WARN, INFO, DEBUG, TRACE.

          [env: MEILI_LOG_LEVEL=]
          [default: INFO]

      --master-key <MASTER_KEY>
          Sets the instance's master key, automatically protecting all routes except `GET /health`

          [env: MEILI_MASTER_KEY=]

      --max-indexing-memory <MAX_INDEXING_MEMORY>
          Sets the maximum amount of RAM Meilisearch can use when indexing. By default, Meilisearch uses no more than two thirds of available memory

          [env: MEILI_MAX_INDEXING_MEMORY=]
          [default: "10.666666666045785 GiB"]

      --max-indexing-threads <MAX_INDEXING_THREADS>
          Sets the maximum number of threads Meilisearch can use during indexation. By default, the indexer avoids using more than half of a machine's total processing units. This ensures Meilisearch is always ready to perform searches, even while you are updating an index

          [env: MEILI_MAX_INDEXING_THREADS=]
          [default: 4]

      --no-analytics
          Deactivates Meilisearch's built-in telemetry when provided.

          Meilisearch automatically collects data from all instances that do not opt out using this flag. All gathered data is used solely for the purpose of improving Meilisearch, and can be deleted at any time.

          [env: MEILI_NO_ANALYTICS=]

      --schedule-snapshot [<SNAPSHOT_INTERVAL_SEC>]
          Activates scheduled snapshots when provided. Snapshots are disabled by default.

          When provided with a value, defines the interval between each snapshot, in seconds.

          [env: MEILI_SCHEDULE_SNAPSHOT=]
          [default: ]

      --snapshot-dir <SNAPSHOT_DIR>
          Sets the directory where Meilisearch will store snapshots

          [env: MEILI_SNAPSHOT_DIR=]
          [default: snapshots/]

      --ssl-auth-path <SSL_AUTH_PATH>
          Enables client authentication in the specified path

          [env: MEILI_SSL_AUTH_PATH=]

      --ssl-cert-path <SSL_CERT_PATH>
          Sets the server's SSL certificates

          [env: MEILI_SSL_CERT_PATH=]

      --ssl-key-path <SSL_KEY_PATH>
          Sets the server's SSL key files

          [env: MEILI_SSL_KEY_PATH=]

      --ssl-ocsp-path <SSL_OCSP_PATH>
          Sets the server's OCSP file. *Optional*

          Reads DER-encoded OCSP response from OCSPFILE and staple to certificate.

          [env: MEILI_SSL_OCSP_PATH=]

      --ssl-require-auth
          Makes SSL authentication mandatory

          [env: MEILI_SSL_REQUIRE_AUTH=]

      --ssl-resumption
          Activates SSL session resumption

          [env: MEILI_SSL_RESUMPTION=]

      --ssl-tickets
          Activates SSL tickets

          [env: MEILI_SSL_TICKETS=]

      --task-webhook-authorization-header <TASK_WEBHOOK_AUTHORIZATION_HEADER>
          The Authorization header to send on the webhook URL whenever a task finishes so a third party can be notified

          [env: MEILI_TASK_WEBHOOK_AUTHORIZATION_HEADER=]

      --task-webhook-url <TASK_WEBHOOK_URL>
          Called whenever a task finishes so a third party can be notified

          [env: MEILI_TASK_WEBHOOK_URL=]

  -V, --version
          Print version
```
