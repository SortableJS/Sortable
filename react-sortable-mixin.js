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
		sortableMixinVersion: '0.0.0',

		/**
		 * @type {Sortable}
		 * @private
		 */
		_sortableInstance: null,

		sortable_default_config: {
	        ref: 'list',
	        model: 'items',
	
	        animation: 100,
	        onStart: 'handleStart',
	        onEnd: 'handleEnd',
	        onAdd: 'handleAdd',
	        onUpdate: 'handleUpdate',
	        onRemove: 'handleRemove',
	        onSort: 'handleSort',
	        onFilter: 'handleFilter'
	     },
		/**
		 * Sortable options
		 * @returns {object}
		 */
		getDefaultProps: function () {
			return {
				sortable: this.sortable_default_config
			};
		},


		componentDidMount: function () {
			var nextSibling,
				sortableProps = this.sortable_default_config,
				sortableOptions = {},

				callMethod = function (/** string */type, /** Event */evt) {
					var method = this[sortableProps[type]];
					method && method.call(this, evt, this._sortableInstance);
				}.bind(this);

			for (var key in this.props.sortable) {
                sortableProps[key] = this.props.sortable[key];
            }
			// Pass through unrecognized options
			for (var key in sortableProps) {
				sortableOptions[key] = sortableProps[key];
			}


			// Bind callbacks so that "this" refers to the component
			'onEnd onAdd onUpdate onRemove onFilter'.split(' ').forEach(function (/** string */name) {
				if (sortableProps[name]) {
					sortableOptions[name] = callMethod.bind(this, name);
				}
			}.bind(this));


			sortableOptions.onStart = function (/** Event */evt) {
				nextSibling = evt.item.nextSibling;
				callMethod('onStart', evt);
			}.bind(this);


			sortableOptions.onSort = function (/** Event */evt) {
				evt.from.insertBefore(evt.item, nextSibling || null);

				var modelName = sortableProps.model,
					newState = {},
					items = this.state[modelName];

				if (items) {
					items = items.slice(); // clone
					items.splice(evt.newIndex, 0, items.splice(evt.oldIndex, 1)[0]);

					newState[modelName] = items;
					this.setState(newState);
				}

				callMethod('onSort', evt);
			}.bind(this);


			/** @namespace this.refs — http://facebook.github.io/react/docs/more-about-refs.html */
			if (!sortableProps.ref || this.refs[sortableProps.ref]) {
				this._sortableInstance = Sortable.create((this.refs[sortableProps.ref] || this).getDOMNode(), sortableOptions);
			}
		},


		componentWillUnmount: function () {
			this._sortableInstance.destroy();
			this._sortableInstance = null;
		}
	};


	// Export
	return SortableMixin;
});
