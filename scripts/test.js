const createTestCafe = require("testcafe");

let testcafe;
let runner;
let errorCode;

createTestCafe()
	.then(tc => {
		testcafe = tc;
		runner = tc.createRunner();
		return runner
			.src("./tests/Sortable.test.js")
			.browsers("chrome:headless")
			.concurrency(3)
			.run();
	})
	.then(actualFailedCount => {
		errorCode = actualFailedCount > 0 ? 1 : 0;
		console.log("FAILED COUNT", actualFailedCount);
		return testcafe.close();
	})
	.catch(err => console.error(err))
	.finally(() => process.exit(errorCode));
