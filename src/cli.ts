#!/usr/bin/env node

import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import chalk from "chalk";
import { loadConfig } from "./config.js";
import { err, log } from "./log.js";
import { parseAllAssets } from "./process.js";

yargs(hideBin(process.argv))
  .scriptName("asset-resizer")
  .usage("Usage: $0 <command> [options]")
  .help("help")
  .alias("help", "h")
  .alias("version", "v")
  .option("config", {
    alias: "c",
    describe: "Path to custom config file",
    type: "string",
  })
  .command(
    "*",
    "",
    () => {},
    () => {
      log(`See ${chalk.magenta("asset-resizer --help")} for command options.`);
    },
  )
  .command(
    "config",
    "Output parsed config",
    () => {},
    (argv) => {
      loadConfig(argv.config)
        .then((cfg) => {
          if (cfg) {
            log(chalk.magenta("Asset Resizer Parsed Config:"));
            log(cfg);
          }
        })
        .catch((e) => err(e));
    },
  )
  .command(
    "parse",
    "Parse assets",
    () => {},
    (argv) => {
      if (argv.config) {
        loadConfig(argv.config)
          .then((cfg) => {
            if (cfg) {
              parseAllAssets(cfg);
            }
          })
          .catch((e) => err(e));
      } else {
        parseAllAssets();
      }
    },
  )
  .strict()
  .recommendCommands()
  .parse();
