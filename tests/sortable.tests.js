'use strict';

Sortable.create(simple);

simulateDrag({
	from: {
		el: '#simple',
		index: 0
	},

	to: {
		el: '#simple',
		index: 'last'
	}
}, function () {

});
