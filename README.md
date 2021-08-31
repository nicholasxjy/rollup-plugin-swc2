# rollup-plugin-swc2

A rollup plugin that uses swc compiler to transform your codes

### install

@swc/core as a peerDependency, you should also install it

```
npm i -D rollup-plugin-swc2 @swc/core
```
```
yarn add -D rollup-plugin-swc2 @swc/core
```

### how to use

```js
// options can pass
export interface Options {
  include?: FilterPattern;
  exclude?: FilterPattern; // default /node_modules/
  swcTransformOptions?: swc.Options; // @swc/core config
}
```

check [https://swc.rs/docs/configuring-swc](https://swc.rs/docs/configuring-swc) to see all `@swc/core` configuration

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
      // demo config
      swcTransformOptions: {
        jsc: {
          externalHelpers: true,
          parser: {
            syntax: "typescript",
            tsx: true,
            dynamicImport: true
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
