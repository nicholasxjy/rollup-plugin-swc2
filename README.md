# rollup-plugin-swc2 (WIP)

A rollup plugin that uses swc compiler to transform your codes

### install

```
npm i -D rollup-plugin-swc2

yarn add -D rollup-plugin-swc2
```

### how to use

```js
// options can pass
export interface Options {
  include?: FilterPattern;
  exclude?: FilterPattern; // default /node_modules/
  swcTransformOptions?: swc.Options; // support all @swc/core config
}
```

```js
// in your rollup.config.ts
// demo below

import swc from "rollup-plugin-swc2";
import imp from "rollup-plugin-imp";

const config = {
  plugins: [
    nodeResolve(),
    commonjs(),
    imp({
      libList: [
        {
          libName: "akagami-ui",
          libDirectory: "lib",
          camel2DashComponentName: true, // required => TableColumn - table-column
          style(name) {
            return `akagami-ui/lib/${name}/style/index.css`;
          },
        },
      ],
    }),
    swc({
      swcTransformOptions: {
        jsc: {
          parser: {
            syntax: "typescript",
          },
          transform: {
            react: {
              pragma: "React.createElement",
              pragmaFrag: "React.Fragment",
              throwIfNamespace: true,
              development: false,
              useBuiltins: false,
            },
          },
        },
      },
    }),
    postcss({
      minimize: false,
      autoModules: true,
    }),
  ],
};
```
