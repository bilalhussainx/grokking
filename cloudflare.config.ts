import { bindings, defineConfig, defineWorker } from "cf/config";

export default defineConfig({
  worker: defineWorker({
    name: "kairoslearn",
    entrypoint: "vinext/server/fetch-handler",
    compatibilityDate: "2026-11-27",
    domains: ["kairoslearn.com", "www.kairoslearn.com"],
    assets: {
      htmlHandling: "none",
      notFoundHandling: "none",
      runWorkerFirst: ["/*", "!/_next/static/*", "!/*/_next/static/*"],
    },
    env: {
      ASSETS: bindings.assets(),
    },
  }),
});
