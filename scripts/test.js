const createTestCafe = require('testcafe');

let testcafe;
let runner;


createTestCafe().then((tc) => {
	testcafe = tc;
	runner = tc.createRunner();
	return runner
		.src('./tests/Sortable.test.js')
		.browsers('chrome')
		.run({
			speed: 0.5
		});
}).then(() => {
    testcafe.close();
});


