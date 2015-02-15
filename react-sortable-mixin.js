/**
 * @author RubaXa <trash@rubaxa.org>
 * @licence MIT
 */

(function (factory) {
	'use strict';

	if (typeof module != 'undefined' && typeof module.exports != 'undefined') {
		module.exports = factory(require('./Sortable'));
	}
	else if (typeof define === 'function' && define.amd) {
		define(['./Sortable'], factory);
	}
	else {
		/* jshint sub:true */
		window['SortableMixin'] = factory(Sortable);
	}
})(function (/** Sortable */Sortable) {
	'use strict';

	var _nextSibling;

	var _activeComponent;

	var _defaultOptions = {
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
	};


	function _getModelName(component) {
		return component.sortableOptions && component.sortableOptions.model || _defaultOptions.model;
	}


	function _getModelItems(component) {
		var name = _getModelName(component),
			items = component.state && component.state[name] || component.props[name];

		return items.slice();
	}


	function _extend(dst, src) {
		for (var key in src) {
			if (src.hasOwnProperty(key)) {
				dst[key] = src[key];
			}
		}

		return dst;
	}


	/**
	 * Simple and easy mixin-wrapper for rubaxa/Sortable library, in order to
	 * make reorderable drag-and-drop lists on modern browsers and touch devices.
	 *
	 * @mixin
	 */
	var SortableMixin = {
		sortableMixinVersion: '0.1.0',


		/**
		 * @type {Sortable}
		 * @private
		 */
		_sortableInstance: null,


		componentDidMount: function () {
			var options = _extend(_extend({}, _defaultOptions), this.sortableOptions || {}),
				copyOptions = _extend({}, options),

				emitEvent = function (/** string */type, /** Event */evt) {
					var method = this[options[type]];
					method && method.call(this, evt, this._sortableInstance);
				}.bind(this);


			// Bind callbacks so that "this" refers to the component
			'onStart onEnd onAdd onSort onUpdate onRemove onFilter'.split(' ').forEach(function (/** string */name) {
				copyOptions[name] = function (evt) {
					if (name === 'onStart') {
						_nextSibling = evt.item.nextElementSibling;
						_activeComponent = this;
					}
					else if (name === 'onAdd' || name === 'onUpdate') {
						evt.from.insertBefore(evt.item, _nextSibling);

						var newState = {},
							remoteState = {},
							oldIndex = evt.oldIndex,
							newIndex = evt.newIndex,
							items = _getModelItems(this),
							remoteItems,
							item;

						if (name === 'onAdd') {
							remoteItems = _getModelItems(_activeComponent);
							item = remoteItems.splice(oldIndex, 1)[0];
							items.splice(newIndex, 0, item);

							remoteState[_getModelName(_activeComponent)] = remoteItems;
						}
						else {
							items.splice(newIndex, 0, items.splice(oldIndex, 1)[0]);
						}

						newState[_getModelName(this)] = items;
						this.setState(newState);
						(this !== _activeComponent) && _activeComponent.setState(remoteState);
					}

					setTimeout(function () {
						emitEvent(name, evt);
					}, 0);
				}.bind(this);
			}, this);


			/** @namespace this.refs — http://facebook.github.io/react/docs/more-about-refs.html */
			this._sortableInstance = Sortable.create((this.refs[options.ref] || this).getDOMNode(), copyOptions);
		},


		componentWillUnmount: function () {
			this._sortableInstance.destroy();
			this._sortableInstance = null;
		}
	};


	// Export
	return SortableMixin;
});
