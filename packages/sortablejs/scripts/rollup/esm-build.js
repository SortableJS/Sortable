import build from "./build.js";

export default [
	{
		input: "./scripts/entry/entry-core.js",
		output: Object.assign({}, build.output, {
			file: "dist/modular/sortable.core.esm.js",
			format: "esm",
		}),
	},
	{
		input: "./scripts/entry/entry-defaults.js",
		output: Object.assign({}, build.output, {
			file: "dist/modular/sortable.esm.js",
			format: "esm",
		}),
	},
	{
		input: "./scripts/entry/entry-complete.js",
		output: Object.assign({}, build.output, {
			file: "dist/modular/sortable.complete.esm.js",
			format: "esm",
		}),
	},
].map((config) => {
	let buildCopy = { ...build };
	return Object.assign(buildCopy, config);
});