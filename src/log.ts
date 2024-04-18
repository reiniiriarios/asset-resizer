import chalk from "chalk";

const DEBUG_MODE = process.env.ASSET_RESIZE_DEBUG === "true";

const PROGRESS_WIDTH = 80;

function str(any: unknown): string {
  if (typeof any === "object") {
    return JSON.stringify(any, null, 2);
  } else if (typeof any !== "undefined") {
    return any.toString();
  }
  return "";
}

export function log(any: unknown) {
  process.stdout.write(`${str(any)}\n`);
}

export function err(any: unknown) {
  process.stderr.write(`${chalk.red(str(any))}\n`);
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
