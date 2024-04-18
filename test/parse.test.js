import { jest, expect, describe, test } from "@jest/globals";
import fs from "fs";
import path from "path";
import sharp from "sharp";
import { execSync } from "child_process";

import { parseAllAssets } from "../dist/process.js"; // "asset-resizer"
import log from "../dist/log.js";
import config from "./test.config.mjs";
import cliConfig from "./cli.config.mjs";

async function testAssets(cfg) {
  for (const asset of cfg.assets) {
    for (const output of asset.output) {
      // file exists
      const filePath = path.join("test", cfg.outputDir, output.filename);
      expect(fs.existsSync(filePath)).toBe(true);
      // metadata is correct
      const meta = await sharp(filePath).metadata();
      // don't test inside and outside width, they vary
      if (output.width && output.fit && !["inside", "outside"].includes(output.fit)) {
        expect(meta.width).toBe(output.width);
        const height = output.height ? output.height : output.width;
        expect(meta.height).toBe(height);
      }
    }
  }
}

describe("parseAllAssets", () => {
  let spy = {};

  beforeEach(() => {
    spy.err = jest.spyOn(log, "err").mockImplementation(() => {});
    spy.msg = jest.spyOn(log, "msg").mockImplementation(() => {});
    spy.progress = jest.spyOn(log, "progress").mockImplementation(() => {});
  });

  afterEach(() => {
    spy.err.mockClear();
  });

  afterAll(() => {
    spy.err.mockRestore();
  });

  test("fails on default config not found", async () => {
    await parseAllAssets();
    expect(spy.err).toHaveBeenCalled();
  });

  test("fails on invalid config", async () => {
    await parseAllAssets("test/broken-config.js");
    expect(spy.err).toHaveBeenCalled();
  });

  test("correctly builds assets with config file", async () => {
    await parseAllAssets("test/test.config.mjs");
    expect(spy.err).not.toHaveBeenCalled();
    await testAssets(config);
  });

  test("correctly builds assets with custom config", async () => {
    const config2 = structuredClone(config);
    config2.outputDir = "build/test2";
    await parseAllAssets(config2);
    expect(spy.err).not.toHaveBeenCalled();
    await testAssets(config2);
  });
});

describe("cli", () => {
  test("correctly builds assets", async () => {
    execSync("npx asset-resizer parse --config test/cli.config.mjs");
    for (const asset of cliConfig.assets) {
      for (const output of asset.output) {
        // file exists
        const filePath = path.join("test", cliConfig.outputDir, output.filename);
        expect(fs.existsSync(filePath)).toBe(true);
        // metadata is correct
        const meta = await sharp(filePath).metadata();
        // don't test inside and outside width, they vary
        if (output.width && output.fit && !["inside", "outside"].includes(output.fit)) {
          expect(meta.width).toBe(output.width);
          const height = output.height ? output.height : output.width;
          expect(meta.height).toBe(height);
        }
      }
    }
  }, 7500); // sometimes takes a little longer
});
