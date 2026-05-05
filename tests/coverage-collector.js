/**
 * Coverage collector fixture.
 *
 * This fixture runs after the main test suite and writes the accumulated
 * window.__coverage__ object (populated by the istanbul-instrumented
 * Sortable.js) to .nyc_output/coverage.json so that `nyc report` can
 * pick it up.
 *
 * It does NOT modify any existing tests.
 */

import { ClientFunction } from 'testcafe';
const fs = require('fs');
const path = require('path');

const outputPath = path.resolve(__dirname, '../.nyc_output/coverage.json');

fixture`Coverage Collection`
	.page`./single-list.html`;

test('Write __coverage__ to .nyc_output', async () => {
	const getCoverage = ClientFunction(() => JSON.stringify(window.__coverage__ || {}));
	const coverage = await getCoverage();
	fs.mkdirSync(path.dirname(outputPath), { recursive: true });
	fs.writeFileSync(outputPath, coverage, 'utf8');
	console.log('Coverage data written to', outputPath);
});
