/**
 * @author RubaXa <trash@rubaxa.org>
 * @licence MIT
 */
angular.module('ng-sortable', [])
	.constant('$version', '0.3.3')
	.directive('ngSortable', ['$parse', function ($parse) {
		'use strict';

		var removed;

		function getSource(el) {
			var scope = angular.element(el).scope();
			var ngRepeat = [].filter.call(el.childNodes, function (node) {
				return (
						(node.nodeType === 8) &&
						(node.nodeValue.indexOf('ngRepeat:') !== -1)
					);
			})[0];
			
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


				'Start End Add Update Remove Sort'.split(' ').forEach(function (name) {
					options['on' + name] = options['on' + name] || function () {};
				});


				function _sync(evt) {
					var oldIndex = evt.oldIndex,
						newIndex = evt.newIndex,
						items = source.items();

					if (el !== evt.from) {
						var prevSource = getSource(evt.from),
							prevItems = prevSource.items();

						oldIndex = prevItems.indexOf(prevSource.item(evt.item));
						removed = prevItems.splice(oldIndex, 1)[0];

						items.splice(newIndex, 0, removed);

						evt.from.appendChild(evt.item); // revert element
					} else {
						items.splice(newIndex, 0, items.splice(oldIndex, 1)[0]);
					}

					scope.$apply();
				}


				sortable = Sortable.create(el, Object.keys(options).reduce(function (opts, name) {
					opts[name] = opts[name] || options[name];
					return opts;
				}, {
					onStart: function () {
						options.onStart(source.items());
					},
					onEnd: function () {
						options.onEnd(source.items());
					},
					onAdd: function (evt) {
						_sync(evt);
						options.onAdd(source.items(), removed);
					},
					onUpdate: function (evt) {
						_sync(evt);
						options.onUpdate(source.items(), source.item(evt.item));
					},
					onRemove: function () {
						options.onRemove(source.items(), removed);
					},
					onSort: function () {
						options.onSort(source.items());
					}
				}));

				$el.on('$destroy', function () {
					sortable.destroy();
					sortable = null;
				});

				if (!/{|}/.test(ngSortable)) { // todo: ugly
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
	}])
;
