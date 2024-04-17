#!/usr/bin/env node

import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import chalk from "chalk";
import { loadConfig } from "./config.js";
import { err, log } from "./log.js";
import { parseAllAssets } from "./process.js";

export interface CliOptions {}

yargs(hideBin(process.argv))
  .scriptName("asset-resizer")
  .usage("Usage: $0 <command> [options]")
  .help("help")
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
    () => {
      loadConfig()
        .then((cfg) => {
          log(chalk.magenta("Asset Resizer Parsed Config:"));
          log(cfg);
        })
        .catch((e) => err(e));
    },
  )
  .command(
    "parse",
    "Parse assets",
    {
      config: {
        alias: "c",
        describe: "Optional path to config file",
        default: "",
      },
    },
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
