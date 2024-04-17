import * as fs from "fs";
import * as path from "path";
import { AssetResizerConfig } from "./types.js";
import { err, log } from "./log.js";
import chalk from "chalk";

const PROJ_ROOT = path.resolve("./");
const PROJ_CFG_FILENAME = "assetresizer.config";
const PROJ_CFG_FILE = path.join(PROJ_ROOT, PROJ_CFG_FILENAME);

const configDefaults: AssetResizerConfig = {
  baseUrl: ".",
  inputDir: "",
  outputDir: "build",
  flatten: true,
  assets: [],
};

const dynamicImport = new Function("specifier", "return import(specifier)");

export async function loadConfig(file?: string): Promise<AssetResizerConfig | null> {
  async function importConfigFromFile(filepath: string): Promise<AssetResizerConfig | null> {
    const cfg: { default: AssetResizerConfig } = await dynamicImport(`file://${filepath}`);
    return cfg.default;
  }

  if (file) {
    log(`Loading config from ${chalk.cyan(file)}...`);
    const filePath = path.join(PROJ_ROOT, file);
    if (!fs.existsSync(filePath)) {
      err("Config not found.");
      return null;
    }
    const cfg = await importConfigFromFile(filePath);
    // @todo confirm config
    return { ...configDefaults, ...cfg };
  }

  for (const ext of [".js", ".mjs", ".cjs"]) {
    if (fs.existsSync(PROJ_CFG_FILE + ext)) {
      log(`Loading config from ${chalk.cyan(PROJ_CFG_FILENAME + ext)}...`);
      const cfg = await importConfigFromFile(PROJ_CFG_FILE + ext);
      // @todo confirm config
      return { ...configDefaults, ...cfg };
    }
  }
  err("Config not found.");
  log(`Add config to ${chalk.cyan(`${PROJ_CFG_FILENAME}.js`)} in your project's root directory.`);
  log(`See ${chalk.underline("@todo url here")} for documentation.`);
  return null;
}
