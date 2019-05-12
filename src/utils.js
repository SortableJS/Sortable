import { IE11OrLess } from './BrowserInfo.js';

var captureMode = {
	capture: false,
	passive: false
};

export function _on(el, event, fn) {
	el.addEventListener(event, fn, IE11OrLess ? false : captureMode);
}


export function _off(el, event, fn) {
	el.removeEventListener(event, fn, IE11OrLess ? false : captureMode);
}

export function _matches(/**HTMLElement*/el, /**String*/selector) {
	if (!selector) return;

	selector[0] === '>' && (selector = selector.substring(1));

	if (el) {
		try {
			if (el.matches) {
				return el.matches(selector);
			} else if (el.msMatchesSelector) {
				return el.msMatchesSelector(selector);
			} else if (el.webkitMatchesSelector) {
				return el.webkitMatchesSelector(selector);
			}
		} catch(_) {
			return false;
		}
	}

	return false;
}

export function _getParentOrHost(el) {
	return (el.host && el !== document && el.host.nodeType)
		? el.host
		: el.parentNode;
}

export function _closest(/**HTMLElement*/el, /**String*/selector, /**HTMLElement*/ctx, includeCTX) {
	if (el) {
		ctx = ctx || document;

		do {
			if (
				selector != null &&
				(
					selector[0] === '>' ?
					el.parentNode === ctx && _matches(el, selector) :
					_matches(el, selector)
				) ||
				includeCTX && el === ctx
			) {
				return el;
			}

			if (el === ctx) break;
			/* jshint boss:true */
		} while (el = _getParentOrHost(el));
	}

	return null;
}


export function _toggleClass(el, name, state) {
	if (el && name) {
		if (el.classList) {
			el.classList[state ? 'add' : 'remove'](name);
		}
		else {
			var className = (' ' + el.className + ' ').replace(R_SPACE, ' ').replace(' ' + name + ' ', ' ');
			el.className = (className + (state ? ' ' + name : '')).replace(R_SPACE, ' ');
		}
	}
}


export function _css(el, prop, val) {
	var style = el && el.style;

	if (style) {
		if (val === void 0) {
			if (document.defaultView && document.defaultView.getComputedStyle) {
				val = document.defaultView.getComputedStyle(el, '');
			}
			else if (el.currentStyle) {
				val = el.currentStyle;
			}

			return prop === void 0 ? val : val[prop];
		}
		else {
			if (!(prop in style) && prop.indexOf('webkit') === -1) {
				prop = '-webkit-' + prop;
			}

			style[prop] = val + (typeof val === 'string' ? '' : 'px');
		}
	}
}

export function _matrix(el, selfOnly) {
	var appliedTransforms = '';
	do {
		var transform = _css(el, 'transform');

		if (transform && transform !== 'none') {
			appliedTransforms = transform + ' ' + appliedTransforms;
		}
		/* jshint boss:true */
	} while (!selfOnly && (el = el.parentNode));

	if (window.DOMMatrix) {
		return new DOMMatrix(appliedTransforms);
	} else if (window.WebKitCSSMatrix) {
		return new WebKitCSSMatrix(appliedTransforms);
	} else if (window.CSSMatrix) {
		return new CSSMatrix(appliedTransforms);
	}
}


export function _find(ctx, tagName, iterator) {
	if (ctx) {
		var list = ctx.getElementsByTagName(tagName), i = 0, n = list.length;

		if (iterator) {
			for (; i < n; i++) {
				iterator(list[i], i);
			}
		}

		return list;
	}

	return [];
}



export function _getWindowScrollingElement() {
	if (IE11OrLess) {
		return document.documentElement;
	} else {
		return document.scrollingElement;
	}
}


/**
 * Returns the "bounding client rect" of given element
 * @param  {HTMLElement} el                       The element whose boundingClientRect is wanted
 * @param  {[Boolean]} relativeToContainingBlock  Whether the rect should be relative to the containing block of (including) the container
 * @param  {[Boolean]} relativeToNonStaticParent  Whether the rect should be relative to the relative parent of (including) the contaienr
 * @param  {[Boolean]} undoScale                  Whether the container's scale() should be undone
 * @param  {[HTMLElement]} container              The parent the element will be placed in
 * @return {Object}                               The boundingClientRect of el, with specified adjustments
 */
export function _getRect(el, relativeToContainingBlock, relativeToNonStaticParent, undoScale, container) {
	if (!el.getBoundingClientRect && el !== window) return;

	var elRect,
		top,
		left,
		bottom,
		right,
		height,
		width;

	if (el !== window && el !== _getWindowScrollingElement()) {
		elRect = el.getBoundingClientRect();
		top = elRect.top;
		left = elRect.left;
		bottom = elRect.bottom;
		right = elRect.right;
		height = elRect.height;
		width = elRect.width;
	} else {
		top = 0;
		left = 0;
		bottom = window.innerHeight;
		right = window.innerWidth;
		height = window.innerHeight;
		width = window.innerWidth;
	}

	if ((relativeToContainingBlock || relativeToNonStaticParent) && el !== window) {
		// Adjust for translate()
		container = container || el.parentNode;

		// solves #1123 (see: https://stackoverflow.com/a/37953806/6088312)
		// Not needed on <= IE11
		if (!IE11OrLess) {
			do {
				if (
					container &&
					container.getBoundingClientRect &&
					(
						_css(container, 'transform') !== 'none' ||
						relativeToNonStaticParent &&
						_css(container, 'position') !== 'static'
					)
				) {
					var containerRect = container.getBoundingClientRect();

					// Set relative to edges of padding box of container
					top -= containerRect.top + parseInt(_css(container, 'border-top-width'));
					left -= containerRect.left + parseInt(_css(container, 'border-left-width'));
					bottom = top + elRect.height;
					right = left + elRect.width;

					break;
				}
				/* jshint boss:true */
			} while (container = container.parentNode);
		}
	}

	if (undoScale && el !== window) {
		// Adjust for scale()
		var matrix = _matrix(container || el),
			scaleX = matrix && matrix.a,
			scaleY = matrix && matrix.d;

		if (matrix) {
			top /= scaleY;
			left /= scaleX;

			width /= scaleX;
			height /= scaleY;

			bottom = top + height;
			right = left + width;
		}
	}

	return {
		top: top,
		left: left,
		bottom: bottom,
		right: right,
		width: width,
		height: height
	};
}

/**
 * Checks if a side of an element is scrolled past a side of its parents
 * @param  {HTMLElement}  el           The element who's side being scrolled out of view is in question
 * @param  {[DOMRect]}    rect         Optional rect of `el` to use
 * @param  {String}       elSide       Side of the element in question ('top', 'left', 'right', 'bottom')
 * @param  {String}       parentSide   Side of the parent in question ('top', 'left', 'right', 'bottom')
 * @return {HTMLElement}               The parent scroll element that the el's side is scrolled past, or null if there is no such element
 */
export function _isScrolledPast(el, rect, elSide, parentSide) {
	var parent = _getParentAutoScrollElement(el, true),
		elSideVal = (rect ? rect : _getRect(el))[elSide];

	/* jshint boss:true */
	while (parent) {
		var parentSideVal = _getRect(parent)[parentSide],
			visible;

		if (parentSide === 'top' || parentSide === 'left') {
			visible = elSideVal >= parentSideVal;
		} else {
			visible = elSideVal <= parentSideVal;
		}

		if (!visible) return parent;

		if (parent === _getWindowScrollingElement()) break;

		parent = _getParentAutoScrollElement(parent, false);
	}

	return false;
}



/**
 * Gets nth child of el, ignoring hidden children, sortable's elements (does not ignore clone if it's visible)
 * and non-draggable elements
 * @param  {HTMLElement} el       The parent element
 * @param  {Number} childNum      The index of the child
 * @param  {Object} options       Parent Sortable's options
 * @return {HTMLElement}          The child at index childNum, or null if not found
 */
export function _getChild(el, childNum, options, dragEl, ghostEl) {
	var currentChild = 0,
		i = 0,
		children = el.children;

	while (i < children.length) {
		if (
			children[i].style.display !== 'none' &&
			children[i] !== ghostEl &&
			children[i] !== dragEl &&
			_closest(children[i], options.draggable, el, false)
		) {
			if (currentChild === childNum) {
				return children[i];
			}
			currentChild++;
		}

		i++;
	}
	return null;
}

/**
 * Gets the last child in the el, ignoring ghostEl or invisible elements (clones)
 * @param  {HTMLElement} el       Parent element
 * @return {HTMLElement}          The last child, ignoring ghostEl
 */
export function _lastChild(el, ghostEl) {
	var last = el.lastElementChild;

	while (last && (last === ghostEl || _css(last, 'display') === 'none')) {
		last = last.previousElementSibling;
	}

	return last || null;
}


/**
 * Returns the index of an element within its parent for a selected set of
 * elements
 * @param  {HTMLElement} el
 * @param  {selector} selector
 * @return {number}
 */
export function _index(el, selector) {
	var index = 0;

	if (!el || !el.parentNode) {
		return -1;
	}

	while (el && (el = el.previousElementSibling)) {
		if ((el.nodeName.toUpperCase() !== 'TEMPLATE') /*&& el !== cloneEl*/ && (!selector || _matches(el, selector))) {
			index++;
		}
	}

	return index;
}

/**
 * Returns the scroll offset of the given element, added with all the scroll offsets of parent elements.
 * The value is returned in real pixels.
 * @param  {HTMLElement} el
 * @return {Array}             Offsets in the format of [left, top]
 */
export function _getRelativeScrollOffset(el) {
	var offsetLeft = 0,
		offsetTop = 0,
		winScroller = _getWindowScrollingElement();

	if (el) {
		do {
			var matrix = _matrix(el),
				scaleX = matrix.a,
				scaleY = matrix.d;

			offsetLeft += el.scrollLeft * scaleX;
			offsetTop += el.scrollTop * scaleY;
		} while (el !== winScroller && (el = el.parentNode));
	}

	return [offsetLeft, offsetTop];
}

/**
 * Returns the index of the object within the given array
 * @param  {Array} arr   Array that may or may not hold the object
 * @param  {Object} obj  An object that has a key-value pair unique to and identical to a key-value pair in the object you want to find
 * @return {Number}      The index of the object in the array, or -1
 */
export function _indexOfObject(arr, obj) {
	for (var i in arr) {
		for (var key in obj) {
			if (obj[key] === arr[i][key]) return Number(i);
		}
	}
	return -1;
}


export function _getParentAutoScrollElement(el, includeSelf) {
	// skip to window
	if (!el || !el.getBoundingClientRect) return _getWindowScrollingElement();

	var elem = el;
	var gotSelf = false;
	do {
		// we don't need to get elem css if it isn't even overflowing in the first place (performance)
		if (elem.clientWidth < elem.scrollWidth || elem.clientHeight < elem.scrollHeight) {
			var elemCSS = _css(elem);
			if (
				elem.clientWidth < elem.scrollWidth && (elemCSS.overflowX == 'auto' || elemCSS.overflowX == 'scroll') ||
				elem.clientHeight < elem.scrollHeight && (elemCSS.overflowY == 'auto' || elemCSS.overflowY == 'scroll')
			) {
				if (!elem || !elem.getBoundingClientRect || elem === document.body) return _getWindowScrollingElement();

				if (gotSelf || includeSelf) return elem;
				gotSelf = true;
			}
		}
	/* jshint boss:true */
	} while (elem = elem.parentNode);

	return _getWindowScrollingElement();
}

export function _extend(dst, src) {
	if (dst && src) {
		for (var key in src) {
			if (src.hasOwnProperty(key)) {
				dst[key] = src[key];
			}
		}
	}

	return dst;
}


export function _isRectEqual(rect1, rect2) {
	return Math.round(rect1.top) === Math.round(rect2.top) &&
		Math.round(rect1.left) === Math.round(rect2.left) &&
		Math.round(rect1.height) === Math.round(rect2.height) &&
		Math.round(rect1.width) === Math.round(rect2.width);
}


var _throttleTimeout;
export function _throttle(callback, ms) {
	return function () {
		if (!_throttleTimeout) {
			var args = arguments,
				_this = this;

			_throttleTimeout = setTimeout(function () {
				if (args.length === 1) {
					callback.call(_this, args[0]);
				} else {
					callback.apply(_this, args);
				}

				_throttleTimeout = void 0;
			}, ms);
		}
	};
}


export function _cancelThrottle() {
	clearTimeout(_throttleTimeout);
	_throttleTimeout = void 0;
}


export function _scrollBy(el, x, y) {
	el.scrollLeft += x;
	el.scrollTop += y;
}


export function _clone(el) {
	let Polymer = window.Polymer;
	let $ = window.jQuery || window.Zepto;

	if (Polymer && Polymer.dom) {
		return Polymer.dom(el).cloneNode(true);
	}
	else if ($) {
		return $(el).clone(true)[0];
	}
	else {
		return el.cloneNode(true);
	}
}


export function _setRect(el, rect) {
	_css(el, 'position', 'absolute');
	_css(el, 'top', rect.top);
	_css(el, 'left', rect.left);
	_css(el, 'width', rect.width);
	_css(el, 'height', rect.height);
}

export function _unsetRect(el) {
	_css(el, 'position', '');
	_css(el, 'top', '');
	_css(el, 'left', '');
	_css(el, 'width', '');
	_css(el, 'height', '');
}


export let expando = 'Sortable' + (new Date).getTime();
