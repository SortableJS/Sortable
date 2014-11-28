/**
 * @author RubaXa <trash@rubaxa.org>
 * @licence MIT
 */
angular.module('ng-sortable', [])
	.constant('$version', '0.1.0')
	.directive('ngSortable', ['$parse', '$rootScope', function ($parse, $rootScope) {
		"use strict";

		var removed;

		function getSource(el) {
			var scope = angular.element(el).scope();
			var ngRepeat = [].filter.call(el.childNodes, function (node) {
				return (
						(node.nodeType === 8) &&
						(node.nodeValue.indexOf("ngRepeat:") !== -1)
					);
			})[0];
			ngRepeat = ngRepeat.nodeValue.match(/ngRepeat:\s*([^\s]+)\s+in\s+([^\s|]+)/);

			var item = $parse(ngRepeat[1]);
			var items = $parse(ngRepeat[2]);

			return {
				item: function (el) {
					return item(angular.element(el).scope());
				},
				items: items(scope),
				upd: function () {
					items.assign(scope, this.items);
				}
			};
		}


		return {
			restrict: 'AC',
			link: function (scope, $el, attrs) {
				var el = $el[0];
				var options = scope.$eval(attrs.ngSortable) || {};
				var _order = [];
				var source = getSource(el);

				'Start End Add Update Remove Sort'.split(' ').forEach(function (name) {
					options['on' + name] = options['on' + name] || function () {};
				});

				function _sync(evt) {
					sortable.toArray().forEach(function (id, i) {
						if (_order[i] !== id) {
							var idx = _order.indexOf(id);

							if (idx === -1) {
								var remoteSource = getSource(evt.from);

								idx = remoteSource.items.indexOf(remoteSource.item(evt.item));
								removed = remoteSource.items.splice(idx, 1)[0];

								_order.splice(i, 0, id);
								source.items.splice(i, 0, removed);
								remoteSource.upd();

								evt.from.appendChild(evt.item); // revert element
							} else {
								_order.splice(i, 0, _order.splice(idx, 1)[0]);
								source.items.splice(i, 0, source.items.splice(idx, 1)[0]);
							}
						}
					});

					source.upd();
					scope.$apply();
				}


				var sortable = Sortable.create(el, Object.keys(options).reduce(function (opts, name) {
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
						options.onAdd(source.items, removed);
					},
					onUpdate: function (evt) {
						_sync(evt);
						options.onUpdate(source.items, source.item(evt.item));
					},
					onRemove: function (evt) {
						options.onRemove(source.items, removed);
					},
					onSort: function () {
						options.onSort(source.items);
					}
				}));


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
