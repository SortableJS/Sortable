'use strict';

QUnit.module('Sortable');

QUnit.sortableTest('simple', {
	from: {
		el: '#simple',
		index: 0
	},

	to: {
		el: '#simple',
		index: 'last'
	}
}, function (assert, scope) {
	assert.ok(scope.toList.contains(scope.target), 'container');
	assert.equal(scope.target, scope.toList.lastElementChild, 'position');
});
