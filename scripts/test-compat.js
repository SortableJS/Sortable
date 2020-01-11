const createTestCafe = require("testcafe");
// Testcafe cannot test on IE < 11
// Testcafe testing on Chrome Android is currently broken (https://github.com/DevExpress/testcafe/issues/3948)
const browsers = [
	"saucelabs:Internet Explorer@11.285:Windows 10",
	"saucelabs:MicrosoftEdge@16.16299:Windows 10",
	"saucelabs:iPhone XS Simulator@12.2",
	"saucelabs:Safari@12.0:macOS 10.14",
	"chrome:headless",
	"firefox:headless"
];

let testcafe;
let runner;
let errorCode;

createTestCafe(null, 8000, 8001)
	.then(tc => {
		testcafe = tc;
		runner = tc.createRunner();
		return runner
			.src("./tests/Sortable.compat.test.js")
			.browsers(browsers)
			.run();
	})
	.then(actualFailedCount => {
		// https://testcafe-discuss.devexpress.com/t/why-circleci-marked-build-as-green-even-if-this-build-contain-failed-test/726/2
		errorCode = actualFailedCount > 0 ? 1 : 0;
		console.log(`Failed count was ${actualFailedCount}`);
		if (!!errorCode) console.error('Looks like we had a failed test when running them.')
		return testcafe.close();
	})
	.catch(err => console.error(err))
	.finally(() => process.exit(errorCode));
