import { _throttle, _scrollBy, _getParentAutoScrollElement, _getWindowScrollingElement } from './utils.js';
import { Edge, IE11OrLess, Safari } from './BrowserInfo.js';

let autoScrolls = [],
	lastPointerElemX,
	lastPointerElemY,
	pointerElemChangedInterval;

let autoScroll = _throttle(function (/**Event*/evt, /**Object*/options, /**HTMLElement*/rootEl, /**Boolean*/isFallback) {
	// Bug: https://bugzilla.mozilla.org/show_bug.cgi?id=505521
	if (options.scroll) {
		var _this = rootEl ? rootEl[expando] : window,
			sens = options.scrollSensitivity,
			speed = options.scrollSpeed,

			x = evt.clientX,
			y = evt.clientY,

			winScroller = _getWindowScrollingElement(),

			scrollEl,
			scrollCustomFn,

			scrollThisInstance = false;

		// Detect scrollEl
		if (scrollParentEl !== rootEl) {
			clearAutoScrolls();

			scrollEl = options.scroll;
			scrollCustomFn = options.scrollFn;

			if (scrollEl === true) {
				scrollEl = _getParentAutoScrollElement(rootEl, true);
				scrollParentEl = scrollEl;
			}
		}


		var layersOut = 0;
		var currentParent = scrollEl;
		do {
			var	el = currentParent,
				rect = _getRect(el),

				top = rect.top,
				bottom = rect.bottom,
				left = rect.left,
				right = rect.right,

				width = rect.width,
				height = rect.height,

				scrollWidth,
				scrollHeight,

				css,

				vx,
				vy,

				canScrollX,
				canScrollY,

				scrollPosX,
				scrollPosY;


			scrollWidth = el.scrollWidth;
			scrollHeight = el.scrollHeight;

			css = _css(el);

			scrollPosX = el.scrollLeft;
			scrollPosY = el.scrollTop;

			if (el === winScroller) {
				canScrollX = width < scrollWidth && (css.overflowX === 'auto' || css.overflowX === 'scroll' || css.overflowX === 'visible');
				canScrollY = height < scrollHeight && (css.overflowY === 'auto' || css.overflowY === 'scroll' || css.overflowY === 'visible');
			} else {
				canScrollX = width < scrollWidth && (css.overflowX === 'auto' || css.overflowX === 'scroll');
				canScrollY = height < scrollHeight && (css.overflowY === 'auto' || css.overflowY === 'scroll');
			}

			vx = canScrollX && (Math.abs(right - x) <= sens && (scrollPosX + width) < scrollWidth) - (Math.abs(left - x) <= sens && !!scrollPosX);

			vy = canScrollY && (Math.abs(bottom - y) <= sens && (scrollPosY + height) < scrollHeight) - (Math.abs(top - y) <= sens && !!scrollPosY);


			if (!autoScrolls[layersOut]) {
				for (var i = 0; i <= layersOut; i++) {
					if (!autoScrolls[i]) {
						autoScrolls[i] = {};
					}
				}
			}

			if (autoScrolls[layersOut].vx != vx || autoScrolls[layersOut].vy != vy || autoScrolls[layersOut].el !== el) {
				autoScrolls[layersOut].el = el;
				autoScrolls[layersOut].vx = vx;
				autoScrolls[layersOut].vy = vy;

				clearInterval(autoScrolls[layersOut].pid);

				if (el && (vx != 0 || vy != 0)) {
					scrollThisInstance = true;
					/* jshint loopfunc:true */
					autoScrolls[layersOut].pid = setInterval((function () {
						// emulate drag over during autoscroll (fallback), emulating native DnD behaviour
						if (isFallback && this.layer === 0) {
							Sortable.active._emulateDragOver(true);
							Sortable.active._onTouchMove(touchEvt, true);
						}
						var scrollOffsetY = autoScrolls[this.layer].vy ? autoScrolls[this.layer].vy * speed : 0;
						var scrollOffsetX = autoScrolls[this.layer].vx ? autoScrolls[this.layer].vx * speed : 0;

						if ('function' === typeof(scrollCustomFn)) {
							if (scrollCustomFn.call(_this, scrollOffsetX, scrollOffsetY, evt, touchEvt, autoScrolls[this.layer].el) !== 'continue') {
								return;
							}
						}

						_scrollBy(autoScrolls[this.layer].el, scrollOffsetX, scrollOffsetY);
					}).bind({layer: layersOut}), 24);
				}
			}
			layersOut++;
		} while (options.bubbleScroll && currentParent !== winScroller && (currentParent = _getParentAutoScrollElement(currentParent, false)));
		scrolling = scrollThisInstance; // in case another function catches scrolling as false in between when it is not
	}
}, 30);

export function clearAutoScrolls() {
	autoScrolls.forEach(function(autoScroll) {
		clearInterval(autoScroll.pid);
	});
	autoScrolls = [];
}

export function clearPointerElemChangedInterval() {
	clearInterval(pointerElemChangedInterval);
}


export function handleAutoScroll(evt, fallback) {
	if (!this.options.scroll) return;
	var x = evt.clientX,
		y = evt.clientY,

		elem = document.elementFromPoint(x, y),
		_this = this;

	// IE does not seem to have native autoscroll,
	// Edge's autoscroll seems too conditional,
	// MACOS Safari does not have autoscroll,
	// Firefox and Chrome are good
	if (fallback || Edge || IE11OrLess || Safari) {
		autoScroll(evt, _this.options, elem, fallback);

		// Listener for pointer element change
		var ogElemScroller = _getParentAutoScrollElement(elem, true);
		if (
			scrolling &&
			(
				!pointerElemChangedInterval ||
				x !== lastPointerElemX ||
				y !== lastPointerElemY
			)
		) {

			pointerElemChangedInterval && clearPointerElemChangedInterval();
			// Detect for pointer elem change, emulating native DnD behaviour
			pointerElemChangedInterval = setInterval(function() {
				// could also check if scroll direction on newElem changes due to parent autoscrolling
				var newElem = _getParentAutoScrollElement(document.elementFromPoint(x, y), true);
				if (newElem !== ogElemScroller) {
					ogElemScroller = newElem;
					clearAutoScrolls();
					autoScroll(evt, _this.options, ogElemScroller, fallback);
				}
			}, 10);
			lastPointerElemX = x;
			lastPointerElemY = y;
		}
	} else {
		// if DnD is enabled (and browser has good autoscrolling), first autoscroll will already scroll, so get parent autoscroll of first autoscroll
		if (!_this.options.bubbleScroll || _getParentAutoScrollElement(elem, true) === _getWindowScrollingElement()) {
			clearAutoScrolls();
			return;
		}
		autoScroll(evt, _this.options, _getParentAutoScrollElement(elem, false), false);
	}
}
