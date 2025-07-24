import assert, { equal } from "node:assert";
import { test } from "vitest";
import { z } from "zod";
import rootPkg from "../../../package.json" with { type: "json" };
import { MeilisearchSdk } from "./index.js";

test("MeilisearchSdk", async () => {
  const sdk = new MeilisearchSdk();
  const info = await sdk.start({
    masterKey: "9963b5fe-461e-4425-ad93-e51b11199e46",
    noAnalytics: true,
  });

  const zInfoSchema = z.object({
    config: z.string(),
    database: z.string(),
    server: z.string(),
    environment: z.string(),
    commitSHA: z.string(),
    commitDate: z.string(),
    version: z.string(),
    masterKey: z.string(),
    anonymousTelemetry: z.boolean(),
    analyticsId: z.string(),
  });

  assert.ok(zInfoSchema.safeParse(info));
  equal("v" + info.version, rootPkg.meilisearchReleaseTag);

  sdk.stop();
});
