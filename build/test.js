// Test:
// Run on as many of the browsers possible locally.
// Cannot test Android on Browserstack, because testcafe only seems to
// support Chrome for Android, and browser used on Android in Browserstack
// by testcafe is not Chrome(?), so test remotely on local device using
// Chrome.

const createTestCafe = require('testcafe');
const browsers = [
	// 'ie',
	'chrome',
	// 'firefox',
	// 'edge',
	// 'browserstack:safari@12.1:OS X Mojave',
	// 'browserstack:iPhone XS@12.1',

// Not supported by testcafe (i think):
	// 'browserstack:ie@10.0:Windows 7',
	// 'browserstack:ie@9.0:Windows 7'
];
let testcafe;
let runner;


createTestCafe().then((tc) => {
	testcafe = tc;
	runner = tc.createRunner();
	return testcafe.createBrowserConnection();
}).then((remoteConnection) => {
	console.log('Remote connection URL:', remoteConnection.url);
	return runner
		.src('./tests/Sortable.test.js')
		.browsers([remoteConnection, ...browsers])
		.run({
			speed: 0.5
		});
}).then(() => {
    testcafe.close();
});


