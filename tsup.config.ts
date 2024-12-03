/* eslint-disable import/no-extraneous-dependencies */
import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/cli.ts", "src/index.ts"],
  format: ["esm"],
  dts: true,
  clean: true,
  shims: true,
  splitting: false,
  sourcemap: true
});
