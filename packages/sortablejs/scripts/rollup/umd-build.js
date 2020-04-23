import build from "./build.js";

export default [
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
