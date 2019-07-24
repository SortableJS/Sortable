const createTestCafe = require('testcafe');

let testcafe;
let runner;
let failedCount;


createTestCafe().then((tc) => {
	testcafe = tc;
	runner = tc.createRunner();
	return runner
		.src('./tests/Sortable.test.js')
		.browsers('chrome:headless')
		.concurrency(3)
		.run();
}).then((actualFailedCount) => {
	failedCount = actualFailedCount;
	console.log('FAILED COUNT', actualFailedCount)
    return testcafe.close();
}).then(() => process.exit(failedCount));

