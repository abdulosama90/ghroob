import { defineConfig } from "cf/config";

export default defineConfig({
  accountId: "6b951a474a34889cb6d7a51e727b8f3f",
  worker: {
    name: "ghroob-developer-site",
    compatibilityDate: "2026-11-15",
    domains: ["ghroob.dev", "www.ghroob.dev"],
    observability: {
      enabled: true,
      traces: {
        enabled: true,
      },
    },
    assets: {
      notFoundHandling: "single-page-application",
    },
  },
});
