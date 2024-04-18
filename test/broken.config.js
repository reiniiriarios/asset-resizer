export default {
  baseUrl: ".",
  inputDir: "404-input-dir",
  outputDir: ":invalid-output-dir",
  flatten: "invalid",
  assets: [
    {
      output: [
        {
          width: 50,
        },
        {
          filename: "150x150.png",
          width: "invalid",
        },
        {
          filename: "404.png",
          width: 200,
          height: 100,
        },
        {
          filename: "200x100-cover.png",
          width: 200,
          fit: "invalid",
        },
      ],
    },
    {
      file: ":invalid-asset.svg",
      output: [
        {
          filename: ":invalid-output.jpg",
          width: 256,
        },
        {
          filename: "large.jpg",
          width: 800,
        },
      ],
    },
  ],
};
