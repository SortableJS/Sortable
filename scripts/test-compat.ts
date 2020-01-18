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

testCompat()
	.catch(error => {
		console.error(error);
		process.exit(1);
	})
	.finally(() => {
		console.log("We're now finished with the test runner!");
		console.log("If any anything failed, go ahead and fix it.");
		process.exit();
	});

async function testCompat() {
	const testCafe = await createTestCafe(null, 8000, 8001);
	console.log("Test cafe instance created.");

	const dir = path.resolve(__dirname, "../tests/Sortable.compat.test.js");
	const runner = testCafe
		.createRunner()
		.src(dir)
		.browsers(browsers);

	console.log(`Test cafe runner created. Running tests from "${dir}"...`);

	// Runs the test and return how many tests failed.
	const count = await runner.run().catch(error => {
		console.log("Looks like we had an error! Please see below for details:\n");
		console.error(error);
		return;
	});

	// Print errors.
	if (count === 0) console.log(`All test passed with "${count}" failed tests!`);
	else if (count > 0)
		console.error(`Not all tests passed, with "${count}" tests failing.`);
	else console.error("Test runner didn't work... Tests did not actually run.");

	// Close the tests.
	return testCafe.close();
}
