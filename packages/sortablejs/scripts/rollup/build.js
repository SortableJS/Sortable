import babel from "rollup-plugin-babel";
import json from "rollup-plugin-json";
import resolve from "rollup-plugin-node-resolve";
import banner from "../../resources/banner";

export default {
	output: {
		banner,
		name: "Sortable",
	},
	plugins: [json(), babel(), resolve()],
};
