import { MeilisearchSdk } from "./index";

const sdk = new MeilisearchSdk();
sdk.start(process.argv.slice(2));
