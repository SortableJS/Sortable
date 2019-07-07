const createTestCafe = require('testcafe');
// Testcafe cannot test on IE < 11
// Testcafe testing on Chrome Android is currently broken (https://github.com/DevExpress/testcafe/issues/3948)
const browsers = [
	'ie',
	'chrome:headless',
	'firefox:headless',
	'edge',
	'browserstack:safari@12.1:OS X Mojave',
	'browserstack:iPhone 8@12.1'
];
let testcafe;
let runner;


createTestCafe(null, 8000, 8001).then((tc) => {
	testcafe = tc;
	runner = tc.createRunner();
	return runner
		.src('./tests/Sortable.compat.test.js')
		.browsers(browsers)
		.run();
}).then(() => {
    testcafe.close();
});


