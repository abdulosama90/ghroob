import { defineConfig } from "cf/config";

export default defineConfig({
  worker: {
    "name": "ghroob-developer-site",
      "compatibilityDate": "2026-11-15",
      "domains": ["ghroob.dev", "www.ghroob.dev"],
    "observability": {
        "enabled": true,
        "traces": {
          "enabled": true
        }
    },
    "assets": {
      "notFoundHandling": "single-page-application"
    }
  }
});
