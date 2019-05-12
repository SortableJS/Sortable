(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global = global || self, global.Swap = factory());
}(this, function () { 'use strict';

	function userAgent(pattern) {
	  return !!navigator.userAgent.match(pattern);
	}

	var IE11OrLess = userAgent(/(?:Trident.*rv[ :]?11\.|msie|iemobile)/i);
	var Edge = userAgent(/Edge/i);
	var FireFox = userAgent(/firefox/i);
	var Safari = userAgent(/safari/i) && !userAgent(/chrome/i) && !userAgent(/android/i);
	var IOS = userAgent(/iP(ad|od|hone)/i);

	function _matches(
	/**HTMLElement*/
	el,
	/**String*/
	selector) {
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
	    } catch (_) {
	      return false;
	    }
	  }

	  return false;
	}
	function _toggleClass(el, name, state) {
	  if (el && name) {
	    if (el.classList) {
	      el.classList[state ? 'add' : 'remove'](name);
	    } else {
	      var className = (' ' + el.className + ' ').replace(R_SPACE, ' ').replace(' ' + name + ' ', ' ');
	      el.className = (className + (state ? ' ' + name : '')).replace(R_SPACE, ' ');
	    }
	  }
	}
	/**
	 * Returns the index of an element within its parent for a selected set of
	 * elements
	 * @param  {HTMLElement} el
	 * @param  {selector} selector
	 * @return {number}
	 */

	function _index(el, selector) {
	  var index = 0;

	  if (!el || !el.parentNode) {
	    return -1;
	  }

	  while (el && (el = el.previousElementSibling)) {
	    if (el.nodeName.toUpperCase() !== 'TEMPLATE' && (
	    /*&& el !== cloneEl*/
	    !selector || _matches(el, selector))) {
	      index++;
	    }
	  }

	  return index;
	}
	function _extend(dst, src) {
	  if (dst && src) {
	    for (var key in src) {
	      if (src.hasOwnProperty(key)) {
	        dst[key] = src[key];
	      }
	    }
	  }

	  return dst;
	}
	var expando = 'Sortable' + new Date().getTime();

	var lastSwapEl;

	function SwapPlugin() {
	  function Swap() {
	    this.options = {
	      swapClass: 'sortable-swap-highlight'
	    };
	  }

	  Swap.prototype = {
	    dragStart: function dragStart(_ref) {
	      var dragEl = _ref.dragEl;
	      lastSwapEl = dragEl;
	    },
	    dragOverValid: function dragOverValid(_ref2) {
	      var completed = _ref2.completed,
	          target = _ref2.target,
	          onMove = _ref2.onMove,
	          changed = _ref2.changed;
	      var el = this.sortable.el,
	          options = this.sortable.options;

	      if (target && target !== el) {
	        var prevSwapEl = lastSwapEl;

	        if (onMove(target) !== false) {
	          _toggleClass(target, options.swapClass, true);

	          lastSwapEl = target;
	        } else {
	          lastSwapEl = null;
	        }

	        if (prevSwapEl && prevSwapEl !== lastSwapEl) {
	          _toggleClass(prevSwapEl, options.swapClass, false);
	        }
	      }

	      changed();
	      return completed(true);
	    },
	    drop: function drop(_ref3) {
	      var putSortable = _ref3.putSortable,
	          dragEl = _ref3.dragEl;
	      var toSortable = putSortable || this.sortable;
	      var options = this.sortable.options;
	      lastSwapEl && _toggleClass(lastSwapEl, options.swapClass, false);

	      if (lastSwapEl && (options.swap || putSortable && putSortable.options.swap)) {
	        if (dragEl !== lastSwapEl) {
	          toSortable.captureAnimationState();
	          swapNodes(dragEl, lastSwapEl);
	          toSortable.animateAll();
	        }
	      }
	    },
	    nulling: function nulling() {
	      lastSwapEl = null;
	    }
	  };
	  return _extend(Swap, {
	    pluginName: 'swap',
	    eventOptions: function eventOptions() {
	      return {
	        lastSwapEl: lastSwapEl
	      };
	    }
	  });
	}

	function swapNodes(n1, n2) {
	  var p1 = n1.parentNode,
	      p2 = n2.parentNode,
	      i1,
	      i2;
	  if (!p1 || !p2 || p1.isEqualNode(n2) || p2.isEqualNode(n1)) return;
	  i1 = _index(n1);
	  i2 = _index(n2);

	  if (p1.isEqualNode(p2) && i1 < i2) {
	    i2++;
	  }

	  p1.insertBefore(n2, p1.children[i1]);
	  p2.insertBefore(n1, p2.children[i2]);
	}

	return SwapPlugin;

}));
