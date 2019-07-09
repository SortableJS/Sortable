const createTestCafe = require('testcafe');

let testcafe;
let runner;
let failedCount;


createTestCafe().then((tc) => {
	testcafe = tc;
	runner = tc.createRunner();
	return runner
		.src('./tests/Sortable.test.js')
		.browsers('chrome')
		.concurrency(3)
		.run();
}).then((actualFailedCount) => {
    testcafe.close();
}).then(() => process.exit(failedCount));

