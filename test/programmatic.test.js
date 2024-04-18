import { jest } from "@jest/globals";
import fs from "fs";
import path from "path";
import sharp from "sharp";

import { parseAllAssets } from "../dist/process.js"; // "asset-resizer"
import log from "../dist/log.js";
import config from "./assetresizer.config.mjs";

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

  test("default config not found", async () => {
    await parseAllAssets();
    expect(spy.err).toHaveBeenCalled();
  });

  test("invalid config", async () => {
    await parseAllAssets("test/broken-config.js");
    expect(spy.err).toHaveBeenCalled();
  });

  test("valid config", async () => {
    await parseAllAssets("test/assetresizer.config.mjs");
    expect(spy.err).not.toHaveBeenCalled();
    await testAssets(config);
  });

  test("custom config", async () => {
    const config2 = structuredClone(config);
    config2.outputDir = "build2";
    await parseAllAssets(config2);
    expect(spy.err).not.toHaveBeenCalled();
    await testAssets(config2);
  });
});
