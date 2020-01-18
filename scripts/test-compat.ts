import { default as createTestCafe } from "testcafe";

import * as path from "path";

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

async function testCompat() {
	const testCafe = await createTestCafe(null, 8000, 8001);
	const dir = path.resolve(__dirname, "../tests/Sortable.compat.test.js");
	const runner = testCafe
		.createRunner()
		.src(dir)
		.browsers(browsers)
		// This error is annoying but required so we can see the errors in `stdout`.
		// — "The "reporter" option from the configuration file will be ignored.
		.reporter("json", process.stdout);

	console.log(`Test cafe runner created. Running tests from "${dir}"...`);

	// Runs the test and return how many tests failed.
	const count = await runner.run({ speed: 0.1 }).catch(error => {
		console.error("We ran into an error in the test! Please see below:\n");
		console.error(error);
	});

	// Close the tests.
	testCafe.close();
	return count;
}

testCompat()
	// Print to console basd on count.
	.then(count => {
		// passed tests.
		if (count === 0)
			return console.log(`All test passed with "${count}" failed tests!`);
		// failed tests.
		if (count > 0)
			throw new Error(`Not all tests passed, with "${count}" tests failing.`);
		// chances are tests didn't run here.
		else
			throw new Error("Test runner didn't work... Tests did not actually run.");
	})
	.catch(error => {
		console.log("Uh oh, we had an error! Please read the details below:\n");
		console.error(error);
		process.exit(1);
	})
	.finally(() => {
		console.log("Compatability testing complete.");
		process.exit();
	});
