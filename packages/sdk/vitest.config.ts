import { defineConfig } from "vitest/config";
export default defineConfig(() => {
  return {
    test: {
      include: ["src/**/*.test.ts"],
    },
  };
});
