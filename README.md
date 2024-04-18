# asset-resizer

To get started, install `asset-resizer` with:

```
npm i asset-resizer --save-dev
```

Then add a config file to your root directory specifying what assets should be resized and where.
The config file may be `assetresizer.config.js`, `assetresizer.config.mjs`, or `assetresizer.config.cjs`.
Alternatively, you may specify a custom config file.

[See example config.](examples/assetresizer.config.mjs)

### CLI

Run:

```
asset-resizer parse
asset-resizer parse --config=custom.config.js
```

Validate config file:

```
asset-resizer config
asset-resizer config --config=custom.config.js
```

Add these lines to your `package.json` to integrate into your build workflow.

### Programmatic Usage

Alternatively, you can use this package programmatically. [See examples.](examples/programmatic.ts)

#### TypeScript / ESModule

```ts
import { parseAllAssets, AssetResizerConfig } from "asset-resizer";

const config: AssetResizerConfig = {
  baseUrl: ".",
  inputDir: "assets",
  outputDir: "build",
  flatten: true,
  assets: [
    //...
  ],
};

parseAllAssets(config).then(() => {
  console.log("done");
});
```

#### CommonJS

```js
const { parseAllAssets } = require("asset-resizer");

parseAllAssets({
  baseUrl: ".",
  inputDir: "assets",
  outputDir: "build",
  flatten: true,
  assets: [
    //...
  ],
}).then(() => {
  console.log("done");
});
```

## Configuration Options

### `AssetResizerConfig`

| Option      | Type                       | Description                     | Default  |
| ----------- | -------------------------- | ------------------------------- | -------- |
| `baseUrl`   | `string`                   | Base url to run resizer from    | `.`      |
| `inputDir`  | `string`                   | Directory of input files        | `assets` |
| `outputDir` | `string`                   | Directory to build output files | `build`  |
| `assets`    | `Array<AssetResizerAsset>` | Array of source assets          |          |

### `AssetResizerAsset`

| Option   | Type                        | Description                                 |
| -------- | --------------------------- | ------------------------------------------- |
| `file`   | `string`                    | Path to source asset relative to `inputDir` |
| `output` | `Array<AssetResizerOutput>` | Array of output files to create             |

### `AssetResizerOutput`

| Option     | Type       | Description                                                                                                                                                            |
| ---------- | ---------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `filename` | `string`   | Name of file to create. Extension may be one of: `jpg`, `png`, `webp`, `avif`, `tiff`, `gif`, `dzi`, `v`.                                                              |
| `width`    | `number?`  | Width, in pixels, of the target output file. One of `width` or `copy` must be present.                                                                                 |
| `height`   | `number?`  | (optional) Height, in pixels, of the target output file. If not specified, uses `width`.                                                                               |
| `copy`     | `boolean?` | Optionally copy the file instead of resizing. One of `width` or `copy` must be present.                                                                                |
| `fit`      | `string?`  | One of `cover`, `contain`, `fill`, `inside`, `outside`. Defaults to `cover`. See [sharp documentation](https://sharp.pixelplumbing.com/api-resize#resize) for details. |

## Development

First run `npm i`, then `npm link` to link the cli bin `asset-resizer` to the development directory.

### Building

`npm run build`

### Tests

- `npm run test` will run Jest.
- `npm run test:cli` will run command from package.json.
