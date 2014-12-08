/**
 * @author RubaXa <trash@rubaxa.org>
 * @licence MIT
 */
angular.module('ng-sortable', [])
	.constant('$version', '0.2.1')
	.directive('ngSortable', ['$parse', '$rootScope', function ($parse, $rootScope) {
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
			ngRepeat = ngRepeat.nodeValue.match(/ngRepeat:\s*([^\s]+)\s+in\s+([^\s|]+)/);

			var itemExpr = $parse(ngRepeat[1]);
			var itemsExpr = $parse(ngRepeat[2]);

			return {
				item: function (el) {
					return itemExpr(angular.element(el).scope());
				},
				items: function () {
					return itemsExpr(scope);
				},
				upd: function () {
					itemsExpr.assign(scope, this.items());
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
					sortable,
					_order = []
				;


				'Start End Add Update Remove Sort'.split(' ').forEach(function (name) {
					options['on' + name] = options['on' + name] || function () {};
				});


				function _sync(evt) {
					sortable.toArray().forEach(function (id, i) {
						if (_order[i] !== id) {
							var idx = _order.indexOf(id),
								items = source.items();

							if (idx === -1) {
								var remoteSource = getSource(evt.from),
									remoteItems = remoteSource.items();

								idx = remoteItems.indexOf(remoteSource.item(evt.item));
								removed = remoteItems.splice(idx, 1)[0];

								_order.splice(i, 0, id);
								items.splice(i, 0, removed);
								remoteSource.upd();

								evt.from.appendChild(evt.item); // revert element
							} else {
								_order.splice(i, 0, _order.splice(idx, 1)[0]);
								items.splice(i, 0, items.splice(idx, 1)[0]);
							}
						}
					});

					source.upd();
					scope.$apply();
				}


				sortable = Sortable.create(el, Object.keys(options).reduce(function (opts, name) {
					opts[name] = opts[name] || options[name];
					return opts;
				}, {
					onStart: function () {
						$rootScope.$broadcast('sortable:start', sortable);
						options.onStart();
					},
					onEnd: function () {
						$rootScope.$broadcast('sortable:end', sortable);
						options.onEnd();
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


				if (!/{|}/.test(ngSortable)) { // todo: ugly
					angular.forEach(['sort', 'disabled', 'draggable', 'handle', 'animation'], function (name) {
						scope.$watch(ngSortable + '.' + name, function (value) {
							options[name] = value;
							sortable.option(name, value);
						});
					});
				}


				$rootScope.$on('sortable:start', function () {
					_order = sortable.toArray();
				});


				$el.on('$destroy', function () {
					el.sortable = null;
					sortable.destroy();
				});
			}
		};
	}])
;
