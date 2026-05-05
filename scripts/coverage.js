/**
 * Coverage runner:
 *  1. Instruments Sortable.js with Istanbul in-place (original is backed up)
 *  2. Runs testcafe with the existing tests AND the coverage-collector fixture
 *  3. Restores the original Sortable.js
 *  4. Generates an nyc report from .nyc_output/coverage.json
 */

const path = require('path');
const fs = require('fs');
const { createInstrumenter } = require('istanbul-lib-instrument');
const createTestCafe = require('testcafe');
const { execSync } = require('child_process');

const root = path.resolve(__dirname, '..');
const srcFile = path.join(root, 'Sortable.js');
const backupFile = path.join(root, 'Sortable.js.bak');
const nycOutputDir = path.join(root, '.nyc_output');

async function run() {
	// 1. Instrument Sortable.js
	const instrumenter = createInstrumenter({ esModules: false, produceSourceMap: false });
	const originalCode = fs.readFileSync(srcFile, 'utf8');
	const instrumented = instrumenter.instrumentSync(originalCode, srcFile);

	fs.mkdirSync(nycOutputDir, { recursive: true });
	fs.copyFileSync(srcFile, backupFile);
	fs.writeFileSync(srcFile, instrumented);

	let failedCount = 0;
	let tc;

	try {
		// 2. Run testcafe – existing tests first, then coverage collector
		tc = await createTestCafe();
		const runner = tc.createRunner();
		failedCount = await runner
			.src([
				'./tests/Sortable.test.js',
				'./tests/coverage-collector.js',
			])
			.browsers('chrome:headless')
			.concurrency(1)
			.run();
	} finally {
		if (tc) await tc.close();

		// 3. Restore original source regardless of test outcome
		fs.copyFileSync(backupFile, srcFile);
		fs.unlinkSync(backupFile);
	}

	// 4. Generate coverage report
	try {
		execSync('npx nyc report --reporter=lcov --reporter=text --reporter=html', {
			stdio: 'inherit',
			cwd: root,
		});
	} catch (err) {
		console.error('Coverage report generation failed:', err.message);
	}

	process.exit(failedCount);
}

run().catch(err => {
	console.error(err);
	// Attempt to restore original if something went wrong before the finally block
	if (fs.existsSync(backupFile)) {
		fs.copyFileSync(backupFile, srcFile);
		fs.unlinkSync(backupFile);
	}
	process.exit(1);
});
