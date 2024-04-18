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
          filename: "150x150.png",
          width: 150,
        },
      ],
    },
  ],
};
