export type SdkOptions = {
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
   * Let you customize after how many seconds Meilisearch should consider a search request irrelevant and drop it.
   *
   * [env: MEILI_EXPERIMENTAL_DROP_SEARCH_AFTER=]
   * [default: 60]
   */
  experimentalDropSearchAfter: number;

  /**
   * Experimental dumpless upgrade. For more information, see: <https://github.com/orgs/meilisearch/discussions/804>
   *
   * When set, Meilisearch will auto-update its database without using a dump.
   *
   * [env: MEILI_EXPERIMENTAL_DUMPLESS_UPGRADE=]
   */
  experimentalDumplessUpgrade: boolean;

  /**
   * Enables experimental caching of search query embeddings. The value represents the maximal number of entries in the cache of each distinct embedder.
   *
   * For more information, see <https://github.com/orgs/meilisearch/discussions/818>.
   *
   * [env: MEILI_EXPERIMENTAL_EMBEDDING_CACHE_ENTRIES=]
   * [default: 0]
   */
  experimentalEmbeddingCacheEntries: number;

  /**
   * Experimental logs route feature. For more information, see: <https://github.com/orgs/meilisearch/discussions/721>
   *
   * Enables the log routes on the `POST /logs/stream`, `POST /logs/stderr` endpoints, and the `DELETE /logs/stream` to stop receiving logs.
   *
   * [env: MEILI_EXPERIMENTAL_ENABLE_LOGS_ROUTE=]
   */
  experimentalEnableLogsRoute: boolean;

  /**
   * Experimental metrics feature. For more information, see: <https://github.com/meilisearch/meilisearch/discussions/3518>
   *
   * Enables the Prometheus metrics on the `GET /metrics` endpoint.
   *
   * [env: MEILI_EXPERIMENTAL_ENABLE_METRICS=]
   */
  experimentalEnableMetrics: boolean;

  /**
   * Experimentally reduces the maximum total size, in bytes, of tasks that will be processed at once, see: <https://github.com/orgs/meilisearch/discussions/801>
   *
   * [env: MEILI_EXPERIMENTAL_LIMIT_BATCHED_TASKS_TOTAL_SIZE=]
   * [default: 18446744073709551615]
   */
  experimentalLimitBatchedTasksTotalSize: number | bigint;

  /**
   * Experimental logs mode feature. For more information, see: <https://github.com/orgs/meilisearch/discussions/723>
   *
   * Change the mode of the logs on the console.
   *
   * [env: MEILI_EXPERIMENTAL_LOGS_MODE=]
   * [default: HUMAN]
   */
  experimentalLogsMode: "HUMAN" | "JSON" | "human" | "json";

  /**
   * Experimentally reduces the maximum number of tasks that will be processed at once, see: <https://github.com/orgs/meilisearch/discussions/713>
   *
   * [env: MEILI_EXPERIMENTAL_MAX_NUMBER_OF_BATCHED_TASKS=]
   * [default: 18446744073709551615]
   */
  experimentalMaxNumberOfBatchedTasks: number | bigint;

  /**
   * Experimental number of searches per core. For more information, see: <https://github.com/orgs/meilisearch/discussions/784>
   *
   * Lets you customize how many search requests can run on each core concurrently. The default value is 4.
   *
   * [env: MEILI_EXPERIMENTAL_NB_SEARCHES_PER_CORE=]
   * [default: 4]
   */
  experimentalNbSearchesPerCore: number;

  /**
   * Experimental make dump imports use the old document indexer.
   *
   * When enabled, Meilisearch will use the old document indexer when importing dumps.
   *
   * For more information, see <https://github.com/orgs/meilisearch/discussions/851>.
   *
   * [env: MEILI_EXPERIMENTAL_NO_EDITION_2024_FOR_DUMPS=]
   */
  experimentalNoEdition2024ForDumps: boolean;

  /**
   * Experimental no edition 2024 for settings feature. For more information, see: <https://github.com/orgs/meilisearch/discussions/847>
   *
   * Enables the experimental no edition 2024 for settings feature.
   *
   * [env: MEILI_EXPERIMENTAL_NO_EDITION_2024_FOR_SETTINGS=]
   */
  experimentalNoEdition2024ForSettings: boolean;

  /**
   * Experimental no snapshot compaction feature.
   *
   * When enabled, Meilisearch will not compact snapshots during creation.
   *
   * For more information, see <https://github.com/orgs/meilisearch/discussions/833>.
   *
   * [env: MEILI_EXPERIMENTAL_NO_SNAPSHOT_COMPACTION=]
   */
  experimentalNoSnapshotCompaction: boolean;

  /**
   * Experimental RAM reduction during indexing, do not use in production, see: <https://github.com/meilisearch/product/discussions/652>
   *
   * [env: MEILI_EXPERIMENTAL_REDUCE_INDEXING_MEMORY_USAGE=]
   */
  experimentalReduceIndexingMemoryUsage: boolean;

  /**
   * Enable multiple features that helps you to run meilisearch in a replicated context. For more information, see: <https://github.com/orgs/meilisearch/discussions/725>
   *
   * - /!\ Disable the automatic clean up of old processed tasks, you're in charge of that now - Lets you specify a custom task ID upon registering a task - Lets you execute dry-register a task (get an answer from the route but nothing is actually registered in meilisearch and it won't be processed)
   *
   * [env: MEILI_EXPERIMENTAL_REPLICATION_PARAMETERS=]
   */
  experimentalReplicationParameters: boolean;

  /**
   * Experimental search queue size. For more information, see: <https://github.com/orgs/meilisearch/discussions/729>
   *
   * Lets you customize the size of the search queue. Meilisearch processes your search requests as fast as possible but once the queue is full it starts returning HTTP 503, Service Unavailable.
   *
   * [env: MEILI_EXPERIMENTAL_SEARCH_QUEUE_SIZE=]
   * [default: 1000]
   */
  experimentalSearchQueueSize: number;

  /**
   * Sets the HTTP address and port Meilisearch will use
   *
   * [env: MEILI_HTTP_ADDR=]
   * [default: localhost:7700]
   */
  httpAddr: string;

  /**
   * Sets the maximum size of accepted payloads. Value must be given in bytes or explicitly stating a base unit (for instance: 107374182400, '107.7Gb', or '107374 Mb')
   *
   * [env: MEILI_HTTP_PAYLOAD_SIZE_LIMIT=]
   * [default: 100000000]
   */
  httpPayloadSizeLimit: number | string;

  /**
   * Prevents a Meilisearch instance with an existing database from throwing an error when using `--import-dump`. Instead, the dump will be ignored and Meilisearch will launch using the existing database.
   *
   * This option will trigger an error if `--import-dump` is not defined.
   *
   * [env: MEILI_IGNORE_DUMP_IF_DB_EXISTS=]
   */
  ignoreDumpIfDbExists: boolean;

  /**
   * Prevents Meilisearch from throwing an error when `--import-dump` does not point to a valid dump file. Instead, Meilisearch will start normally without importing any dump.
   *
   * This option will trigger an error if `--import-dump` is not defined.
   *
   * [env: MEILI_IGNORE_MISSING_DUMP=]
   */
  ignoreMissingDump: boolean;

  /**
   * Prevents a Meilisearch instance from throwing an error when `--import-snapshot` does not point to a valid snapshot file.
   *
   * This command will throw an error if `--import-snapshot` is not defined.
   *
   * [env: MEILI_IGNORE_MISSING_SNAPSHOT=]
   */
  ignoreMissingSnapshot: boolean;

  /**
   * Prevents a Meilisearch instance with an existing database from throwing an error when using `--import-snapshot`. Instead, the snapshot will be ignored and Meilisearch will launch using the existing database.
   *
   * This command will throw an error if `--import-snapshot` is not defined.
   *
   * [env: MEILI_IGNORE_SNAPSHOT_IF_DB_EXISTS=]
   */
  ignoreSnapshotIfDbExists: boolean;

  /**
   * Imports the dump file located at the specified path. Path must point to a `.dump` file. If a database already exists, Meilisearch will throw an error and abort launch
   *
   * [env: MEILI_IMPORT_DUMP=]
   */
  importDump: string;

  /**
   * Launches Meilisearch after importing a previously-generated snapshot at the given filepath
   *
   * [env: MEILI_IMPORT_SNAPSHOT=]
   */
  importSnapshot: string;

  /**
   * Defines how much detail should be present in Meilisearch's logs.
   *
   * Meilisearch currently supports six log levels, listed in order of increasing verbosity: OFF, ERROR, WARN, INFO, DEBUG, TRACE.
   *
   * [env: MEILI_LOG_LEVEL=]
   * [default: INFO]
   */
  logLevel: "OFF" | "ERROR" | "WARN" | "INFO" | "DEBUG" | "TRACE";

  /**
   * Sets the instance's master key, automatically protecting all routes except `GET /health`
   *
   * [env: MEILI_MASTER_KEY=]
   */
  masterKey: string;

  /**
   * Sets the maximum amount of RAM Meilisearch can use when indexing. By default, Meilisearch uses no more than two thirds of available memory
   *
   * [env: MEILI_MAX_INDEXING_MEMORY=]
   * [default: "20.872957864776254 GiB"]
   */
  maxIndexingMemory: string;

  /**
   * Sets the maximum number of threads Meilisearch can use during indexation. By default, the indexer avoids using more than half of a machine's total processing units. This ensures Meilisearch is always ready to perform searches, even while you are updating an index
   *
   * [env: MEILI_MAX_INDEXING_THREADS=]
   * [default: unlimited]
   */
  maxIndexingThreads: number;

  /**
   * Deactivates Meilisearch's built-in telemetry when provided.
   *
   * Meilisearch automatically collects data from all instances that do not opt out using this flag. All gathered data is used solely for the purpose of improving Meilisearch, and can be deleted at any time.
   *
   * [env: MEILI_NO_ANALYTICS=]
   */
  noAnalytics: boolean;

  /**
   * Activates scheduled snapshots when provided. Snapshots are disabled by default.
   *
   * When provided with a value, defines the interval between each snapshot, in seconds.
   *
   * [env: MEILI_SCHEDULE_SNAPSHOT=]
   * [default: `disabled if not present, 86400 if present without a value`]
   */
  scheduleSnapshot: boolean | number;

  /**
   * Sets the directory where Meilisearch will store snapshots
   *
   * [env: MEILI_SNAPSHOT_DIR=]
   * [default: snapshots/]
   */
  snapshotDir: string;

  /**
   * Enables client authentication in the specified path
   *
   * [env: MEILI_SSL_AUTH_PATH=]
   */
  sslAuthPath: string;

  /**
   * Sets the server's SSL certificates
   *
   * [env: MEILI_SSL_CERT_PATH=]
   */
  sslCertPath: string;

  /**
   * Sets the server's SSL key files
   *
   * [env: MEILI_SSL_KEY_PATH=]
   */
  sslKeyPath: string;

  /**
   * Sets the server's OCSP file. *Optional*
   *
   * Reads DER-encoded OCSP response from OCSPFILE and staple to certificate.
   *
   * [env: MEILI_SSL_OCSP_PATH=]
   */
  sslOcspPath: string;

  /**
   * Makes SSL authentication mandatory
   *
   * [env: MEILI_SSL_REQUIRE_AUTH=]
   */
  sslRequireAuth: boolean;

  /**
   * Activates SSL session resumption
   *
   * [env: MEILI_SSL_RESUMPTION=]
   */
  sslResumption: boolean;

  /**
   * Activates SSL tickets
   *
   * [env: MEILI_SSL_TICKETS=]
   */
  sslTickets: boolean;

  /**
   * The Authorization header to send on the webhook URL whenever a task finishes so a third party can be notified. See also the dedicated API `/webhooks`
   *
   * [env: MEILI_TASK_WEBHOOK_AUTHORIZATION_HEADER=]
   */
  taskWebhookAuthorizationHeader: string;

  /**
   * Called whenever a task finishes so a third party can be notified. See also the dedicated API `/webhooks`
   *
   * [env: MEILI_TASK_WEBHOOK_URL=]
   */
  taskWebhookUrl: string;
};
