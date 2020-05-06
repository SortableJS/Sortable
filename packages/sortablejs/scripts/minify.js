const path = require("path");

const UglifyJS = require("uglify-js"),
	fs = require("fs"),
	package = require("../package.json");

const banner = `/*! Sortable ${package.version} - ${package.license} | ${package.repository.url} */\n`;

const projectDir = path.resolve(__dirname, "../");

const monorepoDir = path.resolve(projectDir, "../../");

const src = path.resolve(monorepoDir, "Sortable.js");
const destMonorepo = path.resolve(monorepoDir, "Sortable.min.js");

const destSortablejs = path.resolve(projectDir, "./umd/sortable.min.js");

const srcCode = fs.readFileSync(src, "utf8");

fs.writeFileSync(destMonorepo, banner + UglifyJS.minify(srcCode).code, "utf8");

fs.writeFileSync(
	destSortablejs,
	banner + UglifyJS.minify(srcCode).code,
	"utf8"
);
