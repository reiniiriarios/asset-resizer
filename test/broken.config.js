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
          file: "150x150.png",
          width: "invalid",
        },
        {
          file: "file.ext",
          width: 200,
          height: 100,
        },
        {
          file: "200x100-cover.png",
          width: 200,
          fit: "invalid",
        },
      ],
    },
    {
      file: ":invalid-asset.svg",
      output: [
        {
          file: ":invalid-output.jpg",
          width: 256,
        },
        {
          file: "large.jpg",
          width: 800,
        },
      ],
    },
  ],
};
