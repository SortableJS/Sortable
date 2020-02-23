module.exports = function(api) {
	api.cache(true);

	const options =
		process.env.NODE_ENV === "es" ? { targets: { esmodules: true } } : {};

	return {
		presets: [["@babel/preset-env", options], "@babel/preset-typescript"],
		plugins: [
			"@babel/proposal-class-properties",
			"@babel/proposal-object-rest-spread",
			"@babel/plugin-transform-object-assign"
		]
	};
};
