import { parseAllAssets, AssetResizerConfig } from "asset-resizer";

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
          filename: "50x50.png",
          width: 50,
        },
        {
          filename: "200x100.png",
          width: 200,
          height: 100,
        },
        {
          filename: "200x100-contain.png",
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
          filename: "icon.jpg",
          width: 256,
          fit: "cover",
        },
        {
          filename: "large.jpg",
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
