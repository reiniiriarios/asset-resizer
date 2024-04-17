import * as fs from "fs";
import * as path from "path";
import { AssetResizerConfig } from "./types.js";
import { err, log } from "./log.js";
import chalk from "chalk";

const PROJ_ROOT = path.resolve("./");
const PROJ_CFG_FILE = path.join(PROJ_ROOT, "assetresizer.config");

const configDefaults: AssetResizerConfig = {
  baseUrl: ".",
  inputDir: "",
  outputDir: "build",
  flatten: true,
  assets: [],
};

const dynamicImport = new Function("specifier", "return import(specifier)");

export async function loadConfig(): Promise<AssetResizerConfig | null> {
  for (const ext of [".js", ".mjs", ".cjs"]) {
    if (fs.existsSync(PROJ_CFG_FILE + ext)) {
      const cfg: { default: AssetResizerConfig } = await dynamicImport(`file://${PROJ_CFG_FILE}${ext}`);
      // @todo confirm config
      return { ...configDefaults, ...cfg.default };
    }
  }
  err("Config not found.");
  log(`Add config to ${chalk.cyan("assetresizer.config.js")} in your project's root directory.`);
  log(`See ${chalk.underline("@todo url here")} for documentation.`);
  return null;
}
