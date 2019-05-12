(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = global || self, global.Sortable = factory());
}(this, function () { 'use strict';

  function _typeof(obj) {
    if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
      _typeof = function (obj) {
        return typeof obj;
      };
    } else {
      _typeof = function (obj) {
        return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
      };
    }

    return _typeof(obj);
  }

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

  function _objectWithoutPropertiesLoose(source, excluded) {
    if (source == null) return {};
    var target = {};
    var sourceKeys = Object.keys(source);
    var key, i;

    for (i = 0; i < sourceKeys.length; i++) {
      key = sourceKeys[i];
      if (excluded.indexOf(key) >= 0) continue;
      target[key] = source[key];
    }

    return target;
  }

  function _objectWithoutProperties(source, excluded) {
    if (source == null) return {};

    var target = _objectWithoutPropertiesLoose(source, excluded);

    var key, i;

    if (Object.getOwnPropertySymbols) {
      var sourceSymbolKeys = Object.getOwnPropertySymbols(source);

      for (i = 0; i < sourceSymbolKeys.length; i++) {
        key = sourceSymbolKeys[i];
        if (excluded.indexOf(key) >= 0) continue;
        if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
        target[key] = source[key];
      }
    }

    return target;
  }

  var version = "1.9.0";

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
  function _off(el, event, fn) {
    el.removeEventListener(event, fn, IE11OrLess ? false : captureMode);
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
  function _css$1(el, prop, val) {
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
      var transform = _css$1(el, 'transform');

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
  function _find(ctx, tagName, iterator) {
    if (ctx) {
      var list = ctx.getElementsByTagName(tagName),
          i = 0,
          n = list.length;

      if (iterator) {
        for (; i < n; i++) {
          iterator(list[i], i);
        }
      }

      return list;
    }

    return [];
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

  function _getRect$1(el, relativeToContainingBlock, relativeToNonStaticParent, undoScale, container) {
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
          if (container && container.getBoundingClientRect && (_css$1(container, 'transform') !== 'none' || relativeToNonStaticParent && _css$1(container, 'position') !== 'static')) {
            var containerRect = container.getBoundingClientRect(); // Set relative to edges of padding box of container

            top -= containerRect.top + parseInt(_css$1(container, 'border-top-width'));
            left -= containerRect.left + parseInt(_css$1(container, 'border-left-width'));
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

  function _isScrolledPast(el, rect, elSide, parentSide) {
    var parent = _getParentAutoScrollElement(el, true),
        elSideVal = (rect ? rect : _getRect$1(el))[elSide];
    /* jshint boss:true */


    while (parent) {
      var parentSideVal = _getRect$1(parent)[parentSide],
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

  function _getChild(el, childNum, options, dragEl, ghostEl) {
    var currentChild = 0,
        i = 0,
        children = el.children;

    while (i < children.length) {
      if (children[i].style.display !== 'none' && children[i] !== ghostEl && children[i] !== dragEl && _closest(children[i], options.draggable, el, false)) {
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

  function _lastChild(el, ghostEl) {
    var last = el.lastElementChild;

    while (last && (last === ghostEl || _css$1(last, 'display') === 'none')) {
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
  /**
   * Returns the scroll offset of the given element, added with all the scroll offsets of parent elements.
   * The value is returned in real pixels.
   * @param  {HTMLElement} el
   * @return {Array}             Offsets in the format of [left, top]
   */

  function _getRelativeScrollOffset(el) {
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

  function _indexOfObject(arr, obj) {
    for (var i in arr) {
      for (var key in obj) {
        if (obj[key] === arr[i][key]) return Number(i);
      }
    }

    return -1;
  }
  function _getParentAutoScrollElement(el, includeSelf) {
    // skip to window
    if (!el || !el.getBoundingClientRect) return _getWindowScrollingElement();
    var elem = el;
    var gotSelf = false;

    do {
      // we don't need to get elem css if it isn't even overflowing in the first place (performance)
      if (elem.clientWidth < elem.scrollWidth || elem.clientHeight < elem.scrollHeight) {
        var elemCSS = _css$1(elem);

        if (elem.clientWidth < elem.scrollWidth && (elemCSS.overflowX == 'auto' || elemCSS.overflowX == 'scroll') || elem.clientHeight < elem.scrollHeight && (elemCSS.overflowY == 'auto' || elemCSS.overflowY == 'scroll')) {
          if (!elem || !elem.getBoundingClientRect || elem === document.body) return _getWindowScrollingElement();
          if (gotSelf || includeSelf) return elem;
          gotSelf = true;
        }
      }
      /* jshint boss:true */

    } while (elem = elem.parentNode);

    return _getWindowScrollingElement();
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
  function _isRectEqual(rect1, rect2) {
    return Math.round(rect1.top) === Math.round(rect2.top) && Math.round(rect1.left) === Math.round(rect2.left) && Math.round(rect1.height) === Math.round(rect2.height) && Math.round(rect1.width) === Math.round(rect2.width);
  }

  var _throttleTimeout;

  function _throttle(callback, ms) {
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
  function _cancelThrottle() {
    clearTimeout(_throttleTimeout);
    _throttleTimeout = void 0;
  }
  function _scrollBy(el, x, y) {
    el.scrollLeft += x;
    el.scrollTop += y;
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
    _css$1(el, 'position', 'absolute');

    _css$1(el, 'top', rect.top);

    _css$1(el, 'left', rect.left);

    _css$1(el, 'width', rect.width);

    _css$1(el, 'height', rect.height);
  }
  function _unsetRect(el) {
    _css$1(el, 'position', '');

    _css$1(el, 'top', '');

    _css$1(el, 'left', '');

    _css$1(el, 'width', '');

    _css$1(el, 'height', '');
  }
  var expando$1 = 'Sortable' + new Date().getTime();

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
    sortable = sortable || rootEl[expando$1];
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

  function AnimationStateManager() {
    var animationStates = [],
        animationCallbackId;
    return {
      captureAnimationState: function captureAnimationState() {
        animationStates = [];
        if (!this.options.animation) return;
        var children = [].slice.call(this.el.children);

        for (var i = 0; i < children.length; i++) {
          if (_css$1(children[i], 'display') === 'none') continue;
          animationStates.push({
            target: children[i],
            rect: _getRect$1(children[i])
          });

          var fromRect = _getRect$1(children[i]); // If animating: compensate for current animation


          if (children[i].thisAnimationDuration) {
            var matrix = _matrix(children[i], true);

            fromRect.top -= matrix.f;
            fromRect.left -= matrix.e;
          }

          children[i].fromRect = fromRect;
        }
      },
      addAnimationState: function addAnimationState(state) {
        animationStates.push(state);
      },
      removeAnimationState: function removeAnimationState(target) {
        animationStates.splice(_indexOfObject(animationStates, {
          target: target
        }), 1);
      },
      animateAll: function animateAll(callback) {
        if (!this.options.animation) {
          clearTimeout(animationCallbackId);
          if (typeof callback === 'function') callback();
          return;
        }

        var animating = false,
            animationTime = 0;

        for (var i in animationStates) {
          var time = 0,
              target = animationStates[i].target,
              fromRect = target.fromRect,
              toRect = _getRect$1(target),
              prevFromRect = target.prevFromRect,
              prevToRect = target.prevToRect,
              animatingRect = animationStates[i].rect,
              targetMatrix = _matrix(target, true); // Compensate for current animation


          toRect.top -= targetMatrix.f;
          toRect.left -= targetMatrix.e;
          target.toRect = toRect; // If element is scrolled out of view: Do not animate

          if ((_isScrolledPast(target, toRect, 'bottom', 'top') || _isScrolledPast(target, toRect, 'top', 'bottom') || _isScrolledPast(target, toRect, 'right', 'left') || _isScrolledPast(target, toRect, 'left', 'right')) && (_isScrolledPast(target, animatingRect, 'bottom', 'top') || _isScrolledPast(target, animatingRect, 'top', 'bottom') || _isScrolledPast(target, animatingRect, 'right', 'left') || _isScrolledPast(target, animatingRect, 'left', 'right')) && (_isScrolledPast(target, fromRect, 'bottom', 'top') || _isScrolledPast(target, fromRect, 'top', 'bottom') || _isScrolledPast(target, fromRect, 'right', 'left') || _isScrolledPast(target, fromRect, 'left', 'right'))) continue;

          if (target.thisAnimationDuration) {
            // Could also check if animatingRect is between fromRect and toRect
            if (_isRectEqual(prevFromRect, toRect) && !_isRectEqual(fromRect, toRect) && // Make sure animatingRect is on line between toRect & fromRect
            (animatingRect.top - toRect.top) / (animatingRect.left - toRect.left) === (fromRect.top - toRect.top) / (fromRect.left - toRect.left)) {
              // If returning to same place as started from animation and on same axis
              time = calculateRealTime(animatingRect, prevFromRect, prevToRect, this.options);
            }
          } // if fromRect != toRect and not animating to same position as already animating: animate


          if (!_isRectEqual(toRect, fromRect)) {
            target.prevFromRect = fromRect;
            target.prevToRect = toRect;

            if (!time) {
              time = this.options.animation;
            }

            this.animate(target, animatingRect, time);
          }

          if (time) {
            animating = true;
            animationTime = Math.max(animationTime, time);
            clearTimeout(target.animationResetTimer);
            target.animationResetTimer = setTimeout(function () {
              this.animationStates[this.i].target.animationTime = 0;
              this.animationStates[this.i].target.prevFromRect = null;
              this.animationStates[this.i].target.fromRect = null;
              this.animationStates[this.i].target.prevToRect = null;
              this.animationStates[this.i].target.thisAnimationDuration = null;
            }.bind({
              animationStates: animationStates,
              i: Number(i)
            }), time);
            target.thisAnimationDuration = time;
          }
        }

        clearTimeout(animationCallbackId);

        if (!animating) {
          if (typeof callback === 'function') callback();
        } else {
          animationCallbackId = setTimeout(function () {
            if (typeof callback === 'function') callback();
          }, animationTime);
        }

        animationStates = [];
      },
      animate: function animate(target, prev, duration) {
        if (duration) {
          _css$1(target, 'transition', '');

          _css$1(target, 'transform', '');

          var currentRect = _getRect$1(target),
              matrix = _matrix(this.el),
              scaleX = matrix && matrix.a,
              scaleY = matrix && matrix.d,
              translateX = (prev.left - currentRect.left) / (scaleX || 1),
              translateY = (prev.top - currentRect.top) / (scaleY || 1);

          target.animatingX = !!translateX;
          target.animatingY = !!translateY;

          _css$1(target, 'transform', 'translate3d(' + translateX + 'px,' + translateY + 'px,0)');

          repaint(target); // repaint

          _css$1(target, 'transition', 'transform ' + duration + 'ms' + (this.options.easing ? ' ' + this.options.easing : ''));

          _css$1(target, 'transform', 'translate3d(0,0,0)');

          typeof target.animated === 'number' && clearTimeout(target.animated);
          target.animated = setTimeout(function () {
            _css$1(target, 'transition', '');

            _css$1(target, 'transform', '');

            target.animated = false;
            target.animatingX = false;
            target.animatingY = false;
          }, duration);
        }
      }
    };
  }

  function repaint(target) {
    return target.offsetWidth;
  }

  function calculateRealTime(animatingRect, fromRect, toRect, options) {
    return Math.sqrt(Math.pow(fromRect.top - animatingRect.top, 2) + Math.pow(fromRect.left - animatingRect.left, 2)) / Math.sqrt(Math.pow(fromRect.top - toRect.top, 2) + Math.pow(fromRect.left - toRect.left, 2)) * options.animation;
  }

  var autoScrolls = [],
      lastPointerElemX,
      lastPointerElemY,
      pointerElemChangedInterval;

  var autoScroll = _throttle(function (
  /**Event*/
  evt,
  /**Object*/
  options,
  /**HTMLElement*/
  rootEl,
  /**Boolean*/
  isFallback) {
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
          scrollThisInstance = false; // Detect scrollEl


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
        var el = currentParent,
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

        vx = canScrollX && (Math.abs(right - x) <= sens && scrollPosX + width < scrollWidth) - (Math.abs(left - x) <= sens && !!scrollPosX);
        vy = canScrollY && (Math.abs(bottom - y) <= sens && scrollPosY + height < scrollHeight) - (Math.abs(top - y) <= sens && !!scrollPosY);

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

            autoScrolls[layersOut].pid = setInterval(function () {
              // emulate drag over during autoscroll (fallback), emulating native DnD behaviour
              if (isFallback && this.layer === 0) {
                Sortable.active._emulateDragOver(true);

                Sortable.active._onTouchMove(touchEvt, true);
              }

              var scrollOffsetY = autoScrolls[this.layer].vy ? autoScrolls[this.layer].vy * speed : 0;
              var scrollOffsetX = autoScrolls[this.layer].vx ? autoScrolls[this.layer].vx * speed : 0;

              if ('function' === typeof scrollCustomFn) {
                if (scrollCustomFn.call(_this, scrollOffsetX, scrollOffsetY, evt, touchEvt, autoScrolls[this.layer].el) !== 'continue') {
                  return;
                }
              }

              _scrollBy(autoScrolls[this.layer].el, scrollOffsetX, scrollOffsetY);
            }.bind({
              layer: layersOut
            }), 24);
          }
        }

        layersOut++;
      } while (options.bubbleScroll && currentParent !== winScroller && (currentParent = _getParentAutoScrollElement(currentParent, false)));

      scrolling = scrollThisInstance; // in case another function catches scrolling as false in between when it is not
    }
  }, 30);

  function clearAutoScrolls() {
    autoScrolls.forEach(function (autoScroll) {
      clearInterval(autoScroll.pid);
    });
    autoScrolls = [];
  }
  function clearPointerElemChangedInterval() {
    clearInterval(pointerElemChangedInterval);
  }
  function handleAutoScroll(evt, fallback) {
    if (!this.options.scroll) return;

    var x = evt.clientX,
        y = evt.clientY,
        elem = document.elementFromPoint(x, y),
        _this = this; // IE does not seem to have native autoscroll,
    // Edge's autoscroll seems too conditional,
    // MACOS Safari does not have autoscroll,
    // Firefox and Chrome are good


    if (fallback || Edge || IE11OrLess || Safari) {
      autoScroll(evt, _this.options, elem, fallback); // Listener for pointer element change

      var ogElemScroller = _getParentAutoScrollElement(elem, true);

      if (scrolling && (!pointerElemChangedInterval || x !== lastPointerElemX || y !== lastPointerElemY)) {
        pointerElemChangedInterval && clearPointerElemChangedInterval(); // Detect for pointer elem change, emulating native DnD behaviour

        pointerElemChangedInterval = setInterval(function () {
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

  var pluginEvent = function pluginEvent(eventName, sortable) {
    var _ref = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {},
        originalEvent = _ref.evt,
        data = _objectWithoutProperties(_ref, ["evt"]);

    function cloneNowHidden() {
      cloneHidden = true;
    }

    function cloneNowShown() {
      cloneHidden = false;
    }

    PluginManager.pluginEvent.bind(Sortable$1)(eventName, sortable, _objectSpread({
      dragEl: dragEl,
      parentEl: parentEl,
      ghostEl: ghostEl,
      rootEl: rootEl,
      nextEl: nextEl,
      lastDownEl: lastDownEl,
      cloneEl: cloneEl,
      cloneHidden: cloneHidden,
      dragStarted: moved,
      putSortable: putSortable,
      originalEvent: originalEvent,
      cloneNowHidden: cloneNowHidden,
      cloneNowShown: cloneNowShown,
      dispatchSortableEvent: function dispatchSortableEvent(name) {
        _dispatchEvent({
          sortable: sortable,
          name: name
        });
      }
    }, data));
  };

  function _dispatchEvent(info) {
    dispatchEvent(_objectSpread({
      putSortable: putSortable,
      cloneEl: cloneEl,
      targetEl: dragEl,
      rootEl: rootEl,
      oldIndex: oldIndex,
      oldDraggableIndex: oldDraggableIndex
    }, info));
  }

  if (typeof window === "undefined" || !window.document) {
    throw new Error("Sortable.js requires a window with a document");
  }

  var dragEl,
      parentEl,
      ghostEl,
      rootEl,
      nextEl,
      lastDownEl,
      cloneEl,
      cloneHidden,
      scrollEl,
      scrollParentEl$1,
      oldIndex,
      newIndex,
      oldDraggableIndex,
      newDraggableIndex,
      activeGroup,
      putSortable,
      autoScrolls$1 = [],
      awaitingDragStarted = false,
      ignoreNextClick = false,
      sortables = [],
      pointerElemChangedInterval$1,
      lastPointerElemX$1,
      lastPointerElemY$1,
      tapEvt,
      touchEvt$1,
      moved,
      lastTarget,
      lastDirection,
      pastFirstInvertThresh = false,
      isCircumstantialInvert = false,
      targetMoveDistance,
      // For positioning ghost absolutely
  ghostRelativeParent,
      ghostRelativeParentInitialScroll = [],
      // (left, top)
  _silent = false,
      savedInputChecked = [];
  /** @const */

  var $ = window.jQuery || window.Zepto,
      Polymer = window.Polymer,
      PositionGhostAbsolutely = IOS,
      CSSFloatProperty = Edge || IE11OrLess ? 'cssFloat' : 'float',
      // This will not pass for IE9, because IE9 DnD only works on anchors
  supportDraggable = 'draggable' in document.createElement('div'),
      supportCssPointerEvents = function () {
    // false when <= IE11
    if (IE11OrLess) {
      return false;
    }

    var el = document.createElement('x');
    el.style.cssText = 'pointer-events:auto';
    return el.style.pointerEvents === 'auto';
  }(),
      _detectDirection = function _detectDirection(el, options) {
    var elCSS = _css$1(el),
        elWidth = parseInt(elCSS.width) - parseInt(elCSS.paddingLeft) - parseInt(elCSS.paddingRight) - parseInt(elCSS.borderLeftWidth) - parseInt(elCSS.borderRightWidth),
        child1 = _getChild(el, 0, options),
        child2 = _getChild(el, 1, options),
        firstChildCSS = child1 && _css$1(child1),
        secondChildCSS = child2 && _css$1(child2),
        firstChildWidth = firstChildCSS && parseInt(firstChildCSS.marginLeft) + parseInt(firstChildCSS.marginRight) + _getRect$1(child1).width,
        secondChildWidth = secondChildCSS && parseInt(secondChildCSS.marginLeft) + parseInt(secondChildCSS.marginRight) + _getRect$1(child2).width;

    if (elCSS.display === 'flex') {
      return elCSS.flexDirection === 'column' || elCSS.flexDirection === 'column-reverse' ? 'vertical' : 'horizontal';
    }

    if (elCSS.display === 'grid') {
      return elCSS.gridTemplateColumns.split(' ').length <= 1 ? 'vertical' : 'horizontal';
    }

    if (child1 && firstChildCSS["float"] !== 'none') {
      var touchingSideChild2 = firstChildCSS["float"] === 'left' ? 'left' : 'right';
      return child2 && (secondChildCSS.clear === 'both' || secondChildCSS.clear === touchingSideChild2) ? 'vertical' : 'horizontal';
    }

    return child1 && (firstChildCSS.display === 'block' || firstChildCSS.display === 'flex' || firstChildCSS.display === 'table' || firstChildCSS.display === 'grid' || firstChildWidth >= elWidth && elCSS[CSSFloatProperty] === 'none' || child2 && elCSS[CSSFloatProperty] === 'none' && firstChildWidth + secondChildWidth > elWidth) ? 'vertical' : 'horizontal';
  },

  /**
   * Detects first nearest empty sortable to X and Y position using emptyInsertThreshold.
   * @param  {Number} x      X position
   * @param  {Number} y      Y position
   * @return {HTMLElement}   Element of the first found nearest Sortable
   */
  _detectNearestEmptySortable = function _detectNearestEmptySortable(x, y) {
    for (var i = 0; i < sortables.length; i++) {
      if (_lastChild(sortables[i])) continue;

      var rect = _getRect$1(sortables[i]),
          threshold = sortables[i][expando$1].options.emptyInsertThreshold,
          insideHorizontally = x >= rect.left - threshold && x <= rect.right + threshold,
          insideVertically = y >= rect.top - threshold && y <= rect.bottom + threshold;

      if (threshold && insideHorizontally && insideVertically) {
        return sortables[i];
      }
    }
  },
      _prepareGroup = function _prepareGroup(options) {
    function toFn(value, pull) {
      return function (to, from, dragEl, evt) {
        var sameGroup = to.options.group.name && from.options.group.name && to.options.group.name === from.options.group.name;

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
          var otherGroup = (pull ? to : from).options.group.name;
          return value === true || typeof value === 'string' && value === otherGroup || value.join && value.indexOf(otherGroup) > -1;
        }
      };
    }

    var group = {};
    var originalGroup = options.group;

    if (!originalGroup || _typeof(originalGroup) != 'object') {
      originalGroup = {
        name: originalGroup
      };
    }

    group.name = originalGroup.name;
    group.checkPull = toFn(originalGroup.pull, true);
    group.checkPut = toFn(originalGroup.put);
    group.revertClone = originalGroup.revertClone;
    options.group = group;
  },
      _hideGhostForTarget = function _hideGhostForTarget() {
    if (!supportCssPointerEvents && ghostEl) {
      _css$1(ghostEl, 'display', 'none');
    }
  },
      _unhideGhostForTarget = function _unhideGhostForTarget() {
    if (!supportCssPointerEvents && ghostEl) {
      _css$1(ghostEl, 'display', '');
    }
  }; // #1184 fix - Prevent click event on fallback if dragged but item not changed position


  document.addEventListener('click', function (evt) {
    if (ignoreNextClick) {
      evt.preventDefault();
      evt.stopPropagation && evt.stopPropagation();
      evt.stopImmediatePropagation && evt.stopImmediatePropagation();
      ignoreNextClick = false;
      return false;
    }
  }, true);

  var nearestEmptyInsertDetectEvent = function nearestEmptyInsertDetectEvent(evt) {
    if (dragEl) {
      evt = evt.touches ? evt.touches[0] : evt;

      var nearest = _detectNearestEmptySortable(evt.clientX, evt.clientY);

      if (nearest) {
        // Create imitation event
        var event = {};

        for (var i in evt) {
          event[i] = evt[i];
        }

        event.target = event.rootEl = nearest;
        event.preventDefault = void 0;
        event.stopPropagation = void 0;

        nearest[expando$1]._onDragOver(event);
      }
    }
  };

  var _checkOutsideTargetEl = function _checkOutsideTargetEl(evt) {
    if (dragEl) {
      dragEl.parentNode[expando$1]._isOutsideThisEl(evt.target);
    }
  };
  /**
   * @class  Sortable
   * @param  {HTMLElement}  el
   * @param  {Object}       [options]
   */


  function Sortable$1(el, options) {
    if (!(el && el.nodeType && el.nodeType === 1)) {
      throw 'Sortable: `el` must be HTMLElement, not ' + {}.toString.call(el);
    }

    this.el = el; // root element

    this.options = options = _extend({}, options); // Export instance

    el[expando$1] = this;
    var defaults = {
      group: null,
      sort: true,
      disabled: false,
      store: null,
      handle: null,
      scroll: true,
      scrollSensitivity: 30,
      scrollSpeed: 10,
      bubbleScroll: true,
      draggable: /[uo]l/i.test(el.nodeName) ? '>li' : '>*',
      swapThreshold: 1,
      // percentage; 0 <= x <= 1
      invertSwap: false,
      // invert always
      invertedSwapThreshold: null,
      // will be set to same as swapThreshold if default
      removeCloneOnHide: true,
      direction: function direction() {
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
      setData: function setData(dataTransfer, dragEl) {
        dataTransfer.setData('Text', dragEl.textContent);
      },
      dropBubble: false,
      dragoverBubble: false,
      dataIdAttr: 'data-id',
      delay: 0,
      delayOnTouchOnly: false,
      touchStartThreshold: parseInt(window.devicePixelRatio, 10) || 1,
      forceFallback: false,
      fallbackClass: 'sortable-fallback',
      fallbackOnBody: false,
      fallbackTolerance: 0,
      fallbackOffset: {
        x: 0,
        y: 0
      },
      supportPointer: Sortable$1.supportPointer !== false && 'PointerEvent' in window,
      emptyInsertThreshold: 5
    };
    var initializedPlugins = PluginManager.initializePlugins(this, el);

    for (var pluginName in initializedPlugins) {
      initializedPlugins[pluginName].sortable = this;
      this[pluginName] = initializedPlugins[pluginName]; // Add default options from plugin

      _extend(defaults, initializedPlugins[pluginName].options);
    } // Set default options


    this.options = _extend(defaults, options); // Add plugins

    _extend(this, initializedPlugins);

    _prepareGroup(options); // Bind all private methods


    for (var fn in this) {
      if (fn.charAt(0) === '_' && typeof this[fn] === 'function') {
        this[fn] = this[fn].bind(this);
      }
    } // Setup drag mode


    this.nativeDraggable = options.forceFallback ? false : supportDraggable;

    if (this.nativeDraggable) {
      // Touch start threshold cannot be greater than the native dragstart threshold
      this.options.touchStartThreshold = 1;
    } // Bind events


    if (options.supportPointer) {
      _on(el, 'pointerdown', this._onTapStart);
    } else {
      _on(el, 'mousedown', this._onTapStart);

      _on(el, 'touchstart', this._onTapStart);
    }

    if (this.nativeDraggable) {
      _on(el, 'dragover', this);

      _on(el, 'dragenter', this);
    }

    sortables.push(this.el); // Restore sorting

    options.store && options.store.get && this.sort(options.store.get(this) || []); // Add animation state manager

    _extend(this, AnimationStateManager());
  }

  Sortable$1.prototype =
  /** @lends Sortable.prototype */
  {
    constructor: Sortable$1,
    _isOutsideThisEl: function _isOutsideThisEl(target) {
      if (!this.el.contains(target) && target !== this.el) {
        lastTarget = null;
      }
    },
    _getDirection: function _getDirection(evt, target) {
      return typeof this.options.direction === 'function' ? this.options.direction.call(this, evt, target, dragEl) : this.options.direction;
    },
    _onTapStart: function _onTapStart(
    /** Event|TouchEvent */
    evt) {
      if (!evt.cancelable) return;

      var _this = this,
          el = this.el,
          options = this.options,
          preventOnFilter = options.preventOnFilter,
          type = evt.type,
          touch = evt.touches && evt.touches[0],
          target = (touch || evt).target,
          originalTarget = evt.target.shadowRoot && (evt.path && evt.path[0] || evt.composedPath && evt.composedPath()[0]) || target,
          filter = options.filter;

      _saveInputCheckedState(el); // Don't trigger start event when an element is been dragged, otherwise the evt.oldindex always wrong when set option.group.


      if (dragEl) {
        return;
      }

      if (/mousedown|pointerdown/.test(type) && evt.button !== 0 || options.disabled) {
        return; // only left button and enabled
      } // cancel dnd if original target is content editable


      if (originalTarget.isContentEditable) {
        return;
      }

      target = _closest(target, options.draggable, el, false);

      if (target && target.animated) {
        return;
      }

      if (lastDownEl === target) {
        // Ignoring duplicate `down`
        return;
      } // Get the index of the dragged element within its parent


      oldIndex = _index(target);
      oldDraggableIndex = _index(target, options.draggable); // Check filter

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

          preventOnFilter && evt.cancelable && evt.preventDefault();
          return; // cancel dnd
        }
      } else if (filter) {
        filter = filter.split(',').some(function (criteria) {
          criteria = _closest(originalTarget, criteria.trim(), el, false);

          if (criteria) {
            _dispatchEvent({
              sortable: _this,
              rootEl: criteria,
              name: 'filter',
              targetEl: target,
              fromEl: el,
              toEl: el
            });

            return true;
          }
        });

        if (filter) {
          preventOnFilter && evt.cancelable && evt.preventDefault();
          return; // cancel dnd
        }
      }

      if (options.handle && !_closest(originalTarget, options.handle, el, false)) {
        return;
      } // Prepare `dragstart`


      this._prepareDragStart(evt, touch, target);
    },
    _prepareDragStart: function _prepareDragStart(
    /** Event */
    evt,
    /** Touch */
    touch,
    /** HTMLElement */
    target) {
      var _this = this,
          el = _this.el,
          options = _this.options,
          ownerDocument = el.ownerDocument,
          dragStartFn;

      if (target && !dragEl && target.parentNode === el) {
        rootEl = el;
        dragEl = target;
        parentEl = dragEl.parentNode;
        nextEl = dragEl.nextSibling;
        lastDownEl = target;
        activeGroup = options.group;
        tapEvt = {
          target: dragEl,
          clientX: (touch || evt).clientX,
          clientY: (touch || evt).clientY
        };
        this._lastX = (touch || evt).clientX;
        this._lastY = (touch || evt).clientY;
        dragEl.style['will-change'] = 'all';

        dragStartFn = function dragStartFn() {
          pluginEvent('delayEnded', _this, {
            evt: evt
          });

          if (Sortable$1.eventCanceled) {
            _this._onDrop();

            return;
          } // Delayed drag has been triggered
          // we can re-enable the events: touchmove/mousemove


          _this._disableDelayedDragEvents();

          if (!FireFox && _this.nativeDraggable) {
            dragEl.draggable = true;
          } // Bind the events: dragstart/dragend


          _this._triggerDragStart(evt, touch); // Drag start event


          _dispatchEvent({
            sortable: _this,
            name: 'choose',
            originalEvt: evt
          }); // Chosen item


          _toggleClass(dragEl, options.chosenClass, true);
        }; // Disable "draggable"


        options.ignore.split(',').forEach(function (criteria) {
          _find(dragEl, criteria.trim(), _disableDraggable);
        });

        _on(ownerDocument, 'dragover', nearestEmptyInsertDetectEvent);

        _on(ownerDocument, 'mousemove', nearestEmptyInsertDetectEvent);

        _on(ownerDocument, 'touchmove', nearestEmptyInsertDetectEvent);

        _on(ownerDocument, 'mouseup', _this._onDrop);

        _on(ownerDocument, 'touchend', _this._onDrop);

        _on(ownerDocument, 'touchcancel', _this._onDrop); // Make dragEl draggable (must be before delay for FireFox)


        if (FireFox && this.nativeDraggable) {
          this.options.touchStartThreshold = 4;
          dragEl.draggable = true;
        } // Delay is impossible for native DnD in Edge or IE


        if (options.delay && (options.delayOnTouchOnly ? touch : true) && (!this.nativeDraggable || !(Edge || IE11OrLess))) {
          pluginEvent('delayStart', this, {
            evt: evt
          });

          if (Sortable$1.eventCanceled) {
            this._onDrop();

            return;
          } // If the user moves the pointer or let go the click or touch
          // before the delay has been reached:
          // disable the delayed drag


          _on(ownerDocument, 'mouseup', _this._disableDelayedDrag);

          _on(ownerDocument, 'touchend', _this._disableDelayedDrag);

          _on(ownerDocument, 'touchcancel', _this._disableDelayedDrag);

          _on(ownerDocument, 'mousemove', _this._delayedDragTouchMoveHandler);

          _on(ownerDocument, 'touchmove', _this._delayedDragTouchMoveHandler);

          options.supportPointer && _on(ownerDocument, 'pointermove', _this._delayedDragTouchMoveHandler);
          _this._dragStartTimer = setTimeout(dragStartFn, options.delay);
        } else {
          dragStartFn();
        }
      }
    },
    _delayedDragTouchMoveHandler: function _delayedDragTouchMoveHandler(
    /** TouchEvent|PointerEvent **/
    e) {
      var touch = e.touches ? e.touches[0] : e;

      if (Math.max(Math.abs(touch.clientX - this._lastX), Math.abs(touch.clientY - this._lastY)) >= Math.floor(this.options.touchStartThreshold / (this.nativeDraggable && window.devicePixelRatio || 1))) {
        this._disableDelayedDrag();
      }
    },
    _disableDelayedDrag: function _disableDelayedDrag() {
      dragEl && _disableDraggable(dragEl);
      clearTimeout(this._dragStartTimer);

      this._disableDelayedDragEvents();
    },
    _disableDelayedDragEvents: function _disableDelayedDragEvents() {
      var ownerDocument = this.el.ownerDocument;

      _off(ownerDocument, 'mouseup', this._disableDelayedDrag);

      _off(ownerDocument, 'touchend', this._disableDelayedDrag);

      _off(ownerDocument, 'touchcancel', this._disableDelayedDrag);

      _off(ownerDocument, 'mousemove', this._delayedDragTouchMoveHandler);

      _off(ownerDocument, 'touchmove', this._delayedDragTouchMoveHandler);

      _off(ownerDocument, 'pointermove', this._delayedDragTouchMoveHandler);
    },
    _triggerDragStart: function _triggerDragStart(
    /** Event */
    evt,
    /** Touch */
    touch) {
      touch = touch || (evt.pointerType == 'touch' ? evt : null);

      if (!this.nativeDraggable || touch) {
        if (this.options.supportPointer) {
          _on(document, 'pointermove', this._onTouchMove);
        } else if (touch) {
          _on(document, 'touchmove', this._onTouchMove);
        } else {
          _on(document, 'mousemove', this._onTouchMove);
        }
      } else {
        _on(dragEl, 'dragend', this);

        _on(rootEl, 'dragstart', this._onDragStart);
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
      } catch (err) {}
    },
    _dragStarted: function _dragStarted(fallback, evt) {

      awaitingDragStarted = false;

      if (rootEl && dragEl) {
        pluginEvent('dragStarted', this, {
          evt: evt
        });

        if (this.nativeDraggable) {
          _on(document, 'dragover', this._handleAutoScroll);

          _on(document, 'dragover', _checkOutsideTargetEl);
        }

        var options = this.options; // Apply effect

        !fallback && _toggleClass(dragEl, options.dragClass, false);

        _toggleClass(dragEl, options.ghostClass, true);

        Sortable$1.active = this;
        fallback && this._appendGhost(); // Drag start event

        _dispatchEvent({
          sortable: this,
          name: 'start',
          originalEvt: evt
        });
      } else {
        this._nulling();
      }
    },
    _emulateDragOver: function _emulateDragOver(forAutoScroll) {
      if (touchEvt$1) {
        if (this._lastX === touchEvt$1.clientX && this._lastY === touchEvt$1.clientY && !forAutoScroll) {
          return;
        }

        this._lastX = touchEvt$1.clientX;
        this._lastY = touchEvt$1.clientY;

        _hideGhostForTarget();

        var target = document.elementFromPoint(touchEvt$1.clientX, touchEvt$1.clientY);
        var parent = target;

        while (target && target.shadowRoot) {
          target = target.shadowRoot.elementFromPoint(touchEvt$1.clientX, touchEvt$1.clientY);
          if (target === parent) break;
          parent = target;
        }

        dragEl.parentNode[expando$1]._isOutsideThisEl(target);

        if (parent) {
          do {
            if (parent[expando$1]) {
              var inserted = void 0;
              inserted = parent[expando$1]._onDragOver({
                clientX: touchEvt$1.clientX,
                clientY: touchEvt$1.clientY,
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
    _onTouchMove: function _onTouchMove(
    /**TouchEvent*/
    evt, forAutoScroll) {
      if (tapEvt) {
        var options = this.options,
            fallbackTolerance = options.fallbackTolerance,
            fallbackOffset = options.fallbackOffset,
            touch = evt.touches ? evt.touches[0] : evt,
            matrix = ghostEl && _matrix(ghostEl),
            scaleX = ghostEl && matrix && matrix.a,
            scaleY = ghostEl && matrix && matrix.d,
            relativeScrollOffset = PositionGhostAbsolutely && ghostRelativeParent && _getRelativeScrollOffset(ghostRelativeParent),
            dx = (touch.clientX - tapEvt.clientX + fallbackOffset.x) / (scaleX || 1) + (relativeScrollOffset ? relativeScrollOffset[0] - ghostRelativeParentInitialScroll[0] : 0) / (scaleX || 1),
            dy = (touch.clientY - tapEvt.clientY + fallbackOffset.y) / (scaleY || 1) + (relativeScrollOffset ? relativeScrollOffset[1] - ghostRelativeParentInitialScroll[1] : 0) / (scaleY || 1),
            translate3d = evt.touches ? 'translate3d(' + dx + 'px,' + dy + 'px,0)' : 'translate(' + dx + 'px,' + dy + 'px)'; // only set the status to dragging, when we are actually dragging


        if (!Sortable$1.active && !awaitingDragStarted) {
          if (fallbackTolerance && Math.min(Math.abs(touch.clientX - this._lastX), Math.abs(touch.clientY - this._lastY)) < fallbackTolerance) {
            return;
          }

          this._onDragStart(evt, true);
        }

        !forAutoScroll && this._handleAutoScroll(touch, true);
        touchEvt$1 = touch;

        _css$1(ghostEl, 'webkitTransform', translate3d);

        _css$1(ghostEl, 'mozTransform', translate3d);

        _css$1(ghostEl, 'msTransform', translate3d);

        _css$1(ghostEl, 'transform', translate3d);

        evt.cancelable && evt.preventDefault();
      }
    },
    _appendGhost: function _appendGhost() {
      // Bug if using scale(): https://stackoverflow.com/questions/2637058
      // Not being adjusted for
      if (!ghostEl) {
        var container = this.options.fallbackOnBody ? document.body : rootEl,
            rect = _getRect$1(dragEl, true, PositionGhostAbsolutely, true, container),
            css = _css$1(dragEl),
            options = this.options; // Position absolutely


        if (PositionGhostAbsolutely) {
          // Get relatively positioned parent
          ghostRelativeParent = container;

          while (_css$1(ghostRelativeParent, 'position') === 'static' && _css$1(ghostRelativeParent, 'transform') === 'none' && ghostRelativeParent !== document) {
            ghostRelativeParent = ghostRelativeParent.parentNode;
          }

          if (ghostRelativeParent !== document.body && ghostRelativeParent !== document.documentElement) {
            if (ghostRelativeParent === document) ghostRelativeParent = _getWindowScrollingElement();
            rect.top += ghostRelativeParent.scrollTop;
            rect.left += ghostRelativeParent.scrollLeft;
          } else {
            ghostRelativeParent = _getWindowScrollingElement();
          }

          ghostRelativeParentInitialScroll = _getRelativeScrollOffset(ghostRelativeParent);
        }

        ghostEl = dragEl.cloneNode(true);

        _toggleClass(ghostEl, options.ghostClass, false);

        _toggleClass(ghostEl, options.fallbackClass, true);

        _toggleClass(ghostEl, options.dragClass, true);

        _css$1(ghostEl, 'transition', '');

        _css$1(ghostEl, 'transform', '');

        _css$1(ghostEl, 'box-sizing', 'border-box');

        _css$1(ghostEl, 'margin', 0);

        _css$1(ghostEl, 'top', rect.top);

        _css$1(ghostEl, 'left', rect.left);

        _css$1(ghostEl, 'width', rect.width);

        _css$1(ghostEl, 'height', rect.height);

        _css$1(ghostEl, 'opacity', '0.8');

        _css$1(ghostEl, 'position', PositionGhostAbsolutely ? 'absolute' : 'fixed');

        _css$1(ghostEl, 'zIndex', '100000');

        _css$1(ghostEl, 'pointerEvents', 'none');

        container.appendChild(ghostEl);
      }
    },
    _onDragStart: function _onDragStart(
    /**Event*/
    evt,
    /**boolean*/
    fallback) {
      var _this = this;

      var dataTransfer = evt.dataTransfer;
      var options = _this.options;
      pluginEvent('dragStart', this, {
        evt: evt
      });

      if (Sortable$1.eventCanceled) {
        this._onDrop();

        return;
      }

      pluginEvent('setupClone', this);

      if (!Sortable$1.eventCanceled) {
        cloneEl = _clone(dragEl);
        cloneEl.draggable = false;
        cloneEl.style['will-change'] = '';

        this._hideClone();

        _toggleClass(cloneEl, this.options.chosenClass, false);
      } // #1143: IFrame support workaround


      _this._cloneId = _nextTick(function () {
        pluginEvent('clone', _this);
        if (Sortable$1.eventCanceled) return;

        if (!_this.options.removeCloneOnHide) {
          rootEl.insertBefore(cloneEl, dragEl);
        }

        _this._hideClone();

        _dispatchEvent({
          sortable: _this,
          name: 'clone'
        });
      });
      !fallback && _toggleClass(dragEl, options.dragClass, true); // Set proper drop events

      if (fallback) {
        ignoreNextClick = true;
        _this._loopId = setInterval(_this._emulateDragOver, 50);
      } else {
        // Undo what was set in _prepareDragStart before drag started
        _off(document, 'mouseup', _this._onDrop);

        _off(document, 'touchend', _this._onDrop);

        _off(document, 'touchcancel', _this._onDrop);

        if (dataTransfer) {
          dataTransfer.effectAllowed = 'move';
          options.setData && options.setData.call(_this, dataTransfer, dragEl);
        }

        _on(document, 'drop', _this); // #1276 fix:


        _css$1(dragEl, 'transform', 'translateZ(0)');
      }

      awaitingDragStarted = true;
      _this._dragStartId = _nextTick(_this._dragStarted.bind(_this, fallback, evt));

      _on(document, 'selectstart', _this);

      moved = true;

      if (Safari) {
        _css$1(document.body, 'user-select', 'none');
      }
    },
    // Returns true - if no further action is needed (either inserted or another condition)
    _onDragOver: function _onDragOver(
    /**Event*/
    evt) {
      var el = this.el,
          target = evt.target,
          dragRect,
          targetRect,
          revert,
          options = this.options,
          group = options.group,
          activeSortable = Sortable$1.active,
          isOwner = activeGroup === group,
          canSort = options.sort,
          fromSortable = putSortable || activeSortable,
          axis,
          _this = this,
          completedFired = false;

      if (_silent) return;

      function dragOverEvent(name, extra) {
        pluginEvent(name, _this, _objectSpread({
          evt: evt,
          isOwner: isOwner,
          axis: axis,
          revert: revert,
          dragRect: dragRect,
          targetRect: targetRect,
          canSort: canSort,
          fromSortable: fromSortable,
          activeSortable: activeSortable,
          target: target,
          completed: completed,
          onMove: function onMove(target, after) {
            _onMove(rootEl, el, dragEl, dragRect, target, _getRect$1(target), evt, after);
          },
          changed: changed
        }, extra));
      } // Capture animation state


      function capture() {
        dragOverEvent('dragOverAnimationCapture');

        _this.captureAnimationState();

        if (_this !== fromSortable) {
          fromSortable.captureAnimationState();
        }
      } // Return invocation when dragEl is inserted (or completed)


      function completed(insertion) {
        dragOverEvent('dragOverCompleted', {
          insertion: insertion
        });

        if (insertion) {
          // Clones must be hidden before folding animation to capture dragRectAbsolute properly
          if (isOwner) {
            activeSortable._hideClone();
          } else {
            activeSortable._showClone(_this);
          }

          if (activeSortable) {
            // Set ghost class to new sortable's ghost class
            _toggleClass(dragEl, putSortable ? putSortable.options.ghostClass : activeSortable.options.ghostClass, false);

            _toggleClass(dragEl, options.ghostClass, true);
          }

          if (putSortable !== _this && _this !== Sortable$1.active) {
            putSortable = _this;
          } else if (_this === Sortable$1.active && putSortable) {
            putSortable = null;
          } // Animation
          // if (!options.swap) {


          _this._ignoreWhileAnimating = target;

          _this.animateAll(function () {
            dragOverEvent('dragOverAnimationComplete');
            _this._ignoreWhileAnimating = null;
          });

          if (_this !== fromSortable) {
            fromSortable.animateAll();
          } // }

        } // Null lastTarget if it is not inside a previously swapped element


        if (target === dragEl && !dragEl.animated || target === el && !target.animated) {
          lastTarget = null;
        } // no bubbling and not fallback


        if (!options.dragoverBubble && !evt.rootEl && target !== document) {
          _this._handleAutoScroll(evt);

          dragEl.parentNode[expando$1]._isOutsideThisEl(evt.target); // Do not detect for empty insert if already inserted


          !insertion && nearestEmptyInsertDetectEvent(evt);
        }

        !options.dragoverBubble && evt.stopPropagation && evt.stopPropagation();
        return completedFired = true;
      } // Call when dragEl has been inserted


      function changed() {
        _dispatchEvent({
          sortable: _this,
          name: 'change',
          toEl: el,
          newIndex: _index(dragEl),
          newDraggableIndex: _index(dragEl, options.draggable),
          originalEvt: evt
        });
      }

      if (evt.preventDefault !== void 0) {
        evt.cancelable && evt.preventDefault();
      }

      target = _closest(target, options.draggable, el, true);
      dragOverEvent('dragOver');
      if (Sortable$1.eventCanceled) return completedFired;

      if (dragEl.contains(evt.target) || target.animated && target.animatingX && target.animatingY || _this._ignoreWhileAnimating === target) {
        return completed(false);
      }

      if (target !== dragEl) {
        ignoreNextClick = false;
      }

      if (activeSortable && !options.disabled && (isOwner ? canSort || (revert = !rootEl.contains(dragEl)) // Reverting item into the original list
      : putSortable === this || (this.lastPutMode = activeGroup.checkPull(this, activeSortable, dragEl, evt)) && group.checkPut(this, activeSortable, dragEl, evt))) {
        axis = this._getDirection(evt, target);
        dragRect = _getRect$1(dragEl);
        dragOverEvent('dragOverValid');
        if (Sortable$1.eventCanceled) return completedFired;

        if (revert) {
          parentEl = rootEl; // actualization

          capture();

          this._hideClone();

          dragOverEvent('revert');

          if (!Sortable$1.eventCanceled) {
            if (nextEl) {
              rootEl.insertBefore(dragEl, nextEl);
            } else {
              rootEl.appendChild(dragEl);
            }
          }

          return completed(true);
        }

        var elLastChild = _lastChild(el);

        if (!elLastChild || _ghostIsLast(evt, axis, el) && !elLastChild.animated) {
          // assign target only if condition is true
          if (elLastChild && el === evt.target) {
            target = elLastChild;
          }

          if (target) {
            targetRect = _getRect$1(target);
          }

          if (_onMove(rootEl, el, dragEl, dragRect, target, targetRect, evt, !!target) !== false) {
            capture();
            el.appendChild(dragEl);
            parentEl = el; // actualization

            changed();
            return completed(true);
          }
        } else if (target && target !== dragEl && target.parentNode === el) {
          var direction = 0,
              targetBeforeFirstSwap,
              differentLevel = dragEl.parentNode !== el,
              side1 = axis === 'vertical' ? 'top' : 'left',
              scrolledPastTop = _isScrolledPast(target, null, 'top', 'top') || _isScrolledPast(dragEl, null, 'top', 'top'),
              scrollBefore = scrolledPastTop ? scrolledPastTop.scrollTop : void 0;

          if (lastTarget !== target) {
            targetBeforeFirstSwap = _getRect$1(target)[side1];
            pastFirstInvertThresh = false;
            isCircumstantialInvert = options.invertSwap || differentLevel;
          }

          direction = _getSwapDirection(evt, target, axis, options.swapThreshold, options.invertedSwapThreshold == null ? options.swapThreshold : options.invertedSwapThreshold, isCircumstantialInvert, lastTarget === target);
          var sibling;

          if (direction !== 0) {
            // Check if target is beside dragEl in respective direction (ignoring hidden elements)
            var index = _index(dragEl);

            do {
              index -= direction;
              sibling = parentEl.children[index];
            } while (sibling && (_css$1(sibling, 'display') === 'none' || sibling === ghostEl));
          } // If dragEl is already beside target: Do not insert


          if (direction === 0 || sibling === target) {
            return completed(false);
          }

          lastTarget = target;
          lastDirection = direction;
          targetRect = _getRect$1(target);
          var nextSibling = target.nextElementSibling,
              after = false;
          after = direction === 1;

          var moveVector = _onMove(rootEl, el, dragEl, dragRect, target, targetRect, evt, after);

          if (moveVector !== false) {
            if (moveVector === 1 || moveVector === -1) {
              after = moveVector === 1;
            }

            _silent = true;
            setTimeout(_unsilent, 30);
            capture();

            if (after && !nextSibling) {
              el.appendChild(dragEl);
            } else {
              target.parentNode.insertBefore(dragEl, after ? nextSibling : target);
            } // Undo chrome's scroll adjustment (has no effect on other browsers)


            if (scrolledPastTop) {
              _scrollBy(scrolledPastTop, 0, scrollBefore - scrolledPastTop.scrollTop);
            }

            parentEl = dragEl.parentNode; // actualization
            // must be done before animation

            if (targetBeforeFirstSwap !== undefined && !isCircumstantialInvert) {
              targetMoveDistance = Math.abs(targetBeforeFirstSwap - _getRect$1(target)[side1]);
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
    _offMoveEvents: function _offMoveEvents() {
      _off(document, 'touchmove', this._onTouchMove);

      _off(document, 'pointermove', this._onTouchMove);

      _off(document, 'dragover', nearestEmptyInsertDetectEvent);

      _off(document, 'mousemove', nearestEmptyInsertDetectEvent);

      _off(document, 'touchmove', nearestEmptyInsertDetectEvent);
    },
    _offUpEvents: function _offUpEvents() {
      var ownerDocument = this.el.ownerDocument;

      _off(ownerDocument, 'mouseup', this._onDrop);

      _off(ownerDocument, 'touchend', this._onDrop);

      _off(ownerDocument, 'pointerup', this._onDrop);

      _off(ownerDocument, 'touchcancel', this._onDrop);

      _off(document, 'selectstart', this);
    },
    _onDrop: function _onDrop(
    /**Event*/
    evt) {
      var el = this.el,
          options = this.options;
      pluginEvent('drop', this, {
        evt: evt
      });

      if (Sortable$1.eventCanceled) {
        this._nulling();

        return;
      }

      awaitingDragStarted = false;
      isCircumstantialInvert = false;
      pastFirstInvertThresh = false;
      clearInterval(this._loopId);
      clearPointerElemChangedInterval();
      clearAutoScrolls();

      _cancelThrottle();

      clearTimeout(this._dragStartTimer);

      _cancelNextTick(this._cloneId);

      _cancelNextTick(this._dragStartId); // Unbind events


      _off(document, 'mousemove', this._onTouchMove);

      if (this.nativeDraggable) {
        _off(document, 'drop', this);

        _off(el, 'dragstart', this._onDragStart);

        _off(document, 'dragover', this._handleAutoScroll);
      }

      if (Safari) {
        _css$1(document.body, 'user-select', '');
      }

      this._offMoveEvents();

      this._offUpEvents();

      if (evt) {
        if (moved) {
          evt.cancelable && evt.preventDefault();
          !options.dropBubble && evt.stopPropagation();
        }

        ghostEl && ghostEl.parentNode && ghostEl.parentNode.removeChild(ghostEl);

        if (rootEl === parentEl || putSortable && putSortable.lastPutMode !== 'clone') {
          // Remove clone(s)
          cloneEl && cloneEl.parentNode && cloneEl.parentNode.removeChild(cloneEl);
        }

        if (dragEl) {
          if (this.nativeDraggable) {
            _off(dragEl, 'dragend', this);
          }

          _disableDraggable(dragEl);

          dragEl.style['will-change'] = ''; // Remove classes
          // ghostClass is added in dragStarted

          if (moved && !awaitingDragStarted) {
            _toggleClass(dragEl, putSortable ? putSortable.options.ghostClass : this.options.ghostClass, false);
          }

          _toggleClass(dragEl, this.options.chosenClass, false); // Drag stop event


          _dispatchEvent({
            sortable: this,
            name: 'unchoose',
            toEl: parentEl,
            originalEvt: evt
          });

          if (rootEl !== parentEl) {
            newIndex = _index(dragEl);
            newDraggableIndex = _index(dragEl, options.draggable);

            if (newIndex >= 0) {
              // Add event
              _dispatchEvent({
                rootEl: parentEl,
                name: 'add',
                toEl: parentEl,
                fromEl: rootEl,
                newIndex: newIndex,
                newDraggableIndex: newDraggableIndex,
                originalEvt: evt
              }); // Remove event


              _dispatchEvent({
                sortable: this,
                name: 'remove',
                toEl: parentEl,
                newIndex: newIndex,
                newDraggableIndex: newDraggableIndex,
                originalEvt: evt
              }); // drag from one list and drop into another


              _dispatchEvent({
                rootEl: parentEl,
                name: 'sort',
                toEl: parentEl,
                fromEl: rootEl,
                newIndex: newIndex,
                newDraggableIndex: newDraggableIndex,
                originalEvt: evt
              });

              _dispatchEvent({
                sortable: this,
                name: 'sort',
                toEl: parentEl,
                newIndex: newIndex,
                newDraggableIndex: newDraggableIndex,
                originalEvt: evt
              });
            }

            putSortable && putSortable.save();
          } else {
            if (dragEl.nextSibling !== nextEl) {
              // Get the index of the dragged element within its parent
              newIndex = _index(dragEl);
              newDraggableIndex = _index(dragEl, options.draggable);

              if (newIndex >= 0) {
                // drag & drop within the same list
                _dispatchEvent({
                  sortable: this,
                  name: 'update',
                  toEl: parentEl,
                  newIndex: newIndex,
                  newDraggableIndex: newDraggableIndex,
                  originalEvt: evt
                });

                _dispatchEvent({
                  sortable: this,
                  name: 'sort',
                  toEl: parentEl,
                  newIndex: newIndex,
                  newDraggableIndex: newDraggableIndex,
                  originalEvt: evt
                });
              }
            }
          }

          if (Sortable$1.active) {
            /* jshint eqnull:true */
            if (newIndex == null || newIndex === -1) {
              newIndex = oldIndex;
              newDraggableIndex = oldDraggableIndex;
            }

            _dispatchEvent({
              sortable: this,
              name: 'end',
              toEl: parentEl,
              newIndex: newIndex,
              newDraggableIndex: newDraggableIndex,
              originalEvt: evt
            }); // Save sorting


            this.save();
          }
        }
      }

      this._nulling();
    },
    _nulling: function _nulling() {
      pluginEvent('nulling', this);
      rootEl = dragEl = parentEl = ghostEl = nextEl = cloneEl = lastDownEl = cloneHidden = scrollEl = scrollParentEl$1 = autoScrolls$1.length = pointerElemChangedInterval$1 = lastPointerElemX$1 = lastPointerElemY$1 = tapEvt = touchEvt$1 = moved = newIndex = oldIndex = lastTarget = lastDirection = putSortable = activeGroup = Sortable$1.active = null;
      savedInputChecked.forEach(function (el) {
        el.checked = true;
      });
      savedInputChecked.length = 0;
    },
    handleEvent: function handleEvent(
    /**Event*/
    evt) {
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
    toArray: function toArray() {
      var order = [],
          el,
          children = this.el.children,
          i = 0,
          n = children.length,
          options = this.options;

      for (; i < n; i++) {
        el = children[i];

        if (_closest(el, options.draggable, this.el, false)) {
          order.push(el.getAttribute(options.dataIdAttr) || _generateId(el));
        }
      }

      return order;
    },

    /**
     * Sorts the elements according to the array.
     * @param  {String[]}  order  order of the items
     */
    sort: function sort(order) {
      var items = {},
          rootEl = this.el;
      this.toArray().forEach(function (id, i) {
        var el = rootEl.children[i];

        if (_closest(el, this.options.draggable, rootEl, false)) {
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
    save: function save() {
      var store = this.options.store;
      store && store.set && store.set(this);
    },

    /**
     * For each element in the set, get the first element that matches the selector by testing the element itself and traversing up through its ancestors in the DOM tree.
     * @param   {HTMLElement}  el
     * @param   {String}       [selector]  default: `options.draggable`
     * @returns {HTMLElement|null}
     */
    closest: function closest(el, selector) {
      return _closest(el, selector || this.options.draggable, this.el, false);
    },

    /**
     * Set/get option
     * @param   {string} name
     * @param   {*}      [value]
     * @returns {*}
     */
    option: function option(name, value) {
      var options = this.options;

      if (value === void 0) {
        return options[name];
      } else {
        options[name] = value;

        if (name === 'group') {
          _prepareGroup(options);
        }
      }
    },

    /**
     * Destroy
     */
    destroy: function destroy() {
      pluginEvent('destroy', this);
      var el = this.el;
      el[expando$1] = null;

      _off(el, 'mousedown', this._onTapStart);

      _off(el, 'touchstart', this._onTapStart);

      _off(el, 'pointerdown', this._onTapStart);

      if (this.nativeDraggable) {
        _off(el, 'dragover', this);

        _off(el, 'dragenter', this);
      } // Remove draggable attributes


      Array.prototype.forEach.call(el.querySelectorAll('[draggable]'), function (el) {
        el.removeAttribute('draggable');
      });

      this._onDrop();

      sortables.splice(sortables.indexOf(this.el), 1);
      this.el = el = null;
    },
    _hideClone: function _hideClone() {
      if (!cloneHidden) {
        pluginEvent('hideClone', this);
        if (Sortable$1.eventCanceled) return;

        _css$1(cloneEl, 'display', 'none');

        if (this.options.removeCloneOnHide && cloneEl.parentNode) {
          cloneEl.parentNode.removeChild(cloneEl);
        }

        cloneHidden = true;
      }
    },
    _showClone: function _showClone(putSortable) {
      if (putSortable.lastPutMode !== 'clone') {
        this._hideClone();

        return;
      }

      if (cloneHidden) {
        pluginEvent('showClone', this);
        if (Sortable$1.eventCanceled) return; // show clone at dragEl or original position

        if (rootEl.contains(dragEl) && !this.options.group.revertClone) {
          rootEl.insertBefore(cloneEl, dragEl);
        } else if (nextEl) {
          rootEl.insertBefore(cloneEl, nextEl);
        } else {
          rootEl.appendChild(cloneEl);
        }

        if (this.options.group.revertClone) {
          this._animate(dragEl, cloneEl);
        }

        _css$1(cloneEl, 'display', '');

        cloneHidden = false;
      }
    }
  }; // Add autoscroll function

  Sortable$1.prototype._handleAutoScroll = handleAutoScroll;

  function _globalDragOver(
  /**Event*/
  evt) {
    if (evt.dataTransfer) {
      evt.dataTransfer.dropEffect = 'move';
    }

    evt.cancelable && evt.preventDefault();
  }

  function _onMove(fromEl, toEl, dragEl, dragRect, targetEl, targetRect, originalEvt, willInsertAfter) {
    var evt,
        sortable = fromEl[expando$1],
        onMoveFn = sortable.options.onMove,
        retVal; // Support for new CustomEvent feature

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
    evt.relatedRect = targetRect || _getRect$1(toEl);
    evt.willInsertAfter = willInsertAfter;
    evt.originalEvent = originalEvt;
    fromEl.dispatchEvent(evt);

    if (onMoveFn) {
      retVal = onMoveFn.call(sortable, evt, originalEvt);
    }

    return retVal;
  }

  function _disableDraggable(el) {
    el.draggable = false;
  }

  function _unsilent() {
    _silent = false;
  }

  function _ghostIsLast(evt, axis, el) {
    var elRect = _getRect$1(_lastChild(el)),
        mouseOnAxis = axis === 'vertical' ? evt.clientY : evt.clientX,
        mouseOnOppAxis = axis === 'vertical' ? evt.clientX : evt.clientY,
        targetS2 = axis === 'vertical' ? elRect.bottom : elRect.right,
        targetS1Opp = axis === 'vertical' ? elRect.left : elRect.top,
        targetS2Opp = axis === 'vertical' ? elRect.right : elRect.bottom,
        spacer = 10;

    return axis === 'vertical' ? mouseOnOppAxis > targetS2Opp + spacer || mouseOnOppAxis <= targetS2Opp && mouseOnAxis > targetS2 && mouseOnOppAxis >= targetS1Opp : mouseOnAxis > targetS2 && mouseOnOppAxis > targetS1Opp || mouseOnAxis <= targetS2 && mouseOnOppAxis > targetS2Opp + spacer;
  }

  function _getSwapDirection(evt, target, axis, swapThreshold, invertedSwapThreshold, invertSwap, isLastTarget) {
    var targetRect = _getRect$1(target),
        mouseOnAxis = axis === 'vertical' ? evt.clientY : evt.clientX,
        targetLength = axis === 'vertical' ? targetRect.height : targetRect.width,
        targetS1 = axis === 'vertical' ? targetRect.top : targetRect.left,
        targetS2 = axis === 'vertical' ? targetRect.bottom : targetRect.right,
        dragRect = _getRect$1(dragEl),
        invert = false;

    if (!invertSwap) {
      // Never invert or create dragEl shadow when target movemenet causes mouse to move past the end of regular swapThreshold
      if (isLastTarget && targetMoveDistance < targetLength * swapThreshold) {
        // multiplied only by swapThreshold because mouse will already be inside target by (1 - threshold) * targetLength / 2
        // check if past first invert threshold on side opposite of lastDirection
        if (!pastFirstInvertThresh && (lastDirection === 1 ? mouseOnAxis > targetS1 + targetLength * invertedSwapThreshold / 2 : mouseOnAxis < targetS2 - targetLength * invertedSwapThreshold / 2)) {
          // past first invert threshold, do not restrict inverted threshold to dragEl shadow
          pastFirstInvertThresh = true;
        }

        if (!pastFirstInvertThresh) {
          var dragS1 = axis === 'vertical' ? dragRect.top : dragRect.left,
              dragS2 = axis === 'vertical' ? dragRect.bottom : dragRect.right; // dragEl shadow (target move distance shadow)

          if (lastDirection === 1 ? mouseOnAxis < targetS1 + targetMoveDistance // over dragEl shadow
          : mouseOnAxis > targetS2 - targetMoveDistance) {
            return lastDirection * -1;
          }
        } else {
          invert = true;
        }
      } else {
        // Regular
        if (mouseOnAxis > targetS1 + targetLength * (1 - swapThreshold) / 2 && mouseOnAxis < targetS2 - targetLength * (1 - swapThreshold) / 2) {
          return _getInsertDirection(target);
        }
      }
    }

    invert = invert || invertSwap;

    if (invert) {
      // Invert of regular
      if (mouseOnAxis < targetS1 + targetLength * invertedSwapThreshold / 2 || mouseOnAxis > targetS2 - targetLength * invertedSwapThreshold / 2) {
        return mouseOnAxis > targetS1 + targetLength / 2 ? 1 : -1;
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
    var dragElIndex = _index(dragEl),
        targetIndex = _index(target);

    if (dragElIndex < targetIndex) {
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
    var str = el.tagName + el.className + el.src + el.href + el.textContent,
        i = str.length,
        sum = 0;

    while (i--) {
      sum += str.charCodeAt(i);
    }

    return sum.toString(36);
  }

  function _saveInputCheckedState(root) {
    savedInputChecked.length = 0;
    var inputs = root.getElementsByTagName('input');
    var idx = inputs.length;

    while (idx--) {
      var el = inputs[idx];
      el.checked && savedInputChecked.push(el);
    }
  }

  function _nextTick(fn) {
    return setTimeout(fn, 0);
  }

  function _cancelNextTick(id) {
    return clearTimeout(id);
  } // Fixed #973:


  _on(document, 'touchmove', function (evt) {
    if ((Sortable$1.active || awaitingDragStarted) && evt.cancelable) {
      evt.preventDefault();
    }
  }); // Export utils


  Sortable$1.utils = {
    on: _on,
    off: _off,
    css: _css$1,
    find: _find,
    is: function is(el, selector) {
      return !!_closest(el, selector, el, false);
    },
    extend: _extend,
    throttle: _throttle,
    closest: _closest,
    toggleClass: _toggleClass,
    clone: _clone,
    index: _index,
    nextTick: _nextTick,
    cancelNextTick: _cancelNextTick,
    detectDirection: _detectDirection,
    getChild: _getChild
  };
  /**
   * Mount a plugin to Sortable
   * @param  {SortablePlugin} plugin
   */

  Sortable$1.mount = function (plugin) {
    if (plugin.utils) Sortable$1.utils = _objectSpread({}, Sortable$1.utils, plugin.utils);
    PluginManager.mount(plugin);
  };
  /**
   * Create sortable instance
   * @param {HTMLElement}  el
   * @param {Object}      [options]
   */


  Sortable$1.create = function (el, options) {
    return new Sortable$1(el, options);
  }; // Export


  Sortable$1.version = version;

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
      dragEl$1,
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

            multiDragElements[i] === dragEl$1 && _toggleClass(multiDragClones[i], sortable.options.chosenClass, false);
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
          _css$1(multiDragClones[i], 'display', '');
        }

        cloneNowShown();
        clonesHidden = false;
        return true;
      },
      hideClone: function hideClone(_ref4) {
        var sortable = _ref4.sortable,
            cloneNowHidden = _ref4.cloneNowHidden;

        for (var i in multiDragClones) {
          _css$1(multiDragClones[i], 'display', 'none');

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
        dragEl$1 = dragged;
      },
      dragStart: function dragStart(_ref6) {
        var sortable = _ref6.sortable;

        if (!~multiDragElements.indexOf(dragEl$1) && multiDragSortable) {
          multiDragSortable[expando$1].multiDrag._deselectMultiDrag();
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
              if (multiDragElements[i] === dragEl$1) continue;

              _css$1(multiDragElements[i], 'position', 'absolute');
            }

            var dragRect = _getRect$1(dragEl$1, false, true, true);

            for (var _i in multiDragElements) {
              if (multiDragElements[_i] === dragEl$1) continue;

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
              rect: folding ? _getRect$1(multiDragElements[i]) : dragRect
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
            var dragRectAbsolute = _getRect$1(dragEl$1, false, true, true);

            for (var i in multiDragElements) {
              if (multiDragElements[i] === dragEl$1) continue;

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

          var dragMatrix = _matrix(dragEl$1, true);

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
          _toggleClass(dragEl$1, options.selectedClass, !~multiDragElements.indexOf(dragEl$1));

          if (!~multiDragElements.indexOf(dragEl$1)) {
            multiDragElements.push(dragEl$1);
            dispatchEvent({
              sortable: sortable,
              rootEl: rootEl,
              name: 'select',
              targetEl: dragEl$1,
              originalEvt: evt,
              eventOptions: {
                items: multiDragElements,
                clones: multiDragClones
              }
            }); // Modifier activated, select from last to dragEl

            if (evt.shiftKey && lastMultiDragSelect && sortable.el.contains(lastMultiDragSelect)) {
              var lastIndex = _index(lastMultiDragSelect),
                  currentIndex = _index(dragEl$1);

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
              lastMultiDragSelect = dragEl$1;
            }

            multiDragSortable = parentEl;
          } else {
            multiDragElements.splice(multiDragElements.indexOf(dragEl$1), 1);
            lastMultiDragSelect = null;
            dispatchEvent({
              sortable: sortable,
              rootEl: rootEl,
              name: 'deselect',
              targetEl: dragEl$1,
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
          if ((parentEl[expando$1].options.sort || parentEl !== rootEl) && multiDragElements.length > 1) {
            var dragRect = _getRect$1(dragEl$1),
                multiDragIndex = _index(dragEl$1, ':not(.' + Sortable.active.options.selectedClass + ')');

            if (!initialFolding && options.animation) dragEl$1.thisAnimationDuration = null;
            toSortable.captureAnimationState();

            if (!initialFolding) {
              if (options.animation) {
                dragEl$1.fromRect = dragRect;

                for (var _i4 in multiDragElements) {
                  multiDragElements[_i4].thisAnimationDuration = null;

                  if (multiDragElements[_i4] !== dragEl$1) {
                    var rect = folding ? _getRect$1(multiDragElements[_i4]) : dragRect;
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
          var sortable = el.parentNode[expando$1];
          if (!sortable || !sortable.options.multiDrag || ~multiDragElements.indexOf(el)) return;

          if (multiDragSortable && multiDragSortable !== el.parentNode) {
            multiDragSortable[expando$1].multiDrag._deselectMultiDrag();

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
          var sortable = el.parentNode[expando$1],
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
      if (multiDragElements[i] === dragEl$1) continue;
      multiDragElements[i].parentNode && multiDragElements[i].parentNode.removeChild(multiDragElements[i]);
    }
  }

  Sortable$1.mount(new SwapPlugin());
  Sortable$1.mount(new MultiDragPlugin());

  return Sortable$1;

}));
