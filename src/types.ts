export interface AssetResizerConfig {
  baseUrl: string;
  inputDir: string;
  outputDir: string;
  flatten: boolean;
  assets: AssetResizerAsset[];
}

export interface AssetResizerAsset {
  file: string;
  output: AssetResizerOutput[];
}

export interface AssetResizerOutput {
  file: string;
  width?: number;
  height?: number;
  fit?: "cover" | "contain" | "fill" | "inside" | "outside";
  copy?: boolean;
}
