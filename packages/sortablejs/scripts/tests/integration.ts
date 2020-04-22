import createTestCafe from "testcafe";

export const main = async () => {
	try {
		const src = "./tests/integration/Sortable.test.js";

		const browsers = ["chrome:headless"];

		const testcafe = await createTestCafe();

		const runner = testcafe
			.createRunner()
			.src(src)
			.browsers(browsers)
			.concurrency(3);

		console.info("let's run some tests!");

		const failed = await runner.run();

		if (failed > 0) {
			throw new Error(`A total of "${failed}" tests failed.`);
		}

		testcafe.close();
	} catch (error) {
		console.error(error);
		process.exit(1);
	} finally {
		console.info("All of the tests ran successfully!");
		console.info(
			'If these tests are ran on circleci, results should be available in the UI under "tests"'
		);
		process.exit(0);
	}
};

main();
