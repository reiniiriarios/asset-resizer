module.exports = {
  baseUrl: "./test",
  inputDir: "assets",
  outputDir: "build/test-cjs",
  flatten: true,
  assets: [
    {
      file: "300x300.svg",
      output: [
        {
          file: "50x50.png",
          width: 50,
        },
      ],
    },
  ],
};
