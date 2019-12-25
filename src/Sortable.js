/**!
 * Sortable
 * @author	RubaXa   <trash@rubaxa.org>
 * @author	owenm    <owen23355@gmail.com>
 * @license MIT
 */

import { version } from '../package.json';

import { IE11OrLess, Edge, FireFox, Safari, IOS, ChromeForAndroid } from './BrowserInfo.js';

import AnimationStateManager from './Animation.js';

import PluginManager from './PluginManager.js';

import dispatchEvent from './EventDispatcher.js';

import {
	on,
	off,
	closest,
	toggleClass,
	css,
	matrix,
	find,
	getWindowScrollingElement,
	getRect,
	isScrolledPast,
	getChild,
	lastChild,
	index,
	getRelativeScrollOffset,
	extend,
	throttle,
	scrollBy,
	clone,
	expando
} from './utils.js';


let pluginEvent = function(eventName, sortable, { evt: originalEvent, ...data } = {}) {
	PluginManager.pluginEvent.bind(Sortable)(eventName, sortable, {
		dragEl,
		parentEl,
		ghostEl,
		rootEl,
		nextEl,
		lastDownEl,
		cloneEl,
		cloneHidden,
		dragStarted: moved,
		putSortable,
		activeSortable: Sortable.active,
		originalEvent,

		oldIndex,
		oldDraggableIndex,
		newIndex,
		newDraggableIndex,

		hideGhostForTarget: _hideGhostForTarget,
		unhideGhostForTarget: _unhideGhostForTarget,


		cloneNowHidden() {
			cloneHidden = true;
		},
		cloneNowShown() {
			cloneHidden = false;
		},

		dispatchSortableEvent(name) {
			_dispatchEvent({ sortable, name, originalEvent });
		},

		...data
	});
};

function _dispatchEvent(info) {
	dispatchEvent({
		putSortable,
		cloneEl,
		targetEl: dragEl,
		rootEl,
		oldIndex,
		oldDraggableIndex,
		newIndex,
		newDraggableIndex,
		...info
	});
}


let dragEl,
	parentEl,
	ghostEl,
	rootEl,
	nextEl,
	lastDownEl,

	cloneEl,
	cloneHidden,

	oldIndex,
	newIndex,
	oldDraggableIndex,
	newDraggableIndex,

	activeGroup,
	putSortable,

	awaitingDragStarted = false,
	ignoreNextClick = false,
	sortables = [],

	tapEvt,
	touchEvt,
	lastDx,
	lastDy,
	tapDistanceLeft,
	tapDistanceTop,

	moved,

	lastTarget,
	lastDirection,
	pastFirstInvertThresh = false,
	isCircumstantialInvert = false,

	targetMoveDistance,

	// For positioning ghost absolutely
	ghostRelativeParent,
	ghostRelativeParentInitialScroll = [], // (left, top)

	_silent = false,
	savedInputChecked = [];

	/** @const */
	const documentExists = typeof document !== 'undefined',

	PositionGhostAbsolutely = IOS,

	CSSFloatProperty = Edge || IE11OrLess ? 'cssFloat' : 'float',

	// This will not pass for IE9, because IE9 DnD only works on anchors
	supportDraggable = documentExists && !ChromeForAndroid && !IOS && ('draggable' in document.createElement('div')),

	supportCssPointerEvents = (function() {
		if (!documentExists) return;
		// false when <= IE11
		if (IE11OrLess) {
			return false;
		}
		let el = document.createElement('x');
		el.style.cssText = 'pointer-events:auto';
		return el.style.pointerEvents === 'auto';
	})(),

	_detectDirection = function(el, options) {
		let elCSS = css(el),
			elWidth = parseInt(elCSS.width)
				- parseInt(elCSS.paddingLeft)
				- parseInt(elCSS.paddingRight)
				- parseInt(elCSS.borderLeftWidth)
				- parseInt(elCSS.borderRightWidth),
			child1 = getChild(el, 0, options),
			child2 = getChild(el, 1, options),
			firstChildCSS = child1 && css(child1),
			secondChildCSS = child2 && css(child2),
			firstChildWidth = firstChildCSS && parseInt(firstChildCSS.marginLeft) + parseInt(firstChildCSS.marginRight) + getRect(child1).width,
			secondChildWidth = secondChildCSS && parseInt(secondChildCSS.marginLeft) + parseInt(secondChildCSS.marginRight) + getRect(child2).width;

		if (elCSS.display === 'flex') {
			return elCSS.flexDirection === 'column' || elCSS.flexDirection === 'column-reverse'
			? 'vertical' : 'horizontal';
		}

		if (elCSS.display === 'grid') {
			return elCSS.gridTemplateColumns.split(' ').length <= 1 ? 'vertical' : 'horizontal';
		}

		if (child1 && firstChildCSS.float && firstChildCSS.float !== 'none') {
			let touchingSideChild2 = firstChildCSS.float === 'left' ? 'left' : 'right';

			return child2 && (secondChildCSS.clear === 'both' || secondChildCSS.clear === touchingSideChild2) ?
				'vertical' : 'horizontal';
		}

		return (child1 &&
			(
				firstChildCSS.display === 'block' ||
				firstChildCSS.display === 'flex' ||
				firstChildCSS.display === 'table' ||
				firstChildCSS.display === 'grid' ||
				firstChildWidth >= elWidth &&
				elCSS[CSSFloatProperty] === 'none' ||
				child2 &&
				elCSS[CSSFloatProperty] === 'none' &&
				firstChildWidth + secondChildWidth > elWidth
			) ?
			'vertical' : 'horizontal'
		);
	},

	_dragElInRowColumn = function(dragRect, targetRect, vertical) {
		let dragElS1Opp = vertical ? dragRect.left : dragRect.top,
			dragElS2Opp = vertical ? dragRect.right : dragRect.bottom,
			dragElOppLength = vertical ? dragRect.width : dragRect.height,
			targetS1Opp = vertical ? targetRect.left : targetRect.top,
			targetS2Opp = vertical ? targetRect.right : targetRect.bottom,
			targetOppLength = vertical ? targetRect.width : targetRect.height;

		return (
			dragElS1Opp === targetS1Opp ||
			dragElS2Opp === targetS2Opp ||
			(dragElS1Opp + dragElOppLength / 2) === (targetS1Opp + targetOppLength / 2)
		);
	},

	/**
	 * Detects first nearest empty sortable to X and Y position using emptyInsertThreshold.
	 * @param  {Number} x      X position
	 * @param  {Number} y      Y position
	 * @return {HTMLElement}   Element of the first found nearest Sortable
	 */
	_detectNearestEmptySortable = function(x, y) {
		let ret;
		sortables.some((sortable) => {
			if (lastChild(sortable)) return;

			let rect = getRect(sortable),
				threshold = sortable[expando].options.emptyInsertThreshold,
				insideHorizontally = x >= (rect.left - threshold) && x <= (rect.right + threshold),
				insideVertically = y >= (rect.top - threshold) && y <= (rect.bottom + threshold);

			if (threshold && insideHorizontally && insideVertically) {
				return (ret = sortable);
			}
		});
		return ret;
	},

	_prepareGroup = function (options) {
		function toFn(value, pull) {
			return function(to, from, dragEl, evt) {
				let sameGroup = to.options.group.name &&
								from.options.group.name &&
								to.options.group.name === from.options.group.name;

				if (value == null && (pull || sameGroup)) {
					// Default pull value
					// Default pull and put value if same group
					return true;
				} else if (value == null || value === false) {
					return false;
				} else if (pull && value === 'clone') {
					return value;
				} else if (typeof value === 'function') {
					return toFn(value(to, from, dragEl, evt), pull)(to, from, dragEl, evt);
				} else {
					let otherGroup = (pull ? to : from).options.group.name;

					return (value === true ||
					(typeof value === 'string' && value === otherGroup) ||
					(value.join && value.indexOf(otherGroup) > -1));
				}
			};
		}

		let group = {};
		let originalGroup = options.group;

		if (!originalGroup || typeof originalGroup != 'object') {
			originalGroup = {name: originalGroup};
		}

		group.name = originalGroup.name;
		group.checkPull = toFn(originalGroup.pull, true);
		group.checkPut = toFn(originalGroup.put);
		group.revertClone = originalGroup.revertClone;

		options.group = group;
	},

	_hideGhostForTarget = function() {
		if (!supportCssPointerEvents && ghostEl) {
			css(ghostEl, 'display', 'none');
		}
	},

	_unhideGhostForTarget = function() {
		if (!supportCssPointerEvents && ghostEl) {
			css(ghostEl, 'display', '');
		}
	};


// #1184 fix - Prevent click event on fallback if dragged but item not changed position
if (documentExists) {
	document.addEventListener('click', function(evt) {
		if (ignoreNextClick) {
			evt.preventDefault();
			evt.stopPropagation && evt.stopPropagation();
			evt.stopImmediatePropagation && evt.stopImmediatePropagation();
			ignoreNextClick = false;
			return false;
		}
	}, true);
}

let nearestEmptyInsertDetectEvent = function(evt) {
	if (dragEl) {
		evt = evt.touches ? evt.touches[0] : evt;
		let nearest = _detectNearestEmptySortable(evt.clientX, evt.clientY);

		if (nearest) {
			// Create imitation event
			let event = {};
			for (let i in evt) {
				if (evt.hasOwnProperty(i)) {
					event[i] = evt[i];
				}
			}
			event.target = event.rootEl = nearest;
			event.preventDefault = void 0;
			event.stopPropagation = void 0;
			nearest[expando]._onDragOver(event);
		}
	}
};


let _checkOutsideTargetEl = function(evt) {
	if (dragEl) {
		dragEl.parentNode[expando]._isOutsideThisEl(evt.target);
	}
};


/**
 * @class  Sortable
 * @param  {HTMLElement}  el
 * @param  {Object}       [options]
 */
function Sortable(el, options) {
	if (!(el && el.nodeType && el.nodeType === 1)) {
		throw `Sortable: \`el\` must be an HTMLElement, not ${ {}.toString.call(el) }`;
	}

	this.el = el; // root element
	this.options = options = Object.assign({}, options);


	// Export instance
	el[expando] = this;

	let defaults = {
		group: null,
		sort: true,
		disabled: false,
		store: null,
		handle: null,
		draggable: /^[uo]l$/i.test(el.nodeName) ? '>li' : '>*',
		swapThreshold: 1, // percentage; 0 <= x <= 1
		invertSwap: false, // invert always
		invertedSwapThreshold: null, // will be set to same as swapThreshold if default
		removeCloneOnHide: true,
		direction: function() {
			return _detectDirection(el, this.options);
		},
		ghostClass: 'sortable-ghost',
		chosenClass: 'sortable-chosen',
		dragClass: 'sortable-drag',
		ignore: 'a, img',
		filter: null,
		preventOnFilter: true,
		animation: 0,
		easing: null,
		setData: function (dataTransfer, dragEl) {
			dataTransfer.setData('Text', dragEl.textContent);
		},
		dropBubble: false,
		dragoverBubble: false,
		dataIdAttr: 'data-id',
		delay: 0,
		delayOnTouchOnly: false,
		touchStartThreshold: (Number.parseInt ? Number : window).parseInt(window.devicePixelRatio, 10) || 1,
		forceFallback: false,
		fallbackClass: 'sortable-fallback',
		fallbackOnBody: false,
		fallbackTolerance: 0,
		fallbackOffset: {x: 0, y: 0},
		supportPointer: Sortable.supportPointer !== false && ('PointerEvent' in window),
		emptyInsertThreshold: 5
	};

	PluginManager.initializePlugins(this, el, defaults);

	// Set default options
	for (let name in defaults) {
		!(name in options) && (options[name] = defaults[name]);
	}

	_prepareGroup(options);

	// Bind all private methods
	for (let fn in this) {
		if (fn.charAt(0) === '_' && typeof this[fn] === 'function') {
			this[fn] = this[fn].bind(this);
		}
	}

	// Setup drag mode
	this.nativeDraggable = options.forceFallback ? false : supportDraggable;

	if (this.nativeDraggable) {
		// Touch start threshold cannot be greater than the native dragstart threshold
		this.options.touchStartThreshold = 1;
	}

	// Bind events
	if (options.supportPointer) {
		on(el, 'pointerdown', this._onTapStart);
	} else {
		on(el, 'mousedown', this._onTapStart);
		on(el, 'touchstart', this._onTapStart);
	}

	if (this.nativeDraggable) {
		on(el, 'dragover', this);
		on(el, 'dragenter', this);
	}

	sortables.push(this.el);

	// Restore sorting
	options.store && options.store.get && this.sort(options.store.get(this) || []);

	// Add animation state manager
	Object.assign(this, AnimationStateManager());
}

Sortable.prototype = /** @lends Sortable.prototype */ {
	constructor: Sortable,

	_isOutsideThisEl: function(target) {
		if (!this.el.contains(target) && target !== this.el) {
			lastTarget = null;
		}
	},

	_getDirection: function(evt, target) {
		return (typeof this.options.direction === 'function') ? this.options.direction.call(this, evt, target, dragEl) : this.options.direction;
	},

	_onTapStart: function (/** Event|TouchEvent */evt) {
		if (!evt.cancelable) return;
		let _this = this,
			el = this.el,
			options = this.options,
			preventOnFilter = options.preventOnFilter,
			type = evt.type,
			touch = (evt.touches && evt.touches[0]) || (evt.pointerType && evt.pointerType === 'touch' && evt),
			target = (touch || evt).target,
			originalTarget = evt.target.shadowRoot && ((evt.path && evt.path[0]) || (evt.composedPath && evt.composedPath()[0])) || target,
			filter = options.filter;

		_saveInputCheckedState(el);


		// Don't trigger start event when an element is been dragged, otherwise the evt.oldindex always wrong when set option.group.
		if (dragEl) {
			return;
		}

		if (/mousedown|pointerdown/.test(type) && evt.button !== 0 || options.disabled) {
			return; // only left button and enabled
		}

		// cancel dnd if original target is content editable
		if (originalTarget.isContentEditable) {
			return;
		}

		target = closest(target, options.draggable, el, false);


		if (target && target.animated) {
			return;
		}

		if (lastDownEl === target) {
			// Ignoring duplicate `down`
			return;
		}

		// Get the index of the dragged element within its parent
		oldIndex = index(target);
		oldDraggableIndex = index(target, options.draggable);

		// Check filter
		if (typeof filter === 'function') {
			if (filter.call(this, evt, target, this)) {
				_dispatchEvent({
					sortable: _this,
					rootEl: originalTarget,
					name: 'filter',
					targetEl: target,
					toEl: el,
					fromEl: el
				});
				pluginEvent('filter', _this, { evt });
				preventOnFilter && evt.cancelable && evt.preventDefault();
				return; // cancel dnd
			}
		}
		else if (filter) {
			filter = filter.split(',').some(function (criteria) {
				criteria = closest(originalTarget, criteria.trim(), el, false);

				if (criteria) {
					_dispatchEvent({
						sortable: _this,
						rootEl: criteria,
						name: 'filter',
						targetEl: target,
						fromEl: el,
						toEl: el
					});
					pluginEvent('filter', _this, { evt });
					return true;
				}
			});

			if (filter) {
				preventOnFilter && evt.cancelable && evt.preventDefault();
				return; // cancel dnd
			}
		}

		if (options.handle && !closest(originalTarget, options.handle, el, false)) {
			return;
		}

		// Prepare `dragstart`
		this._prepareDragStart(evt, touch, target);
	},

	_prepareDragStart: function (/** Event */evt, /** Touch */touch, /** HTMLElement */target) {
		let _this = this,
			el = _this.el,
			options = _this.options,
			ownerDocument = el.ownerDocument,
			dragStartFn;

		if (target && !dragEl && (target.parentNode === el)) {
			let dragRect = getRect(target);
			rootEl = el;
			dragEl = target;
			parentEl = dragEl.parentNode;
			nextEl = dragEl.nextSibling;
			lastDownEl = target;
			activeGroup = options.group;

			Sortable.dragged = dragEl;

			tapEvt = {
				target: dragEl,
				clientX: (touch || evt).clientX,
				clientY: (touch || evt).clientY
			};

			tapDistanceLeft = tapEvt.clientX - dragRect.left;
			tapDistanceTop = tapEvt.clientY - dragRect.top;

			this._lastX = (touch || evt).clientX;
			this._lastY = (touch || evt).clientY;

			dragEl.style['will-change'] = 'all';

			dragStartFn = function () {
				pluginEvent('delayEnded', _this, { evt });
				if (Sortable.eventCanceled) {
					_this._onDrop();
					return;
				}
				// Delayed drag has been triggered
				// we can re-enable the events: touchmove/mousemove
				_this._disableDelayedDragEvents();

				if (!FireFox && _this.nativeDraggable) {
					dragEl.draggable = true;
				}

				// Bind the events: dragstart/dragend
				_this._triggerDragStart(evt, touch);

				// Drag start event
				_dispatchEvent({
					sortable: _this,
					name: 'choose',
					originalEvent: evt
				});

				// Chosen item
				toggleClass(dragEl, options.chosenClass, true);
			};

			// Disable "draggable"
			options.ignore.split(',').forEach(function (criteria) {
				find(dragEl, criteria.trim(), _disableDraggable);
			});

			on(ownerDocument, 'dragover', nearestEmptyInsertDetectEvent);
			on(ownerDocument, 'mousemove', nearestEmptyInsertDetectEvent);
			on(ownerDocument, 'touchmove', nearestEmptyInsertDetectEvent);

			on(ownerDocument, 'mouseup', _this._onDrop);
			on(ownerDocument, 'touchend', _this._onDrop);
			on(ownerDocument, 'touchcancel', _this._onDrop);

			// Make dragEl draggable (must be before delay for FireFox)
			if (FireFox && this.nativeDraggable) {
				this.options.touchStartThreshold = 4;
				dragEl.draggable = true;
			}

			pluginEvent('delayStart', this, { evt });

			// Delay is impossible for native DnD in Edge or IE
			if (options.delay && (!options.delayOnTouchOnly || touch) && (!this.nativeDraggable || !(Edge || IE11OrLess))) {
				if (Sortable.eventCanceled) {
					this._onDrop();
					return;
				}
				// If the user moves the pointer or let go the click or touch
				// before the delay has been reached:
				// disable the delayed drag
				on(ownerDocument, 'mouseup', _this._disableDelayedDrag);
				on(ownerDocument, 'touchend', _this._disableDelayedDrag);
				on(ownerDocument, 'touchcancel', _this._disableDelayedDrag);
				on(ownerDocument, 'mousemove', _this._delayedDragTouchMoveHandler);
				on(ownerDocument, 'touchmove', _this._delayedDragTouchMoveHandler);
				options.supportPointer && on(ownerDocument, 'pointermove', _this._delayedDragTouchMoveHandler);

				_this._dragStartTimer = setTimeout(dragStartFn, options.delay);
			} else {
				dragStartFn();
			}
		}
	},

	_delayedDragTouchMoveHandler: function (/** TouchEvent|PointerEvent **/e) {
		let touch = e.touches ? e.touches[0] : e;
		if (Math.max(Math.abs(touch.clientX - this._lastX), Math.abs(touch.clientY - this._lastY))
				>= Math.floor(this.options.touchStartThreshold / (this.nativeDraggable && window.devicePixelRatio || 1))
		) {
			this._disableDelayedDrag();
		}
	},

	_disableDelayedDrag: function () {
		dragEl && _disableDraggable(dragEl);
		clearTimeout(this._dragStartTimer);

		this._disableDelayedDragEvents();
	},

	_disableDelayedDragEvents: function () {
		let ownerDocument = this.el.ownerDocument;
		off(ownerDocument, 'mouseup', this._disableDelayedDrag);
		off(ownerDocument, 'touchend', this._disableDelayedDrag);
		off(ownerDocument, 'touchcancel', this._disableDelayedDrag);
		off(ownerDocument, 'mousemove', this._delayedDragTouchMoveHandler);
		off(ownerDocument, 'touchmove', this._delayedDragTouchMoveHandler);
		off(ownerDocument, 'pointermove', this._delayedDragTouchMoveHandler);
	},

	_triggerDragStart: function (/** Event */evt, /** Touch */touch) {
		touch = touch || (evt.pointerType == 'touch' && evt);

		if (!this.nativeDraggable || touch) {
			if (this.options.supportPointer) {
				on(document, 'pointermove', this._onTouchMove);
			} else if (touch) {
				on(document, 'touchmove', this._onTouchMove);
			} else {
				on(document, 'mousemove', this._onTouchMove);
			}
		} else {
			on(dragEl, 'dragend', this);
			on(rootEl, 'dragstart', this._onDragStart);
		}

		try {
			if (document.selection) {
				// Timeout neccessary for IE9
				_nextTick(function () {
					document.selection.empty();
				});
			} else {
				window.getSelection().removeAllRanges();
			}
		} catch (err) {
		}
	},

	_dragStarted: function (fallback, evt) {
		let _this = this;
		awaitingDragStarted = false;
		if (rootEl && dragEl) {
			pluginEvent('dragStarted', this, { evt });

			if (this.nativeDraggable) {
				on(document, 'dragover', _checkOutsideTargetEl);
			}
			let options = this.options;

			// Apply effect
			!fallback && toggleClass(dragEl, options.dragClass, false);
			toggleClass(dragEl, options.ghostClass, true);

			Sortable.active = this;

			fallback && this._appendGhost();

			// Drag start event
			_dispatchEvent({
				sortable: this,
				name: 'start',
				originalEvent: evt
			});
		} else {
			this._nulling();
		}
	},

	_emulateDragOver: function () {
		if (touchEvt) {
			this._lastX = touchEvt.clientX;
			this._lastY = touchEvt.clientY;

			_hideGhostForTarget();

			let target = document.elementFromPoint(touchEvt.clientX, touchEvt.clientY);
			let parent = target;

			while (target && target.shadowRoot) {
				target = target.shadowRoot.elementFromPoint(touchEvt.clientX, touchEvt.clientY);
				if (target === parent) break;
				parent = target;
			}

			dragEl.parentNode[expando]._isOutsideThisEl(target);

			if (parent) {
				do {
					if (parent[expando]) {
						let inserted;

						inserted = parent[expando]._onDragOver({
							clientX: touchEvt.clientX,
							clientY: touchEvt.clientY,
							target: target,
							rootEl: parent
						});

						if (inserted && !this.options.dragoverBubble) {
							break;
						}
					}

					target = parent; // store last element
				}
				/* jshint boss:true */
				while (parent = parent.parentNode);
			}

			_unhideGhostForTarget();
		}
	},


	_onTouchMove: function (/**TouchEvent*/evt) {
		if (tapEvt) {
			let	options = this.options,
				fallbackTolerance = options.fallbackTolerance,
				fallbackOffset = options.fallbackOffset,
				touch = evt.touches ? evt.touches[0] : evt,
				ghostMatrix = ghostEl && matrix(ghostEl, true),
				scaleX = ghostEl && ghostMatrix && ghostMatrix.a,
				scaleY = ghostEl && ghostMatrix && ghostMatrix.d,
				relativeScrollOffset = PositionGhostAbsolutely && ghostRelativeParent && getRelativeScrollOffset(ghostRelativeParent),
				dx = ((touch.clientX - tapEvt.clientX)
						+ fallbackOffset.x) / (scaleX || 1)
						+ (relativeScrollOffset ? (relativeScrollOffset[0] - ghostRelativeParentInitialScroll[0]) : 0) / (scaleX || 1),
				dy = ((touch.clientY - tapEvt.clientY)
						+ fallbackOffset.y) / (scaleY || 1)
						+ (relativeScrollOffset ? (relativeScrollOffset[1] - ghostRelativeParentInitialScroll[1]) : 0) / (scaleY || 1);

			// only set the status to dragging, when we are actually dragging
			if (!Sortable.active && !awaitingDragStarted) {
				if (fallbackTolerance &&
					Math.max(Math.abs(touch.clientX - this._lastX), Math.abs(touch.clientY - this._lastY)) < fallbackTolerance
				) {
					return;
				}
				this._onDragStart(evt, true);
			}

			if (ghostEl) {
				if (ghostMatrix) {
					ghostMatrix.e += dx - (lastDx || 0);
					ghostMatrix.f += dy - (lastDy || 0);
				} else {
					ghostMatrix = {
						a: 1,
						b: 0,
						c: 0,
						d: 1,
						e: dx,
						f: dy
					};
				}

				let cssMatrix = `matrix(${ghostMatrix.a},${ghostMatrix.b},${ghostMatrix.c},${ghostMatrix.d},${ghostMatrix.e},${ghostMatrix.f})`;

				css(ghostEl, 'webkitTransform', cssMatrix);
				css(ghostEl, 'mozTransform', cssMatrix);
				css(ghostEl, 'msTransform', cssMatrix);
				css(ghostEl, 'transform', cssMatrix);

				lastDx = dx;
				lastDy = dy;

				touchEvt = touch;
			}

			evt.cancelable && evt.preventDefault();
		}
	},

	_appendGhost: function () {
		// Bug if using scale(): https://stackoverflow.com/questions/2637058
		// Not being adjusted for
		if (!ghostEl) {
			let container = this.options.fallbackOnBody ? document.body : rootEl,
				rect = getRect(dragEl, true, PositionGhostAbsolutely, true, container),
				options = this.options;

			// Position absolutely
			if (PositionGhostAbsolutely) {
				// Get relatively positioned parent
				ghostRelativeParent = container;

				while (
					css(ghostRelativeParent, 'position') === 'static' &&
					css(ghostRelativeParent, 'transform') === 'none' &&
					ghostRelativeParent !== document
				) {
					ghostRelativeParent = ghostRelativeParent.parentNode;
				}

				if (ghostRelativeParent !== document.body && ghostRelativeParent !== document.documentElement) {
					if (ghostRelativeParent === document) ghostRelativeParent = getWindowScrollingElement();

					rect.top += ghostRelativeParent.scrollTop;
					rect.left += ghostRelativeParent.scrollLeft;
				} else {
					ghostRelativeParent = getWindowScrollingElement();
				}
				ghostRelativeParentInitialScroll = getRelativeScrollOffset(ghostRelativeParent);
			}


			ghostEl = dragEl.cloneNode(true);

			toggleClass(ghostEl, options.ghostClass, false);
			toggleClass(ghostEl, options.fallbackClass, true);
			toggleClass(ghostEl, options.dragClass, true);

			css(ghostEl, 'transition', '');
			css(ghostEl, 'transform', '');

			css(ghostEl, 'box-sizing', 'border-box');
			css(ghostEl, 'margin', 0);
			css(ghostEl, 'top', rect.top);
			css(ghostEl, 'left', rect.left);
			css(ghostEl, 'width', rect.width);
			css(ghostEl, 'height', rect.height);
			css(ghostEl, 'opacity', '0.8');
			css(ghostEl, 'position', (PositionGhostAbsolutely ? 'absolute' : 'fixed'));
			css(ghostEl, 'zIndex', '100000');
			css(ghostEl, 'pointerEvents', 'none');


			Sortable.ghost = ghostEl;

			container.appendChild(ghostEl);

			// Set transform-origin
			css(ghostEl, 'transform-origin', (tapDistanceLeft / parseInt(ghostEl.style.width) * 100) + '% ' + (tapDistanceTop / parseInt(ghostEl.style.height) * 100) + '%');
		}
	},

	_onDragStart: function (/**Event*/evt, /**boolean*/fallback) {
		let _this = this;
		let dataTransfer = evt.dataTransfer;
		let options = _this.options;

		pluginEvent('dragStart', this, { evt });
		if (Sortable.eventCanceled) {
			this._onDrop();
			return;
		}

		pluginEvent('setupClone', this);
		if (!Sortable.eventCanceled) {
			cloneEl = clone(dragEl);

			cloneEl.draggable = false;
			cloneEl.style['will-change'] = '';

			this._hideClone();

			toggleClass(cloneEl, this.options.chosenClass, false);
			Sortable.clone = cloneEl;
		}


		// #1143: IFrame support workaround
		_this.cloneId = _nextTick(function() {
			pluginEvent('clone', _this);
			if (Sortable.eventCanceled) return;

			if (!_this.options.removeCloneOnHide) {
				rootEl.insertBefore(cloneEl, dragEl);
			}
			_this._hideClone();

			_dispatchEvent({
				sortable: _this,
				name: 'clone'
			});
		});


		!fallback && toggleClass(dragEl, options.dragClass, true);

		// Set proper drop events
		if (fallback) {
			ignoreNextClick = true;
			_this._loopId = setInterval(_this._emulateDragOver, 50);
		} else {
			// Undo what was set in _prepareDragStart before drag started
			off(document, 'mouseup', _this._onDrop);
			off(document, 'touchend', _this._onDrop);
			off(document, 'touchcancel', _this._onDrop);

			if (dataTransfer) {
				dataTransfer.effectAllowed = 'move';
				options.setData && options.setData.call(_this, dataTransfer, dragEl);
			}

			on(document, 'drop', _this);

			// #1276 fix:
			css(dragEl, 'transform', 'translateZ(0)');
		}

		awaitingDragStarted = true;

		_this._dragStartId = _nextTick(_this._dragStarted.bind(_this, fallback, evt));
		on(document, 'selectstart', _this);

		moved = true;

		if (Safari) {
			css(document.body, 'user-select', 'none');
		}
	},


	// Returns true - if no further action is needed (either inserted or another condition)
	_onDragOver: function (/**Event*/evt) {
		let el = this.el,
			target = evt.target,
			dragRect,
			targetRect,
			revert,
			options = this.options,
			group = options.group,
			activeSortable = Sortable.active,
			isOwner = (activeGroup === group),
			canSort = options.sort,
			fromSortable = (putSortable || activeSortable),
			vertical,
			_this = this,
			completedFired = false;

		if (_silent) return;

		function dragOverEvent(name, extra) {
			pluginEvent(name, _this, {
				evt,
				isOwner,
				axis: vertical ? 'vertical' : 'horizontal',
				revert,
				dragRect,
				targetRect,
				canSort,
				fromSortable,
				target,
				completed,
				onMove(target, after) {
					return onMove(rootEl, el, dragEl, dragRect, target, getRect(target), evt, after);
				},
				changed,
				...extra
			});
		}

		// Capture animation state
		function capture() {
			dragOverEvent('dragOverAnimationCapture');

			_this.captureAnimationState();
			if (_this !== fromSortable) {
				fromSortable.captureAnimationState();
			}
		}

		// Return invocation when dragEl is inserted (or completed)
		function completed(insertion) {
			dragOverEvent('dragOverCompleted', { insertion });

			if (insertion) {
				// Clones must be hidden before folding animation to capture dragRectAbsolute properly
				if (isOwner) {
					activeSortable._hideClone();
				} else {
					activeSortable._showClone(_this);
				}

				if (_this !== fromSortable) {
					// Set ghost class to new sortable's ghost class
					toggleClass(dragEl, putSortable ? putSortable.options.ghostClass : activeSortable.options.ghostClass, false);
					toggleClass(dragEl, options.ghostClass, true);
				}

				if (putSortable !== _this && _this !== Sortable.active) {
					putSortable = _this;
				} else if (_this === Sortable.active && putSortable) {
					putSortable = null;
				}

				// Animation
				if (fromSortable === _this) {
					_this._ignoreWhileAnimating = target;
				}
				_this.animateAll(function() {
					dragOverEvent('dragOverAnimationComplete');
					_this._ignoreWhileAnimating = null;
				});
				if (_this !== fromSortable) {
					fromSortable.animateAll();
					fromSortable._ignoreWhileAnimating = null;
				}
			}


			// Null lastTarget if it is not inside a previously swapped element
			if ((target === dragEl && !dragEl.animated) || (target === el && !target.animated)) {
				lastTarget = null;
			}

			// no bubbling and not fallback
			if (!options.dragoverBubble && !evt.rootEl && target !== document) {
				dragEl.parentNode[expando]._isOutsideThisEl(evt.target);

				// Do not detect for empty insert if already inserted
				!insertion && nearestEmptyInsertDetectEvent(evt);
			}

			!options.dragoverBubble && evt.stopPropagation && evt.stopPropagation();

			return (completedFired = true);
		}

		// Call when dragEl has been inserted
		function changed() {
			newIndex = index(dragEl);
			newDraggableIndex = index(dragEl, options.draggable);
			_dispatchEvent({
				sortable: _this,
				name: 'change',
				toEl: el,
				newIndex,
				newDraggableIndex,
				originalEvent: evt
			});
		}


		if (evt.preventDefault !== void 0) {
			evt.cancelable && evt.preventDefault();
		}


		target = closest(target, options.draggable, el, true);

		dragOverEvent('dragOver');
		if (Sortable.eventCanceled) return completedFired;

		if (
			dragEl.contains(evt.target) ||
			target.animated && target.animatingX && target.animatingY ||
			_this._ignoreWhileAnimating === target
		) {
			return completed(false);
		}

		ignoreNextClick = false;

		if (activeSortable && !options.disabled &&
			(isOwner
				? canSort || (revert = !rootEl.contains(dragEl)) // Reverting item into the original list
				: (
					putSortable === this ||
					(
						(this.lastPutMode = activeGroup.checkPull(this, activeSortable, dragEl, evt)) &&
						group.checkPut(this, activeSortable, dragEl, evt)
					)
				)
			)
		) {
			vertical = this._getDirection(evt, target) === 'vertical';

			dragRect = getRect(dragEl);

			dragOverEvent('dragOverValid');
			if (Sortable.eventCanceled) return completedFired;

			if (revert) {
				parentEl = rootEl; // actualization
				capture();

				this._hideClone();

				dragOverEvent('revert');

				if (!Sortable.eventCanceled) {
					if (nextEl) {
						rootEl.insertBefore(dragEl, nextEl);
					} else {
						rootEl.appendChild(dragEl);
					}
				}

				return completed(true);
			}

			let elLastChild = lastChild(el, options.draggable);

			if (!elLastChild || _ghostIsLast(evt, vertical, this) && !elLastChild.animated) {
				// If already at end of list: Do not insert
				if (elLastChild === dragEl) {
					return completed(false);
				}

				// assign target only if condition is true
				if (elLastChild && el === evt.target) {
					target = elLastChild;
				}

				if (target) {
					targetRect = getRect(target);
				}

				if (onMove(rootEl, el, dragEl, dragRect, target, targetRect, evt, !!target) !== false) {
					capture();
					el.appendChild(dragEl);
					parentEl = el; // actualization

					changed();
					return completed(true);
				}
			}
			else if (target.parentNode === el) {
				targetRect = getRect(target);
				let direction = 0,
					targetBeforeFirstSwap,
					differentLevel = dragEl.parentNode !== el,
					differentRowCol = !_dragElInRowColumn(dragEl.animated && dragEl.toRect || dragRect, target.animated && target.toRect || targetRect, vertical),
					side1 = vertical ? 'top' : 'left',
					scrolledPastTop = isScrolledPast(target, 'top', 'top') || isScrolledPast(dragEl, 'top', 'top'),
					scrollBefore = scrolledPastTop ? scrolledPastTop.scrollTop : void 0;


				if (lastTarget !== target) {
					targetBeforeFirstSwap = targetRect[side1];
					pastFirstInvertThresh = false;
					isCircumstantialInvert = (!differentRowCol && options.invertSwap) || differentLevel;
				}

				direction = _getSwapDirection(
					evt, target, targetRect, vertical,
					differentRowCol ? 1 : options.swapThreshold,
					options.invertedSwapThreshold == null ? options.swapThreshold : options.invertedSwapThreshold,
					isCircumstantialInvert,
					lastTarget === target
				);

				let sibling;

				if (direction !== 0) {
					// Check if target is beside dragEl in respective direction (ignoring hidden elements)
					let dragIndex = index(dragEl);

					do {
						dragIndex -= direction;
						sibling = parentEl.children[dragIndex];
					} while (sibling && (css(sibling, 'display') === 'none' || sibling === ghostEl));
				}
				// If dragEl is already beside target: Do not insert
				if (
					direction === 0 ||
					sibling === target
				) {
					return completed(false);
				}

				lastTarget = target;

				lastDirection = direction;

				let nextSibling = target.nextElementSibling,
					after = false;

				after = direction === 1;

				let moveVector = onMove(rootEl, el, dragEl, dragRect, target, targetRect, evt, after);

				if (moveVector !== false) {
					if (moveVector === 1 || moveVector === -1) {
						after = (moveVector === 1);
					}

					_silent = true;
					setTimeout(_unsilent, 30);

					capture();

					if (after && !nextSibling) {
						el.appendChild(dragEl);
					} else {
						target.parentNode.insertBefore(dragEl, after ? nextSibling : target);
					}

					// Undo chrome's scroll adjustment (has no effect on other browsers)
					if (scrolledPastTop) {
						scrollBy(scrolledPastTop, 0, scrollBefore - scrolledPastTop.scrollTop);
					}

					parentEl = dragEl.parentNode; // actualization

					// must be done before animation
					if (targetBeforeFirstSwap !== undefined && !isCircumstantialInvert) {
						targetMoveDistance = Math.abs(targetBeforeFirstSwap - getRect(target)[side1]);
					}
					changed();

					return completed(true);
				}
			}

			if (el.contains(dragEl)) {
				return completed(false);
			}
		}

		return false;
	},

	_ignoreWhileAnimating: null,

	_offMoveEvents: function() {
		off(document, 'mousemove', this._onTouchMove);
		off(document, 'touchmove', this._onTouchMove);
		off(document, 'pointermove', this._onTouchMove);
		off(document, 'dragover', nearestEmptyInsertDetectEvent);
		off(document, 'mousemove', nearestEmptyInsertDetectEvent);
		off(document, 'touchmove', nearestEmptyInsertDetectEvent);
	},

	_offUpEvents: function () {
		let ownerDocument = this.el.ownerDocument;

		off(ownerDocument, 'mouseup', this._onDrop);
		off(ownerDocument, 'touchend', this._onDrop);
		off(ownerDocument, 'pointerup', this._onDrop);
		off(ownerDocument, 'touchcancel', this._onDrop);
		off(document, 'selectstart', this);
	},

	_onDrop: function (/**Event*/evt) {
		let el = this.el,
			options = this.options;

		// Get the index of the dragged element within its parent
		newIndex = index(dragEl);
		newDraggableIndex = index(dragEl, options.draggable);

		pluginEvent('drop', this, {
			evt
		});

		parentEl = dragEl && dragEl.parentNode;

		// Get again after plugin event
		newIndex = index(dragEl);
		newDraggableIndex = index(dragEl, options.draggable);

		if (Sortable.eventCanceled) {
			this._nulling();
			return;
		}

		awaitingDragStarted = false;
		isCircumstantialInvert = false;
		pastFirstInvertThresh = false;

		clearInterval(this._loopId);

		clearTimeout(this._dragStartTimer);

		_cancelNextTick(this.cloneId);
		_cancelNextTick(this._dragStartId);

		// Unbind events
		if (this.nativeDraggable) {
			off(document, 'drop', this);
			off(el, 'dragstart', this._onDragStart);
		}
		this._offMoveEvents();
		this._offUpEvents();


		if (Safari) {
			css(document.body, 'user-select', '');
		}

		css(dragEl, 'transform', '');

		if (evt) {
			if (moved) {
				evt.cancelable && evt.preventDefault();
				!options.dropBubble && evt.stopPropagation();
			}

			ghostEl && ghostEl.parentNode && ghostEl.parentNode.removeChild(ghostEl);

			if (rootEl === parentEl || (putSortable && putSortable.lastPutMode !== 'clone')) {
				// Remove clone(s)
				cloneEl && cloneEl.parentNode && cloneEl.parentNode.removeChild(cloneEl);
			}

			if (dragEl) {
				if (this.nativeDraggable) {
					off(dragEl, 'dragend', this);
				}

				_disableDraggable(dragEl);
				dragEl.style['will-change'] = '';

				// Remove classes
				// ghostClass is added in dragStarted
				if (moved && !awaitingDragStarted) {
					toggleClass(dragEl, putSortable ? putSortable.options.ghostClass : this.options.ghostClass, false);
				}
				toggleClass(dragEl, this.options.chosenClass, false);

				// Drag stop event
				_dispatchEvent({
					sortable: this,
					name: 'unchoose',
					toEl: parentEl,
					newIndex: null,
					newDraggableIndex: null,
					originalEvent: evt
				});


				if (rootEl !== parentEl) {

					if (newIndex >= 0) {
						// Add event
						_dispatchEvent({
							rootEl: parentEl,
							name: 'add',
							toEl: parentEl,
							fromEl: rootEl,
							originalEvent: evt
						});

						// Remove event
						_dispatchEvent({
							sortable: this,
							name: 'remove',
							toEl: parentEl,
							originalEvent: evt
						});

						// drag from one list and drop into another
						_dispatchEvent({
							rootEl: parentEl,
							name: 'sort',
							toEl: parentEl,
							fromEl: rootEl,
							originalEvent: evt
						});

						_dispatchEvent({
							sortable: this,
							name: 'sort',
							toEl: parentEl,
							originalEvent: evt
						});
					}

					putSortable && putSortable.save();
				} else {
					if (newIndex !== oldIndex) {
						if (newIndex >= 0) {
							// drag & drop within the same list
							_dispatchEvent({
								sortable: this,
								name: 'update',
								toEl: parentEl,
								originalEvent: evt
							});

							_dispatchEvent({
								sortable: this,
								name: 'sort',
								toEl: parentEl,
								originalEvent: evt
							});
						}
					}
				}

				if (Sortable.active) {
					/* jshint eqnull:true */
					if (newIndex == null || newIndex === -1) {
						newIndex = oldIndex;
						newDraggableIndex = oldDraggableIndex;
					}

					_dispatchEvent({
						sortable: this,
						name: 'end',
						toEl: parentEl,
						originalEvent: evt
					});

					// Save sorting
					this.save();
				}
			}

		}
		this._nulling();
	},

	_nulling: function() {
		pluginEvent('nulling', this);

		rootEl =
		dragEl =
		parentEl =
		ghostEl =
		nextEl =
		cloneEl =
		lastDownEl =
		cloneHidden =

		tapEvt =
		touchEvt =

		moved =
		newIndex =
		newDraggableIndex =
		oldIndex =
		oldDraggableIndex =

		lastTarget =
		lastDirection =

		putSortable =
		activeGroup =
		Sortable.dragged =
		Sortable.ghost =
		Sortable.clone =
		Sortable.active = null;

		savedInputChecked.forEach(function (el) {
			el.checked = true;
		});

		savedInputChecked.length =
		lastDx =
		lastDy = 0;
	},

	handleEvent: function (/**Event*/evt) {
		switch (evt.type) {
			case 'drop':
			case 'dragend':
				this._onDrop(evt);
				break;

			case 'dragenter':
			case 'dragover':
				if (dragEl) {
					this._onDragOver(evt);
					_globalDragOver(evt);
				}
				break;

			case 'selectstart':
				evt.preventDefault();
				break;
		}
	},


	/**
	 * Serializes the item into an array of string.
	 * @returns {String[]}
	 */
	toArray: function () {
		let order = [],
			el,
			children = this.el.children,
			i = 0,
			n = children.length,
			options = this.options;

		for (; i < n; i++) {
			el = children[i];
			if (closest(el, options.draggable, this.el, false)) {
				order.push(el.getAttribute(options.dataIdAttr) || _generateId(el));
			}
		}

		return order;
	},


	/**
	 * Sorts the elements according to the array.
	 * @param  {String[]}  order  order of the items
	 */
	sort: function (order) {
		let items = {}, rootEl = this.el;

		this.toArray().forEach(function (id, i) {
			let el = rootEl.children[i];

			if (closest(el, this.options.draggable, rootEl, false)) {
				items[id] = el;
			}
		}, this);

		order.forEach(function (id) {
			if (items[id]) {
				rootEl.removeChild(items[id]);
				rootEl.appendChild(items[id]);
			}
		});
	},


	/**
	 * Save the current sorting
	 */
	save: function () {
		let store = this.options.store;
		store && store.set && store.set(this);
	},


	/**
	 * For each element in the set, get the first element that matches the selector by testing the element itself and traversing up through its ancestors in the DOM tree.
	 * @param   {HTMLElement}  el
	 * @param   {String}       [selector]  default: `options.draggable`
	 * @returns {HTMLElement|null}
	 */
	closest: function (el, selector) {
		return closest(el, selector || this.options.draggable, this.el, false);
	},


	/**
	 * Set/get option
	 * @param   {string} name
	 * @param   {*}      [value]
	 * @returns {*}
	 */
	option: function (name, value) {
		let options = this.options;

		if (value === void 0) {
			return options[name];
		} else {
			let modifiedValue = PluginManager.modifyOption(this, name, value);
			if (typeof modifiedValue !== 'undefined') {
				options[name] = modifiedValue;
			} else {
				options[name] = value;
			}

			if (name === 'group') {
				_prepareGroup(options);
			}
		}
	},


	/**
	 * Destroy
	 */
	destroy: function () {
		pluginEvent('destroy', this);
		let el = this.el;

		el[expando] = null;

		off(el, 'mousedown', this._onTapStart);
		off(el, 'touchstart', this._onTapStart);
		off(el, 'pointerdown', this._onTapStart);

		if (this.nativeDraggable) {
			off(el, 'dragover', this);
			off(el, 'dragenter', this);
		}
		// Remove draggable attributes
		Array.prototype.forEach.call(el.querySelectorAll('[draggable]'), function (el) {
			el.removeAttribute('draggable');
		});

		this._onDrop();

		this._disableDelayedDragEvents();

		sortables.splice(sortables.indexOf(this.el), 1);

		this.el = el = null;
	},

	_hideClone: function() {
		if (!cloneHidden) {
			pluginEvent('hideClone', this);
			if (Sortable.eventCanceled) return;


			css(cloneEl, 'display', 'none');
			if (this.options.removeCloneOnHide && cloneEl.parentNode) {
				cloneEl.parentNode.removeChild(cloneEl);
			}
			cloneHidden = true;
		}
	},

	_showClone: function(putSortable) {
		if (putSortable.lastPutMode !== 'clone') {
			this._hideClone();
			return;
		}


		if (cloneHidden) {
			pluginEvent('showClone', this);
			if (Sortable.eventCanceled) return;

			// show clone at dragEl or original position
			if (rootEl.contains(dragEl) && !this.options.group.revertClone) {
				rootEl.insertBefore(cloneEl, dragEl);
			} else if (nextEl) {
				rootEl.insertBefore(cloneEl, nextEl);
			} else {
				rootEl.appendChild(cloneEl);
			}

			if (this.options.group.revertClone) {
				this.animate(dragEl, cloneEl);
			}

			css(cloneEl, 'display', '');
			cloneHidden = false;
		}
	}
};

function _globalDragOver(/**Event*/evt) {
	if (evt.dataTransfer) {
		evt.dataTransfer.dropEffect = 'move';
	}
	evt.cancelable && evt.preventDefault();
}

function onMove(fromEl, toEl, dragEl, dragRect, targetEl, targetRect, originalEvent, willInsertAfter) {
	let evt,
		sortable = fromEl[expando],
		onMoveFn = sortable.options.onMove,
		retVal;
	// Support for new CustomEvent feature
	if (window.CustomEvent && !IE11OrLess && !Edge) {
		evt = new CustomEvent('move', {
			bubbles: true,
			cancelable: true
		});
	} else {
		evt = document.createEvent('Event');
		evt.initEvent('move', true, true);
	}

	evt.to = toEl;
	evt.from = fromEl;
	evt.dragged = dragEl;
	evt.draggedRect = dragRect;
	evt.related = targetEl || toEl;
	evt.relatedRect = targetRect || getRect(toEl);
	evt.willInsertAfter = willInsertAfter;

	evt.originalEvent = originalEvent;

	fromEl.dispatchEvent(evt);

	if (onMoveFn) {
		retVal = onMoveFn.call(sortable, evt, originalEvent);
	}

	return retVal;
}

function _disableDraggable(el) {
	el.draggable = false;
}

function _unsilent() {
	_silent = false;
}


function _ghostIsLast(evt, vertical, sortable) {
	let rect = getRect(lastChild(sortable.el, sortable.options.draggable));
	const spacer = 10;

	return vertical ?
		(evt.clientX > rect.right + spacer || evt.clientX <= rect.right && evt.clientY > rect.bottom && evt.clientX >= rect.left) :
		(evt.clientX > rect.right && evt.clientY > rect.top || evt.clientX <= rect.right && evt.clientY > rect.bottom + spacer);
}

function _getSwapDirection(evt, target, targetRect, vertical, swapThreshold, invertedSwapThreshold, invertSwap, isLastTarget) {
	let mouseOnAxis = vertical ? evt.clientY : evt.clientX,
		targetLength = vertical ? targetRect.height : targetRect.width,
		targetS1 = vertical ? targetRect.top : targetRect.left,
		targetS2 = vertical ? targetRect.bottom : targetRect.right,
		invert = false;


	if (!invertSwap) {
		// Never invert or create dragEl shadow when target movemenet causes mouse to move past the end of regular swapThreshold
		if (isLastTarget && targetMoveDistance < targetLength * swapThreshold) { // multiplied only by swapThreshold because mouse will already be inside target by (1 - threshold) * targetLength / 2
			// check if past first invert threshold on side opposite of lastDirection
			if (!pastFirstInvertThresh &&
				(lastDirection === 1 ?
					(
						mouseOnAxis > targetS1 + targetLength * invertedSwapThreshold / 2
					) :
					(
						mouseOnAxis < targetS2 - targetLength * invertedSwapThreshold / 2
					)
				)
			)
			{
				// past first invert threshold, do not restrict inverted threshold to dragEl shadow
				pastFirstInvertThresh = true;
			}

			if (!pastFirstInvertThresh) {
				// dragEl shadow (target move distance shadow)
				if (
					lastDirection === 1 ?
					(
						mouseOnAxis < targetS1 + targetMoveDistance // over dragEl shadow
					) :
					(
						mouseOnAxis > targetS2 - targetMoveDistance
					)
				)
				{
					return -lastDirection;
				}
			} else {
				invert = true;
			}
		} else {
			// Regular
			if (
				mouseOnAxis > targetS1 + (targetLength * (1 - swapThreshold) / 2) &&
				mouseOnAxis < targetS2 - (targetLength * (1 - swapThreshold) / 2)
			) {
				return _getInsertDirection(target);
			}
		}
	}

	invert = invert || invertSwap;

	if (invert) {
		// Invert of regular
		if (
			mouseOnAxis < targetS1 + (targetLength * invertedSwapThreshold / 2) ||
			mouseOnAxis > targetS2 - (targetLength * invertedSwapThreshold / 2)
		)
		{
			return ((mouseOnAxis > targetS1 + targetLength / 2) ? 1 : -1);
		}
	}

	return 0;
}

/**
 * Gets the direction dragEl must be swapped relative to target in order to make it
 * seem that dragEl has been "inserted" into that element's position
 * @param  {HTMLElement} target       The target whose position dragEl is being inserted at
 * @return {Number}                   Direction dragEl must be swapped
 */
function _getInsertDirection(target) {
	if (index(dragEl) < index(target)) {
		return 1;
	} else {
		return -1;
	}
}


/**
 * Generate id
 * @param   {HTMLElement} el
 * @returns {String}
 * @private
 */
function _generateId(el) {
	let str = el.tagName + el.className + el.src + el.href + el.textContent,
		i = str.length,
		sum = 0;

	while (i--) {
		sum += str.charCodeAt(i);
	}

	return sum.toString(36);
}

function _saveInputCheckedState(root) {
	savedInputChecked.length = 0;

	let inputs = root.getElementsByTagName('input');
	let idx = inputs.length;

	while (idx--) {
		let el = inputs[idx];
		el.checked && savedInputChecked.push(el);
	}
}

function _nextTick(fn) {
	return setTimeout(fn, 0);
}

function _cancelNextTick(id) {
	return clearTimeout(id);
}

// Fixed #973:
if (documentExists) {
	on(document, 'touchmove', function(evt) {
		if ((Sortable.active || awaitingDragStarted) && evt.cancelable) {
			evt.preventDefault();
		}
	});
}


// Export utils
Sortable.utils = {
	on: on,
	off: off,
	css: css,
	find: find,
	is: function (el, selector) {
		return !!closest(el, selector, el, false);
	},
	extend: extend,
	throttle: throttle,
	closest: closest,
	toggleClass: toggleClass,
	clone: clone,
	index: index,
	nextTick: _nextTick,
	cancelNextTick: _cancelNextTick,
	detectDirection: _detectDirection,
	getChild: getChild
};


/**
 * Get the Sortable instance of an element
 * @param  {HTMLElement} element The element
 * @return {Sortable|undefined}         The instance of Sortable
 */
Sortable.get = function(element) {
	return element[expando];
};

/**
 * Mount a plugin to Sortable
 * @param  {...SortablePlugin|SortablePlugin[]} plugins       Plugins being mounted
 */
Sortable.mount = function(...plugins) {
	if (plugins[0].constructor === Array) plugins = plugins[0];

	plugins.forEach((plugin) => {
		if (!plugin.prototype || !plugin.prototype.constructor) {
			throw `Sortable: Mounted plugin must be a constructor function, not ${ {}.toString.call(plugin) }`;
		}
		if (plugin.utils) Sortable.utils = { ...Sortable.utils, ...plugin.utils };

		PluginManager.mount(plugin);
	});
};



/**
 * Create sortable instance
 * @param {HTMLElement}  el
 * @param {Object}      [options]
 */
Sortable.create = function (el, options) {
	return new Sortable(el, options);
};


// Export
Sortable.version = version;


export default Sortable;
