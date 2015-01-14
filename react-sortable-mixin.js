/**
 * @author RubaXa <trash@rubaxa.org>
 * @licence MIT
 */

(function (factory) {
	'use strict';

	if (typeof define === 'function' && define.amd) {
		define(['sortable'], factory);
	}
	else if (typeof module != 'undefined' && typeof module.exports != 'undefined') {
		module.exports = factory(require('Sortable'));
	}
	else {
		/* jshint sub:true */
		window['SortableMixin'] = factory(Sortable);
	}
})(function (/** Sortable */Sortable) {
	'use strict';


	/**
	 * Simple and easy mixin-wrapper for rubaxa/Sortable library, in order to
	 * make reorderable drag-and-drop lists on modern browsers and touch devices.
	 *
	 * @mixin
	 */
	var SortableMixin = {
		sortableMixinVersion: '0.0.0'
	};


	// Export
	return SortableMixin;
});
