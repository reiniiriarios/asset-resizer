import chalk from "chalk";

const DEBUG_MODE = process.env.ASSET_RESIZE_DEBUG === "true";

const PROGRESS_WIDTH = 80;

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

export function progress(position: number, max: number) {
  const percent = position / max;
  const pips = Math.round(percent * (PROGRESS_WIDTH - 2));
  const spaces = PROGRESS_WIDTH - 2 - pips;
  process.stdout.write(`\r[${"#".repeat(pips)}${" ".repeat(spaces)}]`);
}
