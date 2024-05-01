import * as fs from "fs";
import * as path from "path";
import { AssetResizerConfig } from "./types.js";
import log from "./log.js";
import chalk from "chalk";

const PROJ_ROOT = path.resolve(".");
const PROJ_CFG_FILENAME = "assetresizer.config";
const PROJ_CFG_FILE = path.join(PROJ_ROOT, PROJ_CFG_FILENAME);

// \u0000-\u001f\u007f-\u009f       control codes
// \u200B-\u200D\uFEFF\u2028\u2029  zero-width chars
// allow slashes, they are part of the path
const FORBIDDEN_CHARS = /[<>:"|?*\u200B-\u200D\uFEFF\u2028\u2029\u0000-\u001f\u007f-\u009f]/;

const configDefaults: AssetResizerConfig = {
  baseUrl: ".",
  inputDir: "",
  outputDir: "build",
  flatten: true,
  assets: [],
};

const dynamicImport = new Function("specifier", "return import(specifier)");

export async function loadConfig(file?: string): Promise<AssetResizerConfig | null> {
  if (!file) {
    // Autoload
    for (const ext of [".js", ".mjs", ".cjs"]) {
      if (fs.existsSync(PROJ_CFG_FILE + ext)) {
        file = PROJ_CFG_FILE + ext;
        log.msg(`Loading config from ${chalk.cyan(PROJ_CFG_FILENAME)}...`);
        break;
      }
    }
    if (!file) {
      log.err("Config not found.");
      log.msg(`Add config to ${chalk.cyan(`${PROJ_CFG_FILENAME}.js`)} in your project's root directory.`);
      log.msg(`See ${chalk.underline("https://github.com/reiniiriarios/asset-resizer#readme")} for documentation.`);
      return null;
    }
  } else {
    // Specified in config
    log.msg(`Loading config from ${chalk.cyan(file)}...`);
    // Make absolute if relative.
    if (!file.match(/^(?:\/|[a-z]:[/\\])/i)) {
      file = path.join(PROJ_ROOT, file);
    }
    if (!fs.existsSync(file)) {
      log.err("Config not found.");
      return null;
    }
  }

  // Windows fix for file:// protocol.
  if (file.match(/^[a-z]:[/\\]/i)) {
    file = `/${file.replace(/\\/g, "/")}`;
  }

  const { default: cfg }: { default: AssetResizerConfig } = await dynamicImport(`file://${file}`);
  if (!validateConfig(cfg)) {
    return null;
  }
  return { ...configDefaults, ...cfg };
}

function validateConfig(cfg: AssetResizerConfig | null | undefined): boolean {
  if (!cfg) {
    log.err("No asset resizer config loaded.");
    return false;
  }

  const errors: string[] = [];

  // Base config
  let baseUrlResolved = ".";
  if (!!cfg.baseUrl) {
    if (cfg.baseUrl.match(FORBIDDEN_CHARS)) {
      errors.push(`Illegal characters in base url`);
    } else {
      baseUrlResolved = path.resolve(cfg.baseUrl);
      if (!fs.existsSync(baseUrlResolved)) {
        errors.push(`Base url not found`);
      }
      if (!!cfg.inputDir) {
        if (cfg.baseUrl.match(FORBIDDEN_CHARS)) {
          errors.push(`Illegal characters in input directory`);
        } else if (!fs.existsSync(path.join(baseUrlResolved, cfg.inputDir))) {
          errors.push(`Input directory not found`);
        }
      }
    }
  }
  if (!cfg.outputDir) {
    errors.push(`No output directory configured`);
  } else if (cfg.outputDir.match(FORBIDDEN_CHARS)) {
    errors.push(`Illegal characters in output directory`);
  }
  if (!cfg.assets?.length) {
    errors.push("No assets listed");
  } else {
    // Assets config
    for (const asset of cfg.assets) {
      if (!asset.file) {
        errors.push(`No file for asset`);
      } else if (asset.file.match(FORBIDDEN_CHARS)) {
        errors.push(`Illegal characters in asset file`);
      } else if (!!cfg.baseUrl && !!cfg.inputDir) {
        const assetFilePath = path.join(baseUrlResolved, cfg.inputDir, asset.file);
        if (!fs.existsSync(assetFilePath)) {
          errors.push(`Asset file '${assetFilePath}' not found`);
        }
      }
      if (!asset.output?.length) {
        errors.push(`No outputs listed for asset '${asset.file}'`);
      } else {
        // Outputs config
        for (const output of asset.output) {
          if (!output.file) {
            errors.push(`No file for output in asset '${asset.file}'`);
          } else if (output.file.match(FORBIDDEN_CHARS)) {
            errors.push(`Illegal characters in asset file`);
          } else if (
            !output.copy &&
            !["jpg", "jpeg", "png", "gif", "webp", "avif", "tiff", "dzi", "v"].some((ext) =>
              output.file.endsWith(`.${ext}`),
            )
          ) {
            errors.push(`Invalid file extension for output '${output.file}'`);
          }
          if (!output.width && !output.copy) {
            errors.push(`No width specified and copy flag not present for '${output.file}'`);
          }
          if (
            !output.copy &&
            (!Number.isInteger(output.width) || (!!output.height && !Number.isInteger(output.height)))
          ) {
            errors.push(`Width/height for '${output.file}' not integers`);
          }
          if (!!output.fit && !["cover", "contain", "fill", "inside", "outside"].includes(output.fit)) {
            errors.push(`Unrecognized 'fit' value for '${output.file}'`);
          }
        }
      }
    }
  }
  if (errors.length > 0) {
    log.err("Errors in asset resizer config:");
    errors.forEach((e) => log.err(` * ${e}`));
    return false;
  }

  return true;
}
