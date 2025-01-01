import { deepEqual, equal } from "node:assert";
import test from "node:test";
import { MeilisearchSdk } from "./index.js";
test("version", () => {
  const sdk = new MeilisearchSdk();
  equal(sdk.version(), "1.12.0");
});
test("start", async () => {
  const sdk = new MeilisearchSdk();
  const info = await sdk.start({
    masterKey: "9963b5fe-461e-4425-ad93-e51b11199e46",
    noAnalytics: true,
  });
  deepEqual(info, {
    config: "none",
    database: "./data.ms",
    server: "http://localhost:7700",
    environment: "development",
    commitSHA: "ba11121cfc822438659ccb4120327c0c211a2796",
    commitDate: "2024-12-12T17:16:53Z",
    version: "1.12.0",
    masterKey: "9963b5fe-461e-4425-ad93-e51b11199e46",
    anonymousTelemetry: false,
    analyticsId: "",
  });
  sdk.stop();
});
