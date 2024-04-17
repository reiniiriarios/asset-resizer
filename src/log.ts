import chalk from "chalk";

const DEBUG_MODE = process.env.ASSET_RESIZE_DEBUG === "true";

export function log(any: unknown) {
  let out: string;
  if (typeof any === "object") {
    out = JSON.stringify(any, null, 2);
  } else if (typeof any !== "undefined") {
    out = any.toString();
  } else {
    out = "";
  }
  process.stdout.write(`${out}\n`);
}

export function err(message: string) {
  log(chalk.red(message));
}

export function debug(any: unknown) {
  if (DEBUG_MODE) {
    log(any);
  }
}
