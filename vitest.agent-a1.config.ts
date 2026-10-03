import { defineConfig } from "vitest/config";
export default defineConfig({ envDir: false, test: { environment: "node", include: ["src/lib/cc/agent/__tests__/*.test.ts"] } });
