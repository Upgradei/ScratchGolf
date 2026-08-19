import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    // Only the app's own unit tests. Vendored skills under .agents/.claude ship
    // their own node:test suites that vitest must not try to run.
    include: ["lib/**/*.test.ts"],
    exclude: ["node_modules", ".next", ".agents", ".claude", "designs"],
  },
});
