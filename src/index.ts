import { createFilter, FilterPattern } from "@rollup/pluginutils";
import { extname, resolve, dirname } from "path";
import { statSync, existsSync } from "fs";
import swc from "@swc/core";
import type { Plugin } from "rollup";

export interface Options {
  include?: FilterPattern;
  exclude?: FilterPattern;
  swcTransformOptions?: swc.Options;
}

const resolveExtensions = [".js", ".jsx", ".ts", ".tsx"];

const getSourceFile = (base: string, isDir: boolean = false): string | null => {
  for (const ext of resolveExtensions) {
    const file = isDir ? resolve(base, `index${ext}`) : `${base}${ext}`;
    if (existsSync(file)) return file;
  }
  return null;
};

export default (options: Options = {}): Plugin => {
  return {
    name: "swc",
    resolveId(source, importer) {
      if (importer && source && source[0] === ".") {
        const resolved = resolve(
          importer ? dirname(importer) : process.cwd(),
          source
        );
        // handle file mybutton.tsx
        // import './ui/mybutton'
        const file = getSourceFile(resolved, false);
        if (file) return file;
        const stats = statSync(resolved);
        // if exists, just return
        if (existsSync(resolved) && stats.isFile()) {
          return resolved;
        }
        if (existsSync(resolved) && stats.isDirectory()) {
          // if a directory, append it using index.js|index.ts|index.jsx|index.tsx to resolve
          const file = getSourceFile(resolved, true);
          if (file) return file;
        }
        throw new Error(`Could not resolve '${resolved}'`);
      }
    },

    async transform(code, id) {
      const filter = createFilter(
        options.include,
        options.exclude || /node_modules/
      );
      if (!filter(id)) return null;
      const ext = extname(id);
      if (!resolveExtensions.includes(ext)) return null;
      const result = await swc.transform(code, options.swcTransformOptions);
      return { code: result.code, map: result.map };
    },
  };
};
