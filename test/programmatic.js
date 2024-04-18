#!/usr/bin/env node

import { parseAllAssets } from "../dist/process.js"; // "asset-resizer"
import config from "./assetresizer.config.mjs";

(async function () {
  console.log("[test] Parsing by loading default config...");
  await parseAllAssets();

  console.log("");

  console.log("[test] Parsing by loading custom config...");
  await parseAllAssets("test/assetresizer.config.mjs");

  console.log("");

  console.log("[test] Parsing with specified config...");
  await parseAllAssets(config);
})();
