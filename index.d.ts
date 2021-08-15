import type { FilterPattern } from "@rollup/pluginutils";
import type { Plugin } from "rollup";
import { Options } from "./src";

declare function createPlugin(options: Options): Plugin;

export default createPlugin;
