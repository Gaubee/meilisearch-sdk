import { MeilisearchSdk } from "./index.js";

const sdk = new MeilisearchSdk();
sdk.start(process.argv.slice(2));
