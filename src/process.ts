import fs from "fs";
import path from "path";
import { AssetResizerAsset, AssetResizerConfig, AssetResizerOutput } from "./types.js";
import { loadConfig } from "./config.js";
import sharp from "sharp";
import { err, log, progress } from "./log.js";
import chalk from "chalk";

export async function parseAllAssets(config?: AssetResizerConfig) {
  if (!config) {
    const loadedConfig = await loadConfig();
    if (!loadedConfig) {
      return;
    }
    config = loadedConfig;
  }

  const baseUrl = path.resolve(config.baseUrl ?? ".");
  const inputDir = config.inputDir ? path.join(baseUrl, config.inputDir) : baseUrl;
  const outputDir = path.join(baseUrl, config.outputDir);
  if (!fs.existsSync(baseUrl)) {
    err("Base path not found. Check your config.");
  }
  if (!fs.existsSync(inputDir)) {
    err("Input path not found. Check your config.");
  }
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  if (!config.assets.length) {
    err("No assets to parse. Check your config.");
    return;
  }

  const numAssets = config.assets.length;
  const numOutputs = config.assets.reduce((n, c) => n + c.output?.length ?? 0, 0);
  let numOutputsParsed = 0;

  log("Processing...");
  parseEachAsset(config.assets);

  async function parseEachAsset(assets: AssetResizerAsset[]) {
    for (const asset of assets) {
      const assetPath = path.join(inputDir, asset.file);
      for (const output of asset.output) {
        progress(numOutputsParsed, numOutputs);
        await parseAssetOutput(assetPath, output);
        numOutputsParsed++;
      }
    }
    log(`\r${chalk.green("Done!")} Processed: ${numAssets} input assets, ${numOutputs} created.`.padEnd(91, " "));
  }

  async function parseAssetOutput(assetPath: string, output: AssetResizerOutput) {
    if (!config?.flatten) {
      // @todo create intermediate directories
    }

    const outputPath = path.join(outputDir, output.filename);
    await sharp(assetPath)
      .resize(output.width, output.height ?? output.width, { fit: output.fit ?? "inside" })
      .toFile(outputPath)
      .catch((e) => {
        log("\n");
        err(e);
      });
  }
}
