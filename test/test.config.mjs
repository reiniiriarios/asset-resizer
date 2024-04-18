// This file would ordinarily be in the root directory of a project,
// therefore the paths are configured as though it is.
export default {
  baseUrl: "./test",
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
          filename: "150x150.png",
          width: 150,
        },
        {
          filename: "200x100.png",
          width: 200,
          height: 100,
        },
        {
          filename: "200x100-cover.png",
          width: 200,
          height: 100,
          fit: "cover",
        },
        {
          filename: "200x100-contain.png",
          width: 200,
          height: 100,
          fit: "contain",
        },
        {
          filename: "200x100-fill.png",
          width: 200,
          height: 100,
          fit: "fill",
        },
        {
          filename: "200x100-inside.png",
          width: 200,
          height: 100,
          fit: "inside",
        },
        {
          filename: "200x100-outside.png",
          width: 200,
          height: 100,
          fit: "outside",
        },
      ],
    },
    {
      file: "500x400.svg",
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
