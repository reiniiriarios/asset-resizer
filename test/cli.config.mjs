// This file would ordinarily be in the root directory of a project,
// therefore the paths are configured as though it is.
export default {
  baseUrl: "./test",
  inputDir: "assets",
  outputDir: "build/test-cli",
  flatten: false,
  assets: [
    {
      file: "300x300.svg",
      output: [
        {
          file: "50x50.png",
          width: 50,
        },
        {
          file: "150x150.png",
          width: 150,
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
