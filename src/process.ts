// function processImage(path: string, width: number, height: number, quality: number, format: string) {}

import path from "path";
import { AssetResizerAsset, AssetResizerConfig, AssetResizerOutput } from "./types.js";
import { loadConfig } from "./config.js";
import sharp from "sharp";
import { err } from "./log.js";

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

  if (!config.assets.length) {
    err("No assets to parse. Check your config.");
    return;
  }

  parseEachAsset(config.assets);

  async function parseEachAsset(assets: AssetResizerAsset[]) {
    for (const asset of assets) {
      const assetPath = path.join(inputDir, asset.file);
      for (const output of asset.output) {
        await parseAssetOutput(assetPath, output);
      }
    }
  }

  async function parseAssetOutput(assetPath: string, output: AssetResizerOutput) {
    const outputPath = path.join(outputDir, output.filename);
    await sharp(assetPath)
      .resize(output.width, output.height ?? output.width, { fit: output.fit ?? "inside" })
      .toFile(outputPath)
      .catch((e) => err(e));
  }
}
