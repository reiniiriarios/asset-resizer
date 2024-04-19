import { parseAllAssets, AssetResizerConfig } from "asset-resizer";
// alt: const { parseAllAssets } = require("asset-resizer");

// With default config file
parseAllAssets().then(() => {
  console.log("done");
});

// With specified config file
parseAllAssets("custom.config.js").then(() => {
  console.log("done");
});

// With programmatic config
const config: AssetResizerConfig = {
  baseUrl: ".",
  inputDir: "assets",
  outputDir: "build",
  flatten: true,
  assets: [
    {
      file: "300x300.svg",
      output: [
        {
          file: "50x50.png",
          width: 50,
        },
        {
          file: "200x100.png",
          width: 200,
          height: 100,
        },
        {
          file: "200x100-contain.png",
          width: 200,
          height: 100,
          fit: "contain",
        },
      ],
    },
    {
      file: "subdir/500x400.svg",
      output: [
        {
          file: "icon.jpg",
          width: 256,
          fit: "cover",
        },
        {
          file: "large.jpg",
          width: 800,
          height: 600,
          fit: "outside",
        },
      ],
    },
  ],
};

parseAllAssets(config).then(() => {
  console.log("done");
});
