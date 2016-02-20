/* global QUnit, fixture, Sortable, simulateDrag */

'use strict';

QUnit.module('Sortable');

function createSortableList(options) {
	var listEl = document.createElement('div');
	var length = options.length;
	var withHandle = options.withHandle;

	if (withHandle) {
		options.handle = withHandle;
	}

	listEl.className = 'js-list';

	for (var i = 0; i < length; i++) {
		var el = document.createElement('div');

		el.appendChild(document.createTextNode('Item ' + (i + 1)));
		el.className = 'js-list-item';

		listEl.appendChild(el);
	}

	fixture.appendChild(listEl);

	return {
		el: listEl,
		sortable: Sortable.create(listEl, options),
		destroy: function () {
			this.sortable.destroy();
			fixture.removeChild(this.el);

			this.el = null;
			this.sortable = null;
		}
	};
}


QUnit.test('core', function (assert) {
	var done = assert.async();
	var events = {};
	var logEvent = function (evt) { events[this + evt.type] = true; };
	var list = createSortableList({
		length: 3,
		onStart: logEvent.bind('on'),
		onMove: logEvent.bind('on'),
		onUpdate: logEvent.bind('on'),
		onEnd: logEvent.bind('on')
	});

	list.el.addEventListener('start', logEvent.bind(''));
	list.el.addEventListener('move', logEvent.bind(''));
	list.el.addEventListener('update', logEvent.bind(''));
	list.el.addEventListener('end', logEvent.bind(''));

	simulateDrag({
		from: {
			el: list.el,
			index: 0
		},

		to: {index: 'last'},

		ontap: function () {
			assert.ok(list.el.firstChild.className.indexOf('sortable-chosen') > -1, 'sortable-choose');
		},

		ondragstart: function () {
			setTimeout(function () {
				assert.ok(list.el.firstChild.className.indexOf('sortable-ghost') > -1, 'sortable-ghost');
			}, 0);
		}
	}, function () {
		assert.deepEqual(Object.keys(events), [
			'start', 'onstart',
			'move', 'onmove',
			'update', 'onupdate',
			'end', 'onend'
		]);

		list.destroy();
		done();
	});
});


//QUnit.test('handle', function (assert) {
//	var done = assert.async();
//	var list = createSortableList({
//		length: 3,
//		withHandle: true,
//		onStart: function () { assert.ok(false, 'start'); },
//		onEnd: function () { assert.ok(false, 'end'); }
//	});
//});
