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


	angular.module('ng-sortable', [])
		.constant('$version', '0.3.5')
		.directive('ngSortable', ['$parse', function ($parse) {
			var removed,
				nextSibling;

			function getSource(el) {
				var scope = angular.element(el).scope();
				var ngRepeat = [].filter.call(el.childNodes, function (node) {
					return (
							(node.nodeType === 8) &&
							(node.nodeValue.indexOf('ngRepeat:') !== -1)
						);
				})[0];

				if (!ngRepeat) {
					// Without ng-repeat
					return null;
				}

				// tests: http://jsbin.com/kosubutilo/1/edit?js,output
				ngRepeat = ngRepeat.nodeValue.match(/ngRepeat:\s*(?:\(.*?,\s*)?([^\s)]+)[\s)]+in\s+([^\s|]+)/);

				var itemExpr = $parse(ngRepeat[1]);
				var itemsExpr = $parse(ngRepeat[2]);

				return {
					item: function (el) {
						return itemExpr(angular.element(el).scope());
					},
					items: function () {
						return itemsExpr(scope);
					}
				};
			}


			// Export
			return {
				restrict: 'AC',
				link: function (scope, $el, attrs) {
					var el = $el[0],
						ngSortable = attrs.ngSortable,
						options = scope.$eval(ngSortable) || {},
						source = getSource(el),
						sortable
					;


					function _emitEvent(/**Event*/evt, /*Mixed*/item) {
						var name = 'on' + evt.type.charAt(0).toUpperCase() + evt.type.substr(1);

						/* jshint expr:true */
						options[name] && options[name]({
							model: item,
							models: source && source.items(),
							oldIndex: evt.oldIndex,
							newIndex: evt.newIndex
						});
					}


					function _sync(/**Event*/evt) {
						if (!source) {
							// Without ng-repeat
							return;
						}

						var oldIndex = evt.oldIndex,
							newIndex = evt.newIndex,
							items = source.items();

						if (el !== evt.from) {
							var prevSource = getSource(evt.from),
								prevItems = prevSource.items();

							oldIndex = prevItems.indexOf(prevSource.item(evt.item));
							removed = prevItems[oldIndex];

							if (evt.clone) {
								evt.from.removeChild(evt.clone);
								removed = angular.copy(removed);
							}
							else {
								prevItems.splice(oldIndex, 1);
							}

							items.splice(newIndex, 0, removed);

							evt.from.insertBefore(evt.item, nextSibling); // revert element
						}
						else {
							items.splice(newIndex, 0, items.splice(oldIndex, 1)[0]);
						}

						scope.$apply();
					}


					sortable = Sortable.create(el, Object.keys(options).reduce(function (opts, name) {
						opts[name] = opts[name] || options[name];
						return opts;
					}, {
						onStart: function (/**Event*/evt) {
							nextSibling = evt.item.nextSibling;
							_emitEvent(evt);
							scope.$apply();
						},
						onEnd: function (/**Event*/evt) {
							_emitEvent(evt, removed);
							scope.$apply();
						},
						onAdd: function (/**Event*/evt) {
							_sync(evt);
							_emitEvent(evt, removed);
							scope.$apply();
						},
						onUpdate: function (/**Event*/evt) {
							_sync(evt);
							_emitEvent(evt, source && source.item(evt.item));
						},
						onRemove: function (/**Event*/evt) {
							_emitEvent(evt, removed);
						},
						onSort: function (/**Event*/evt) {
							_emitEvent(evt, source && source.item(evt.item));
						}
					}));

					$el.on('$destroy', function () {
						sortable.destroy();
						sortable = null;
						nextSibling = null;
					});

					if (ngSortable && !/{|}/.test(ngSortable)) { // todo: ugly
						angular.forEach(['sort', 'disabled', 'draggable', 'handle', 'animation'], function (name) {
							scope.$watch(ngSortable + '.' + name, function (value) {
								if (value !== void 0) {
									options[name] = value;
									sortable.option(name, value);
								}
							});
						});
					}
				}
			};
		}]);
});
