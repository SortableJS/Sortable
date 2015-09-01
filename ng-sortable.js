/**
 * @author RubaXa <trash@rubaxa.org>
 * @licence MIT
 */
(function (factory) {
	'use strict';

	if (window.angular && window.Sortable) {
		factory(angular, Sortable);
	}
	else if (typeof define === 'function' && define.amd) {
		define(['angular', './Sortable'], factory);
	}
})(function (angular, Sortable) {
	'use strict';


	/**
	 * @typedef   {Object}        ngSortEvent
	 * @property  {*}             model      List item
	 * @property  {Object|Array}  models     List of items
	 * @property  {number}        oldIndex   before sort
	 * @property  {number}        newIndex   after sort
	 */


	return angular.module('ng-sortable', [])
		.constant('ngSortableVersion', '0.3.7')
		.constant('ngSortableConfig', {})
		.factory('ngSortableStore', function () {
			var models = [];
			return {
				get: function () {
					return models;
				},
				set: function (items) {
					models = items || [];
				}
			};
		})
		.directive('ngSortable', ['$parse', 'ngSortableConfig', 'ngSortableStore', function ($parse, ngSortableConfig, ngSortableStore) {

			// Export
			return {
				restrict: 'AC',
				require: 'ngModel',
				scope: { ngSortable: "=?" },
				link: function (scope, $el, attrs, ngModel) {
					var el = $el[0],
						options = angular.extend(scope.ngSortable || {}, ngSortableConfig),
						watchers = [],
						sortable
					;


					function _emitEvent(/**Event*/evt, /*Mixed*/item) {
						var name = 'on' + evt.type.charAt(0).toUpperCase() + evt.type.substr(1);

						/* jshint expr:true */
						options[name] && options[name]({
							model: item,
							models: ngModel.$modelValue,
							oldIndex: evt.oldIndex,
							newIndex: evt.newIndex
						});
					}

					// added new item into list from another list
					function _addItem(/**Event*/evt, /*Mixed*/item) {
						var newIndex = evt.newIndex,
							items = ngModel.$modelValue,
							itemToAdd = angular.copy(item);

						items.splice(newIndex, 0, itemToAdd);
						evt.item.remove(); // revert element
						return itemToAdd;
					}

					// remove from one list when item moved into another
					function _removeItem(/**Event*/evt) {
						var oldIndex = evt.oldIndex,
							items = ngModel.$modelValue;

						if (!evt.clone) {
							return items.splice(oldIndex, 1);
						}
					}

					// invoked only after sort within the same container
					// on update position within the same list
					function _updateItemPosition(/**Event*/evt) {
						var oldIndex = evt.oldIndex,
							newIndex = evt.newIndex,
							items = ngModel.$modelValue;

						items.splice(newIndex, 0, items.splice(oldIndex, 1)[0]);
						return items[newIndex];
					}

					sortable = Sortable.create(el, Object.keys(options).reduce(function (opts, name) {
						opts[name] = opts[name] || options[name];
						return opts;
					}, {
						onStart: function (/**Event*/evt) {
							ngSortableStore.set(ngModel.$modelValue);
							_emitEvent(evt);
						},
						onAdd: function (/**Event*/evt) {
							var addedModel = _addItem(evt, ngSortableStore.get()[evt.oldIndex]);
							_emitEvent(evt, addedModel);
						},
						onRemove: function (/**Event*/evt) {
							var removedModel = _removeItem(evt);
							_emitEvent(evt, removedModel);
						},
						onUpdate: function (/**Event*/evt) {
							var movedModel = _updateItemPosition(evt);
							_emitEvent(evt, movedModel);
						},
						onEnd: function (/**Event*/evt) {
							ngSortableStore.set(null);

							_emitEvent(evt);
							scope.$apply();
						},
						onSort: function (/**Event*/evt) {
							_emitEvent(evt);
						}
					}));

					$el.on('$destroy', function () {
						angular.forEach(watchers, function (/** Function */unwatch) {
							unwatch();
						});
						sortable.destroy();
						watchers = null;
						sortable = null;
					});

					angular.forEach([
						'sort', 'disabled', 'draggable', 'handle', 'animation', 'group', 'ghostClass', 'filter',
						'onStart', 'onEnd', 'onAdd', 'onUpdate', 'onRemove', 'onSort'
					], function (name) {
						watchers.push(scope.$watch('ngSortable.' + name, function (value) {
							if (value !== void 0) {
								options[name] = value;

								if (!/^on[A-Z]/.test(name)) {
									sortable.option(name, value);
								}
							}
						}));
					});
				}
			};
		}])
		.name;
});
