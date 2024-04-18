import fs from "fs";
import path from "path";
import { AssetResizerAsset, AssetResizerConfig, AssetResizerOutput } from "./types.js";
import { loadConfig } from "./config.js";
import sharp from "sharp";
import log from "./log.js";
import chalk from "chalk";

export async function parseAllAssets(config?: AssetResizerConfig | string): Promise<void> {
  const cfg: AssetResizerConfig | null = !config || typeof config === "string" ? await loadConfig(config) : config;
  if (!cfg) {
    return;
  }

  const baseUrl = path.resolve(cfg.baseUrl ?? ".");
  const inputDir = cfg.inputDir ? path.join(baseUrl, cfg.inputDir) : baseUrl;
  const outputDir = path.join(baseUrl, cfg.outputDir);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  if (!cfg.assets.length) {
    log.err("No assets to parse. Check your config.");
    return;
  }

  const numAssets = cfg.assets.length;
  const numOutputs = cfg.assets.reduce((n, c) => n + c.output?.length ?? 0, 0);
  let numOutputsParsed = 0;

  log.msg("Processing assets...");
  await parseEachAsset(cfg.assets);

  async function parseEachAsset(assets: AssetResizerAsset[]): Promise<void> {
    for (const asset of assets) {
      for (const output of asset.output) {
        log.progress(numOutputsParsed, numOutputs);
        await parseAssetOutput(inputDir, asset.file, output);
        numOutputsParsed++;
      }
    }
    log.msg(`\r${chalk.green("Done!")} Processed: ${numAssets} input assets, ${numOutputs} created.`.padEnd(91, " "));
  }

  async function parseAssetOutput(inputDir: string, assetPath: string, output: AssetResizerOutput): Promise<boolean> {
    let outputPath = outputDir;
    if (!cfg?.flatten && assetPath.includes("/")) {
      // If not flattening, add additional directories from asset path to output path
      outputPath = path.join(outputDir, assetPath.split("/").slice(0, -1).join("/"));
      if (!fs.existsSync(outputPath)) {
        fs.mkdirSync(outputPath, { recursive: true });
      }
    }

    // If the output has slashes, create that directory tree first.
    if (output.file.includes("/")) {
      const addlDirs = path.join(outputPath, output.file.split("/").slice(0, -1).join("/"));
      if (!fs.existsSync(addlDirs)) {
        fs.mkdirSync(addlDirs, { recursive: true });
      }
    }

    try {
      await sharp(path.join(inputDir, assetPath))
        .resize(output.width, output.height ?? output.width, { fit: output.fit ?? "inside" })
        .toFile(path.join(outputPath, output.file))
        .catch((e) => {
          throw e;
        });
    } catch (e: any) {
      log.msg("\n");
      log.err(e.message ?? e.toString());
      return false;
    }

    return true;
  }
}
