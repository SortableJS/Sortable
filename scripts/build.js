import json from "rollup-plugin-json";
import resolve from "rollup-plugin-node-resolve";
import banner from "./banner.js";
import typescript from "@rollup/plugin-typescript";

export default {
  output: {
    banner,
    name: "Sortable",
  },
  plugins: [
    json(),
    resolve(),
    typescript({
      allowJs: true,
      include: "src",
    }),
  ],
};
