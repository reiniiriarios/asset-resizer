#!/usr/bin/env node

import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import chalk from "chalk";
import { loadConfig } from "./config.js";
import log from "./log.js";
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
      log.msg(`See ${chalk.magenta("asset-resizer --help")} for command options.`);
      log.msg(`See ${chalk.underline("https://github.com/reiniiriarios/asset-resizer#readme")} for documentation.`);
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
            log.msg(chalk.magenta("Asset Resizer Parsed Config:"));
            log.msg(cfg);
          }
        })
        .catch((e) => log.err(e));
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
          .catch((e) => log.err(e));
      } else {
        parseAllAssets();
      }
    },
  )
  .strict()
  .recommendCommands()
  .parse();
