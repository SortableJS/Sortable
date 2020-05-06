import build from "./build.js";

export default [
	// directs to monorepo folder
	{
		input: "./scripts/entry/entry-complete.js",
		output: Object.assign({}, build.output, {
			file: "../../Sortable.js",
			format: "umd",
		}),
	},
	// directs to sortablejs folder
	{
		input: "./scripts/entry/entry-complete.js",
		output: Object.assign({}, build.output, {
			file: "umd/sortable.js",
			format: "umd",
		}),
	},
].map((config) => {
	let buildCopy = { ...build };
	return Object.assign(buildCopy, config);
});
