module.exports = function(api) {
	api.cache(true);

	let presets;

	if (process.env.NODE_ENV === "es") {
		presets = [
			[
				"@babel/preset-env",
				{
					modules: false
				}
			],
			["@babel/preset-typescript"]
		];
	} else if (process.env.NODE_ENV === "umd") {
		presets = [["@babel/preset-env"], ["@babel/preset-typescript"]];
	}

	return {
		plugins: [
			"@babel/plugin-transform-object-assign",
			"@babel/proposal-class-properties",
			"@babel/proposal-object-rest-spread"
		],
		presets
	};
};
