(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global = global || self, global.MultiDrag = factory());
}(this, function () { 'use strict';

	function userAgent(pattern) {
	  return !!navigator.userAgent.match(pattern);
	}

	var IE11OrLess = userAgent(/(?:Trident.*rv[ :]?11\.|msie|iemobile)/i);
	var Edge = userAgent(/Edge/i);
	var FireFox = userAgent(/firefox/i);
	var Safari = userAgent(/safari/i) && !userAgent(/chrome/i) && !userAgent(/android/i);
	var IOS = userAgent(/iP(ad|od|hone)/i);

	var captureMode = {
	  capture: false,
	  passive: false
	};
	function _on(el, event, fn) {
	  el.addEventListener(event, fn, IE11OrLess ? false : captureMode);
	}
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
	function _getParentOrHost(el) {
	  return el.host && el !== document && el.host.nodeType ? el.host : el.parentNode;
	}
	function _closest(
	/**HTMLElement*/
	el,
	/**String*/
	selector,
	/**HTMLElement*/
	ctx, includeCTX) {
	  if (el) {
	    ctx = ctx || document;

	    do {
	      if (selector != null && (selector[0] === '>' ? el.parentNode === ctx && _matches(el, selector) : _matches(el, selector)) || includeCTX && el === ctx) {
	        return el;
	      }

	      if (el === ctx) break;
	      /* jshint boss:true */
	    } while (el = _getParentOrHost(el));
	  }

	  return null;
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
	function _css(el, prop, val) {
	  var style = el && el.style;

	  if (style) {
	    if (val === void 0) {
	      if (document.defaultView && document.defaultView.getComputedStyle) {
	        val = document.defaultView.getComputedStyle(el, '');
	      } else if (el.currentStyle) {
	        val = el.currentStyle;
	      }

	      return prop === void 0 ? val : val[prop];
	    } else {
	      if (!(prop in style) && prop.indexOf('webkit') === -1) {
	        prop = '-webkit-' + prop;
	      }

	      style[prop] = val + (typeof val === 'string' ? '' : 'px');
	    }
	  }
	}
	function _matrix(el, selfOnly) {
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
	function _getWindowScrollingElement() {
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

	function _getRect(el, relativeToContainingBlock, relativeToNonStaticParent, undoScale, container) {
	  if (!el.getBoundingClientRect && el !== window) return;
	  var elRect, top, left, bottom, right, height, width;

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
	    container = container || el.parentNode; // solves #1123 (see: https://stackoverflow.com/a/37953806/6088312)
	    // Not needed on <= IE11

	    if (!IE11OrLess) {
	      do {
	        if (container && container.getBoundingClientRect && (_css(container, 'transform') !== 'none' || relativeToNonStaticParent && _css(container, 'position') !== 'static')) {
	          var containerRect = container.getBoundingClientRect(); // Set relative to edges of padding box of container

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
	function _clone(el) {
	  var Polymer = window.Polymer;
	  var $ = window.jQuery || window.Zepto;

	  if (Polymer && Polymer.dom) {
	    return Polymer.dom(el).cloneNode(true);
	  } else if ($) {
	    return $(el).clone(true)[0];
	  } else {
	    return el.cloneNode(true);
	  }
	}
	function _setRect(el, rect) {
	  _css(el, 'position', 'absolute');

	  _css(el, 'top', rect.top);

	  _css(el, 'left', rect.left);

	  _css(el, 'width', rect.width);

	  _css(el, 'height', rect.height);
	}
	function _unsetRect(el) {
	  _css(el, 'position', '');

	  _css(el, 'top', '');

	  _css(el, 'left', '');

	  _css(el, 'width', '');

	  _css(el, 'height', '');
	}
	var expando = 'Sortable' + new Date().getTime();

	function _defineProperty(obj, key, value) {
	  if (key in obj) {
	    Object.defineProperty(obj, key, {
	      value: value,
	      enumerable: true,
	      configurable: true,
	      writable: true
	    });
	  } else {
	    obj[key] = value;
	  }

	  return obj;
	}

	function _objectSpread(target) {
	  for (var i = 1; i < arguments.length; i++) {
	    var source = arguments[i] != null ? arguments[i] : {};
	    var ownKeys = Object.keys(source);

	    if (typeof Object.getOwnPropertySymbols === 'function') {
	      ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) {
	        return Object.getOwnPropertyDescriptor(source, sym).enumerable;
	      }));
	    }

	    ownKeys.forEach(function (key) {
	      _defineProperty(target, key, source[key]);
	    });
	  }

	  return target;
	}

	var plugins = [];
	var PluginManager = {
	  mount: function mount(plugin) {
	    plugins.push(plugin);
	  },
	  pluginEvent: function pluginEvent(eventName, sortable, evt) {
	    this.eventCanceled = false;

	    for (var i in plugins) {
	      // Only fire plugin event if plugin is enabled in this sortable, and plugin has event defined
	      if (sortable.options[plugins[i].pluginName] && sortable[plugins[i].pluginName][eventName]) {
	        var canceled = sortable[plugins[i].pluginName][eventName](_objectSpread({
	          sortable: sortable
	        }, evt));

	        if (canceled) {
	          this.eventCanceled = true;
	        }
	      }
	    }
	  },
	  initializePlugins: function initializePlugins(sortable, el) {
	    var initializedPlugins = {};

	    for (var i in plugins) {
	      if (!sortable.options[plugins[i].pluginName]) continue;
	      initializedPlugins[plugins[i].pluginName] = new plugins[i](sortable, el);
	    }

	    return initializedPlugins;
	  },
	  getEventOptions: function getEventOptions(name, sortable) {
	    var eventOptions = {};

	    for (var i in plugins) {
	      if (!plugins[i].eventOptions) continue;
	      eventOptions = _objectSpread({}, eventOptions, plugins[i].eventOptions(name, sortable));
	    }

	    return eventOptions;
	  }
	};

	function dispatchEvent(_ref) {
	  var sortable = _ref.sortable,
	      rootEl = _ref.rootEl,
	      name = _ref.name,
	      targetEl = _ref.targetEl,
	      cloneEl = _ref.cloneEl,
	      toEl = _ref.toEl,
	      fromEl = _ref.fromEl,
	      oldIndex = _ref.oldIndex,
	      newIndex = _ref.newIndex,
	      oldDraggableIndex = _ref.oldDraggableIndex,
	      newDraggableIndex = _ref.newDraggableIndex,
	      originalEvt = _ref.originalEvt,
	      putSortable = _ref.putSortable;
	  sortable = sortable || rootEl[expando];
	  var evt,
	      options = sortable.options,
	      onName = 'on' + name.charAt(0).toUpperCase() + name.substr(1); // Support for new CustomEvent feature

	  if (window.CustomEvent && !IE11OrLess && !Edge) {
	    evt = new CustomEvent(name, {
	      bubbles: true,
	      cancelable: true
	    });
	  } else {
	    evt = document.createEvent('Event');
	    evt.initEvent(name, true, true);
	  }

	  evt.to = toEl || rootEl;
	  evt.from = fromEl || rootEl;
	  evt.item = targetEl || rootEl;
	  evt.clone = cloneEl;
	  evt.oldIndex = oldIndex;
	  evt.newIndex = newIndex;
	  evt.oldDraggableIndex = oldDraggableIndex;
	  evt.newDraggableIndex = newDraggableIndex;
	  evt.originalEvent = originalEvt;
	  evt.pullMode = putSortable ? putSortable.lastPutMode : undefined;
	  var eventOptions = PluginManager.getEventOptions(name, sortable);

	  for (var option in eventOptions) {
	    evt[option] = eventOptions[option];
	  }

	  if (rootEl) {
	    rootEl.dispatchEvent(evt);
	  }

	  if (options[onName]) {
	    options[onName].call(sortable, evt);
	  }
	}

	var multiDragElements = [],
	    multiDragClones = [],
	    lastMultiDragSelect,
	    // for selection with modifier key down (SHIFT)
	multiDragSortable,
	    initialFolding = false,
	    // Initial multi-drag fold when drag started
	folding = false,
	    // Folding any other time
	dragStarted = false,
	    dragEl,
	    clonesFromRect,
	    clonesHidden;

	function MultiDragPlugin() {
	  function MultiDrag(sortable) {
	    // Bind all private methods
	    for (var fn in this) {
	      if (fn.charAt(0) === '_' && typeof this[fn] === 'function') {
	        this[fn] = this[fn].bind(this);
	      }
	    }

	    if (sortable.options.supportPointer) {
	      _on(document, 'pointerup', this._deselectMultiDrag);
	    } else {
	      _on(document, 'mouseup', this._deselectMultiDrag);

	      _on(document, 'touchend', this._deselectMultiDrag);
	    }

	    this.options = {
	      selectedClass: 'sortable-selected',
	      setData: function setData(dataTransfer, dragEl) {
	        var data = '';

	        if (multiDragElements.length) {
	          for (var i = 0; i < multiDragElements.length; i++) {
	            data += (!i ? '' : ', ') + multiDragElements[i].textContent;
	          }
	        } else {
	          data = dragEl.textContent;
	        }

	        dataTransfer.setData('Text', data);
	      }
	    };
	  }

	  MultiDrag.prototype = {
	    setupClone: function setupClone(_ref) {
	      var sortable = _ref.sortable;

	      if (multiDragElements.length && multiDragSortable === sortable.el) {
	        for (var i in multiDragElements) {
	          multiDragClones.push(_clone(multiDragElements[i]));
	          multiDragClones[i].sortableIndex = multiDragElements[i].sortableIndex;
	          multiDragClones[i].draggable = false;
	          multiDragClones[i].style['will-change'] = '';

	          _toggleClass(multiDragClones[i], sortable.options.selectedClass, false);

	          multiDragElements[i] === dragEl && _toggleClass(multiDragClones[i], sortable.options.chosenClass, false);
	        }

	        sortable._hideClone();

	        return true;
	      }
	    },
	    clone: function clone(_ref2) {
	      var sortable = _ref2.sortable,
	          rootEl = _ref2.rootEl,
	          dispatchSortableEvent = _ref2.dispatchSortableEvent;

	      if (!sortable.options.removeCloneOnHide) {
	        if (multiDragElements.length && multiDragSortable === sortable.el) {
	          _insertMultiDragClones(true, rootEl);

	          dispatchSortableEvent('clone');
	          return true;
	        }
	      }
	    },
	    showClone: function showClone(_ref3) {
	      var cloneNowShown = _ref3.cloneNowShown,
	          rootEl = _ref3.rootEl;

	      _insertMultiDragClones(false, rootEl);

	      for (var i = 0; i < multiDragClones.length; i++) {
	        _css(multiDragClones[i], 'display', '');
	      }

	      cloneNowShown();
	      clonesHidden = false;
	      return true;
	    },
	    hideClone: function hideClone(_ref4) {
	      var sortable = _ref4.sortable,
	          cloneNowHidden = _ref4.cloneNowHidden;

	      for (var i in multiDragClones) {
	        _css(multiDragClones[i], 'display', 'none');

	        if (sortable.options.removeCloneOnHide && multiDragClones[i].parentNode) {
	          multiDragClones[i].parentNode.removeChild(multiDragClones[i]);
	        }
	      }

	      cloneNowHidden();
	      clonesHidden = true;
	      return true;
	    },
	    delayEnded: function delayEnded(_ref5) {
	      var dragged = _ref5.dragEl;
	      dragEl = dragged;
	    },
	    dragStart: function dragStart(_ref6) {
	      var sortable = _ref6.sortable;

	      if (!~multiDragElements.indexOf(dragEl) && multiDragSortable) {
	        multiDragSortable[expando].multiDrag._deselectMultiDrag();
	      }

	      for (var i in multiDragElements) {
	        multiDragElements[i].sortableIndex = _index(multiDragElements[i]);
	      } // Sort multi-drag elements


	      multiDragElements = multiDragElements.sort(function (a, b) {
	        return a.sortableIndex - b.sortableIndex;
	      });
	      dragStarted = true;
	    },
	    dragStarted: function dragStarted(_ref7) {
	      var sortable = _ref7.sortable;

	      if (sortable.options.sort) {
	        // Capture rects,
	        // hide multi drag elements (by positioning them absolute),
	        // set multi drag elements rects to dragRect,
	        // show multi drag elements,
	        // animate to rects,
	        // unset rects & remove from DOM
	        sortable.captureAnimationState();

	        if (sortable.options.animation) {
	          for (var i in multiDragElements) {
	            if (multiDragElements[i] === dragEl) continue;

	            _css(multiDragElements[i], 'position', 'absolute');
	          }

	          var dragRect = _getRect(dragEl, false, true, true);

	          for (var _i in multiDragElements) {
	            if (multiDragElements[_i] === dragEl) continue;

	            _setRect(multiDragElements[_i], dragRect);
	          }

	          folding = true;
	          initialFolding = true;
	        }
	      }

	      sortable.animateAll(function () {
	        folding = false;
	        initialFolding = false;

	        if (sortable.options.animation) {
	          for (var _i2 in multiDragElements) {
	            _unsetRect(multiDragElements[_i2]);
	          }
	        } // Remove all auxiliary multidrag items from el, if sorting enabled


	        if (sortable.options.sort) {
	          _removeMultiDragElements();
	        }
	      });
	    },
	    dragOver: function dragOver(_ref8) {
	      var target = _ref8.target,
	          completed = _ref8.completed;

	      if (folding && ~multiDragElements.indexOf(target)) {
	        return completed(false);
	      }
	    },
	    revert: function revert(_ref9) {
	      var fromSortable = _ref9.fromSortable,
	          rootEl = _ref9.rootEl,
	          sortable = _ref9.sortable,
	          dragRect = _ref9.dragRect;

	      if (multiDragElements.length > 1) {
	        // Setup unfold animation
	        for (var i in multiDragElements) {
	          sortable.addAnimationState({
	            target: multiDragElements[i],
	            rect: folding ? _getRect(multiDragElements[i]) : dragRect
	          });

	          _unsetRect(multiDragElements[i]);

	          multiDragElements[i].fromRect = dragRect;
	          fromSortable.removeAnimationState(multiDragElements[i]);
	        }

	        folding = false;

	        _insertMultiDragElements(!sortable.options.removeCloneOnHide, rootEl);
	      }
	    },
	    dragOverCompleted: function dragOverCompleted(_ref10) {
	      var sortable = _ref10.sortable,
	          isOwner = _ref10.isOwner,
	          insertion = _ref10.insertion,
	          activeSortable = _ref10.activeSortable,
	          parentEl = _ref10.parentEl,
	          putSortable = _ref10.putSortable;
	      var options = sortable.options;

	      if (insertion) {
	        // Clones must be hidden before folding animation to capture dragRectAbsolute properly
	        if (isOwner) {
	          activeSortable._hideClone();
	        }

	        initialFolding = false; // If leaving sort:false root, or already folding - Fold to new location

	        if (options.animation && multiDragElements.length > 1 && (folding || !isOwner && !activeSortable.options.sort && !putSortable)) {
	          // Fold: Set all multi drag elements's rects to dragEl's rect when multi-drag elements are invisible
	          var dragRectAbsolute = _getRect(dragEl, false, true, true);

	          for (var i in multiDragElements) {
	            if (multiDragElements[i] === dragEl) continue;

	            _setRect(multiDragElements[i], dragRectAbsolute); // Move element(s) to end of parentEl so that it does not interfere with multi-drag clones insertion if they are inserted
	            // while folding, and so that we can capture them again because old sortable will no longer be fromSortable


	            parentEl.appendChild(multiDragElements[i]);
	          }

	          folding = true;
	        } // Clones must be shown (and check to remove multi drags) after folding when interfering multiDragElements are moved out


	        if (!isOwner) {
	          // Only remove if not folding (folding will remove them anyways)
	          if (!folding) {
	            _removeMultiDragElements();
	          }

	          if (multiDragElements.length > 1) {
	            var clonesHiddenBefore = clonesHidden;

	            activeSortable._showClone(sortable); // Unfold animation for clones if showing from hidden


	            if (activeSortable.options.animation && !clonesHidden && clonesHiddenBefore) {
	              for (var _i3 in multiDragClones) {
	                activeSortable.addAnimationState({
	                  target: multiDragClones[_i3],
	                  rect: clonesFromRect
	                });
	                multiDragClones[_i3].fromRect = clonesFromRect;
	                multiDragClones[_i3].thisAnimationDuration = null;
	              }
	            }
	          } else {
	            activeSortable._showClone(sortable);
	          }
	        }
	      }
	    },
	    dragOverAnimationCapture: function dragOverAnimationCapture(_ref11) {
	      var dragRect = _ref11.dragRect,
	          isOwner = _ref11.isOwner,
	          activeSortable = _ref11.activeSortable;

	      for (var i in multiDragElements) {
	        multiDragElements[i].thisAnimationDuration = null;
	      }

	      if (activeSortable.options.animation && !isOwner && activeSortable.options.multiDrag) {
	        clonesFromRect = _extend({}, dragRect);

	        var dragMatrix = _matrix(dragEl, true);

	        clonesFromRect.top -= dragMatrix.f;
	        clonesFromRect.left -= dragMatrix.e;
	      }
	    },
	    dragOverAnimationComplete: function dragOverAnimationComplete() {
	      if (folding) {
	        folding = false;

	        _removeMultiDragElements();
	      }
	    },
	    drop: function drop(_ref12) {
	      var evt = _ref12.originalEvent,
	          rootEl = _ref12.rootEl,
	          parentEl = _ref12.parentEl,
	          sortable = _ref12.sortable,
	          putSortable = _ref12.putSortable;
	      var toSortable = putSortable || this.sortable;
	      if (!evt) return;
	      var el = sortable.el,
	          options = sortable.options,
	          children = parentEl.children; // Multi-drag selection

	      if (!dragStarted && options.multiDrag) {
	        _toggleClass(dragEl, options.selectedClass, !~multiDragElements.indexOf(dragEl));

	        if (!~multiDragElements.indexOf(dragEl)) {
	          multiDragElements.push(dragEl);
	          dispatchEvent({
	            sortable: sortable,
	            rootEl: rootEl,
	            name: 'select',
	            targetEl: dragEl,
	            originalEvt: evt,
	            eventOptions: {
	              items: multiDragElements,
	              clones: multiDragClones
	            }
	          }); // Modifier activated, select from last to dragEl

	          if (evt.shiftKey && lastMultiDragSelect && sortable.el.contains(lastMultiDragSelect)) {
	            var lastIndex = _index(lastMultiDragSelect),
	                currentIndex = _index(dragEl);

	            if (~lastIndex && ~currentIndex && lastIndex !== currentIndex) {
	              // Must include lastMultiDragSelect (select it), in case modified selection from no selection
	              // (but previous selection existed)
	              var n, i;

	              if (currentIndex > lastIndex) {
	                i = lastIndex;
	                n = currentIndex;
	              } else {
	                i = currentIndex;
	                n = lastIndex + 1;
	              }

	              for (; i < n; i++) {
	                if (~multiDragElements.indexOf(children[i])) continue;

	                _toggleClass(children[i], options.selectedClass, true);

	                multiDragElements.push(children[i]);
	                dispatchEvent({
	                  sortable: sortable,
	                  rootEl: rootEl,
	                  name: 'select',
	                  targetEl: children[i],
	                  originalEvt: evt,
	                  eventOptions: {
	                    items: multiDragElements,
	                    clones: multiDragClones
	                  }
	                });
	              }
	            }
	          } else {
	            lastMultiDragSelect = dragEl;
	          }

	          multiDragSortable = parentEl;
	        } else {
	          multiDragElements.splice(multiDragElements.indexOf(dragEl), 1);
	          lastMultiDragSelect = null;
	          dispatchEvent({
	            sortable: sortable,
	            rootEl: rootEl,
	            name: 'deselect',
	            targetEl: dragEl,
	            originalEvt: evt,
	            eventOptions: {
	              items: multiDragElements,
	              clones: multiDragClones
	            }
	          });
	        }
	      } // Multi-drag drop


	      if (dragStarted && options.multiDrag && multiDragElements.length) {
	        // Do not "unfold" after around dragEl if reverted
	        if ((parentEl[expando].options.sort || parentEl !== rootEl) && multiDragElements.length > 1) {
	          var dragRect = _getRect(dragEl),
	              multiDragIndex = _index(dragEl, ':not(.' + Sortable.active.options.selectedClass + ')');

	          if (!initialFolding && options.animation) dragEl.thisAnimationDuration = null;
	          toSortable.captureAnimationState();

	          if (!initialFolding) {
	            if (options.animation) {
	              dragEl.fromRect = dragRect;

	              for (var _i4 in multiDragElements) {
	                multiDragElements[_i4].thisAnimationDuration = null;

	                if (multiDragElements[_i4] !== dragEl) {
	                  var rect = folding ? _getRect(multiDragElements[_i4]) : dragRect;
	                  multiDragElements[_i4].fromRect = rect; // Prepare unfold animation

	                  toSortable.addAnimationState({
	                    target: multiDragElements[_i4],
	                    rect: rect
	                  });
	                }
	              }
	            } // Multi drag elements are not necessarily removed from the DOM on drop, so to reinsert
	            // properly they must all be removed


	            _removeMultiDragElements();

	            for (var _i5 in multiDragElements) {
	              if (children[multiDragIndex]) {
	                parentEl.insertBefore(multiDragElements[_i5], children[multiDragIndex]);
	              } else {
	                parentEl.appendChild(multiDragElements[_i5]);
	              }

	              multiDragIndex++;
	            }
	          } // Must be done after capturing individual rects (scroll bar)


	          for (var _i6 in multiDragElements) {
	            _unsetRect(multiDragElements[_i6]);
	          }

	          toSortable.animateAll();
	        }

	        multiDragSortable = parentEl;
	      } // Remove clones if necessary


	      if (rootEl === parentEl || putSortable && putSortable.lastPutMode !== 'clone') {
	        for (var _i7 in multiDragClones) {
	          multiDragClones[_i7].parentNode && multiDragClones[_i7].parentNode.removeChild(multiDragClones[_i7]);
	        }
	      }

	      multiDragClones.length = 0;
	    },
	    nulling: function nulling() {
	      dragStarted = false;
	      multiDragClones.length = 0;
	    },
	    destroy: function destroy() {
	      this._deselectMultiDrag();
	    },
	    _deselectMultiDrag: function _deselectMultiDrag(evt) {
	      if (dragStarted) return; // Only deselect if selection is in this sortable

	      if (multiDragSortable !== this.sortable.el) return; // Only deselect if target is not item in this sortable

	      if (evt && _closest(evt.target, this.sortable.options.draggable, this.sortable.el, false)) return; // Only deselect if left click

	      if (evt && evt.button !== 0) return;

	      for (var i = 0; i < multiDragElements.length; i++) {
	        _toggleClass(multiDragElements[i], this.sortable.options.selectedClass, false);

	        dispatchEvent({
	          sortable: this.sortable,
	          rootEl: this.sortable.el,
	          name: 'deselect',
	          targetEl: multiDragElements[i],
	          originalEvt: evt,
	          eventOptions: {
	            items: multiDragElements,
	            clones: multiDragClones
	          }
	        });
	      }

	      multiDragElements = [];
	    }
	  };
	  return _extend(MultiDrag, {
	    // Static methods & properties
	    pluginName: 'multiDrag',
	    utils: {
	      /**
	       * Selects the provided multi-drag item
	       * @param  {HTMLElement} el    The element to be selected
	       */
	      select: function select(el) {
	        var sortable = el.parentNode[expando];
	        if (!sortable || !sortable.options.multiDrag || ~multiDragElements.indexOf(el)) return;

	        if (multiDragSortable && multiDragSortable !== el.parentNode) {
	          multiDragSortable[expando].multiDrag._deselectMultiDrag();

	          multiDragSortable = el.parentNode;
	        }

	        _toggleClass(el, sortable.options.selectedClass, true);

	        multiDragElements.push(el);
	      },

	      /**
	       * Deselects the provided multi-drag item
	       * @param  {HTMLElement} el    The element to be deselected
	       */
	      deselect: function deselect(el) {
	        var sortable = el.parentNode[expando],
	            index = multiDragElements.indexOf(el);
	        if (!sortable || !sortable.options.multiDrag || !~index) return;

	        _toggleClass(el, sortable.options.selectedClass, false);

	        multiDragElements.splice(index, 1);
	      }
	    },
	    eventOptions: function eventOptions() {
	      return {
	        items: multiDragElements,
	        clones: multiDragClones
	      };
	    }
	  });
	}

	function _insertMultiDragElements(clonesInserted, rootEl) {
	  for (var i in multiDragElements) {
	    var target = rootEl.children[multiDragElements[i].sortableIndex + (clonesInserted ? Number(i) : 0)];

	    if (target) {
	      rootEl.insertBefore(multiDragElements[i], target);
	    } else {
	      rootEl.appendChild(multiDragElements[i]);
	    }
	  }
	}
	/**
	 * Insert multi-drag clones
	 * @param  {[Boolean]} elementsInserted  Whether the multi-drag elements are inserted
	 */


	function _insertMultiDragClones(elementsInserted, rootEl) {
	  for (var i in multiDragClones) {
	    var target = rootEl.children[multiDragClones[i].sortableIndex + (elementsInserted ? Number(i) : 0)];

	    if (target) {
	      rootEl.insertBefore(multiDragClones[i], target);
	    } else {
	      rootEl.appendChild(multiDragClones[i]);
	    }
	  }
	}

	function _removeMultiDragElements() {
	  for (var i = 0; i < multiDragElements.length; i++) {
	    if (multiDragElements[i] === dragEl) continue;
	    multiDragElements[i].parentNode && multiDragElements[i].parentNode.removeChild(multiDragElements[i]);
	  }
	}

	return MultiDragPlugin;

}));
