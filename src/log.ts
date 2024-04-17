import chalk from "chalk";

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
