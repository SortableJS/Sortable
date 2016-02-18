(function () {
	'use strict';

	QUnit.sortableTest = function sortableTest(name, options, fn) {
		QUnit.test(name, function (assert) {
			var done = assert.async();
			var data = simulateDrag(options, function () {
				fn(assert, data, options);
				done();
			});
		});
	};
})();
