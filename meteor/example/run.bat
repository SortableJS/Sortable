mklink ..\..\package.js "meteor/package.js"
mklink package.json "../../package.json"
meteor run
del ..\..\package.js package.json
