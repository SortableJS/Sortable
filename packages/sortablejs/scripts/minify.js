const path = require("path");

const UglifyJS = require("uglify-js"),
	fs = require("fs"),
	package = require("../package.json");

const banner = `/*! Sortable ${package.version} - ${package.license} | ${package.repository.url} */\n`;

const projectDir = path.resolve(__dirname, "../");
const umd = path.resolve(projectDir, "umd");

const src = path.resolve(umd, "sortable.js");
const dest = path.resolve(umd, "sortable.min.js");

const srcCode = fs.readFileSync(src, "utf8");

fs.writeFileSync(dest, banner + UglifyJS.minify(srcCode).code, "utf8");
