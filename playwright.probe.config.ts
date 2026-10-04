// TEMPORARY: used only by the filter-pulse probe workflow. Same settings as the
// main config, but with no webServer of its own (the workflow serves `out/`).
import base from "./playwright.config";
import { defineConfig } from "@playwright/test";

export default defineConfig({
  ...base,
  webServer: undefined,
  retries: 0,
  use: { ...base.use, video: "off", trace: "off" },
});
