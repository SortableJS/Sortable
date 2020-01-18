import createTestCafe from "testcafe";

import path from "path";

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
	console.log("Test cafe instance created.");

	const dir = path.resolve(__dirname, "./tests/Sortable.compat.test.js");
	const runner = testCafe
		.createRunner()
		.src(dir)
		.browsers(browsers);

	console.log("Test cafe runner created. Running tests...");

	// Runs the test and return how many tests failed.
	const count = await runner.run().catch(error => {
		console.log("Looks like we had an error! Please see below for details:\n");
		console.error(error);
	});

	// Print errors.
	if (count === 0) console.log(`All test passed with "${count}" failed tests!`);
	else console.error(`Not all tests passed, with "${count}" tests failing.`);

	// Close the tests.
	testCafe.close();
}

testCompat().finally(() => process.exit());
