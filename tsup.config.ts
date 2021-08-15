import type { Options } from "tsup";

export const tsup: Options = {
  splitting: false,
  clean: true,
  sourcemap: false,
  entryPoints: ["src/index.ts"],
};
