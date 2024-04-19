// Include `assetresizer.config.js` in your project's root directory.
// Alternatively, use `assetresizer.config.mjs`.
export default {
  baseUrl: ".",
  inputDir: "assets",
  outputDir: "build",
  flatten: true,
  assets: [
    {
      file: "app/manifest.json",
      output: [
        {
          file: "manifest.json",
          copy: true,
        },
      ],
    },
    {
      file: "300x300.svg",
      output: [
        {
          file: "300x300.svg",
          copy: true,
        },
        {
          file: "50x50.png",
          width: 50,
        },
        {
          file: "150x150.png",
          width: 150,
        },
        {
          file: "200x100.png",
          width: 200,
          height: 100,
        },
        {
          file: "200x100-cover.png",
          width: 200,
          height: 100,
          fit: "cover",
        },
        {
          file: "200x100-contain.png",
          width: 200,
          height: 100,
          fit: "contain",
        },
        {
          file: "200x100-fill.png",
          width: 200,
          height: 100,
          fit: "fill",
        },
        {
          file: "200x100-inside.png",
          width: 200,
          height: 100,
          fit: "inside",
        },
        {
          file: "200x100-outside.png",
          width: 200,
          height: 100,
          fit: "outside",
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
