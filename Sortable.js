(function () {
// ASSET: entry-defaults.js
var $oPI2$exports = {};
// ASSET: ../package.json
var $EHrm$exports = {};
$EHrm$exports = {
  "name": "sortablejs",
  "exportName": "Sortable",
  "version": "1.10.2",
  "dependencies": {},
  "devDependencies": {
    "@babel/core": "^7.11.1",
    "@babel/plugin-transform-object-assign": "^7.10.4",
    "@babel/preset-env": "^7.11.0",
    "@types/node": "^14.0.27",
    "@types/parcel-bundler": "^1.12.1",
    "cypress": "^4.12.1",
    "fp-ts": "^2.8.1",
    "logging-ts": "^0.3.3",
    "parcel-bundler": "^1.12.4",
    "testcafe": "^1.9.0",
    "testcafe-browser-provider-saucelabs": "^1.8.0",
    "testcafe-reporter-xunit": "^2.1.0",
    "ts-node": "^8.10.2",
    "typescript": "^3.9.7"
  },
  "description": "JavaScript library for reorderable drag-and-drop lists on modern browsers and touch devices. No jQuery required. Supports Meteor, AngularJS, React, Polymer, Vue, Knockout and any CSS library, e.g. Bootstrap.",
  "scripts": {
    "build": "ts-node scripts/parcel.ts",
    "test:compat": "ts-node ./scripts/test-compat.ts",
    "test": "ts-node ./scripts/test.ts"
  },
  "main": "Sortable.js",
  "module": "modular/sortable.esm.js",
  "browser": "Sortable.min.js",
  "browserslist": ["> 0.2%", "not dead", "IE 11"],
  "maintainers": ["Konstantin Lebedev <ibnRubaXa@gmail.com>", "Owen Mills <owen23355@gmail.com>", "Wayne Van Son <waynevanson@gmail.com>"],
  "repository": {
    "type": "git",
    "url": "git://github.com/SortableJS/Sortable.git"
  },
  "files": ["Sortable.js", "Sortable.min.js", "modular/"],
  "keywords": ["sortable", "reorder", "drag", "meteor", "angular", "ng-sortable", "react", "vue", "mixin"],
  "license": "MIT"
};

function $jXvt$var$userAgent(pattern) {
  if (typeof window !== 'undefined' && window.navigator) {
    return !! /*@__PURE__*/navigator.userAgent.match(pattern);
  }
}

var $jXvt$export$IE11OrLess = $jXvt$var$userAgent(/(?:Trident.*rv[ :]?11\.|msie|iemobile|Windows Phone)/i);
var $jXvt$export$Edge = $jXvt$var$userAgent(/Edge/i);
var $jXvt$export$FireFox = $jXvt$var$userAgent(/firefox/i);
var $jXvt$export$Safari = $jXvt$var$userAgent(/safari/i) && !$jXvt$var$userAgent(/chrome/i) && !$jXvt$var$userAgent(/android/i);
var $jXvt$export$IOS = $jXvt$var$userAgent(/iP(ad|od|hone)/i);
var $jXvt$export$ChromeForAndroid = $jXvt$var$userAgent(/chrome/i) && $jXvt$var$userAgent(/android/i);
var $O3AG$var$captureMode = {
  capture: false,
  passive: false
};

function $O3AG$export$on(el, event, fn) {
  el.addEventListener(event, fn, !$jXvt$export$IE11OrLess && $O3AG$var$captureMode);
}

function $O3AG$export$off(el, event, fn) {
  el.removeEventListener(event, fn, !$jXvt$export$IE11OrLess && $O3AG$var$captureMode);
}

function $O3AG$export$matches(
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

function $O3AG$export$getParentOrHost(el) {
  return el.host && el !== document && el.host.nodeType ? el.host : el.parentNode;
}

function $O3AG$export$closest(
/**HTMLElement*/
el,
/**String*/
selector,
/**HTMLElement*/
ctx, includeCTX) {
  if (el) {
    ctx = ctx || document;

    do {
      if (selector != null && (selector[0] === '>' ? el.parentNode === ctx && $O3AG$export$matches(el, selector) : $O3AG$export$matches(el, selector)) || includeCTX && el === ctx) {
        return el;
      }

      if (el === ctx) break;
      /* jshint boss:true */
    } while (el = $O3AG$export$getParentOrHost(el));
  }

  return null;
}

var $O3AG$var$R_SPACE = /\s+/g;

function $O3AG$export$toggleClass(el, name, state) {
  if (el && name) {
    if (el.classList) {
      el.classList[state ? 'add' : 'remove'](name);
    } else {
      var className = (' ' + el.className + ' ').replace($O3AG$var$R_SPACE, ' ').replace(' ' + name + ' ', ' ');
      el.className = (className + (state ? ' ' + name : '')).replace($O3AG$var$R_SPACE, ' ');
    }
  }
}

function $O3AG$export$css(el, prop, val) {
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

function $O3AG$export$matrix(el, selfOnly) {
  var appliedTransforms = '';

  if (typeof el === 'string') {
    appliedTransforms = el;
  } else {
    do {
      var transform = $O3AG$export$css(el, 'transform');

      if (transform && transform !== 'none') {
        appliedTransforms = transform + ' ' + appliedTransforms;
      }
      /* jshint boss:true */

    } while (!selfOnly && (el = el.parentNode));
  }

  var matrixFn = window.DOMMatrix || window.WebKitCSSMatrix || window.CSSMatrix || window.MSCSSMatrix;
  /*jshint -W056 */

  return matrixFn && new matrixFn(appliedTransforms);
}

function $O3AG$export$find(ctx, tagName, iterator) {
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

function $O3AG$export$getWindowScrollingElement() {
  var scrollingElement = document.scrollingElement;

  if (scrollingElement) {
    return scrollingElement;
  } else {
    return document.documentElement;
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


function $O3AG$export$getRect(el, relativeToContainingBlock, relativeToNonStaticParent, undoScale, container) {
  if (!el.getBoundingClientRect && el !== window) return;
  var elRect, top, left, bottom, right, height, width;

  if (el !== window && el !== $O3AG$export$getWindowScrollingElement()) {
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

    if (!$jXvt$export$IE11OrLess) {
      do {
        if (container && container.getBoundingClientRect && ($O3AG$export$css(container, 'transform') !== 'none' || relativeToNonStaticParent && $O3AG$export$css(container, 'position') !== 'static')) {
          var containerRect = container.getBoundingClientRect(); // Set relative to edges of padding box of container

          top -= containerRect.top + parseInt($O3AG$export$css(container, 'border-top-width'));
          left -= containerRect.left + parseInt($O3AG$export$css(container, 'border-left-width'));
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
    var elMatrix = $O3AG$export$matrix(container || el),
        scaleX = elMatrix && elMatrix.a,
        scaleY = elMatrix && elMatrix.d;

    if (elMatrix) {
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
 * @param  {String}       elSide       Side of the element in question ('top', 'left', 'right', 'bottom')
 * @param  {String}       parentSide   Side of the parent in question ('top', 'left', 'right', 'bottom')
 * @return {HTMLElement}               The parent scroll element that the el's side is scrolled past, or null if there is no such element
 */


function $O3AG$export$isScrolledPast(el, elSide, parentSide) {
  var parent = $O3AG$export$getParentAutoScrollElement(el, true),
      elSideVal = $O3AG$export$getRect(el)[elSide];
  /* jshint boss:true */

  while (parent) {
    var parentSideVal = $O3AG$export$getRect(parent)[parentSide],
        visible = void 0;

    if (parentSide === 'top' || parentSide === 'left') {
      visible = elSideVal >= parentSideVal;
    } else {
      visible = elSideVal <= parentSideVal;
    }

    if (!visible) return parent;
    if (parent === $O3AG$export$getWindowScrollingElement()) break;
    parent = $O3AG$export$getParentAutoScrollElement(parent, false);
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


function $O3AG$export$getChild(el, childNum, options) {
  var currentChild = 0,
      i = 0,
      children = el.children;

  while (i < children.length) {
    if (children[i].style.display !== 'none' && children[i] !== $pYnI$export$default.ghost && children[i] !== $pYnI$export$default.dragged && $O3AG$export$closest(children[i], options.draggable, el, false)) {
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
 * @param  {selector} selector    Any other elements that should be ignored
 * @return {HTMLElement}          The last child, ignoring ghostEl
 */


function $O3AG$export$lastChild(el, selector) {
  var last = el.lastElementChild;

  while (last && (last === $pYnI$export$default.ghost || $O3AG$export$css(last, 'display') === 'none' || selector && !$O3AG$export$matches(last, selector))) {
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


function $O3AG$export$index(el, selector) {
  var index = 0;

  if (!el || !el.parentNode) {
    return -1;
  }
  /* jshint boss:true */


  while (el = el.previousElementSibling) {
    if (el.nodeName.toUpperCase() !== 'TEMPLATE' && el !== $pYnI$export$default.clone && (!selector || $O3AG$export$matches(el, selector))) {
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


function $O3AG$export$getRelativeScrollOffset(el) {
  var offsetLeft = 0,
      offsetTop = 0,
      winScroller = $O3AG$export$getWindowScrollingElement();

  if (el) {
    do {
      var elMatrix = $O3AG$export$matrix(el),
          scaleX = elMatrix.a,
          scaleY = elMatrix.d;
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


function $O3AG$export$indexOfObject(arr, obj) {
  for (var i in arr) {
    if (!arr.hasOwnProperty(i)) continue;

    for (var key in obj) {
      if (obj.hasOwnProperty(key) && obj[key] === arr[i][key]) return Number(i);
    }
  }

  return -1;
}

function $O3AG$export$getParentAutoScrollElement(el, includeSelf) {
  // skip to window
  if (!el || !el.getBoundingClientRect) return $O3AG$export$getWindowScrollingElement();
  var elem = el;
  var gotSelf = false;

  do {
    // we don't need to get elem css if it isn't even overflowing in the first place (performance)
    if (elem.clientWidth < elem.scrollWidth || elem.clientHeight < elem.scrollHeight) {
      var elemCSS = $O3AG$export$css(elem);

      if (elem.clientWidth < elem.scrollWidth && (elemCSS.overflowX == 'auto' || elemCSS.overflowX == 'scroll') || elem.clientHeight < elem.scrollHeight && (elemCSS.overflowY == 'auto' || elemCSS.overflowY == 'scroll')) {
        if (!elem.getBoundingClientRect || elem === document.body) return $O3AG$export$getWindowScrollingElement();
        if (gotSelf || includeSelf) return elem;
        gotSelf = true;
      }
    }
    /* jshint boss:true */

  } while (elem = elem.parentNode);

  return $O3AG$export$getWindowScrollingElement();
}

function $O3AG$export$extend(dst, src) {
  if (dst && src) {
    for (var key in src) {
      if (src.hasOwnProperty(key)) {
        dst[key] = src[key];
      }
    }
  }

  return dst;
}

function $O3AG$export$isRectEqual(rect1, rect2) {
  return Math.round(rect1.top) === Math.round(rect2.top) && Math.round(rect1.left) === Math.round(rect2.left) && Math.round(rect1.height) === Math.round(rect2.height) && Math.round(rect1.width) === Math.round(rect2.width);
}

var $O3AG$var$_throttleTimeout;

function $O3AG$export$throttle(callback, ms) {
  return function () {
    if (!$O3AG$var$_throttleTimeout) {
      var args = arguments,
          _this = this;

      if (args.length === 1) {
        callback.call(_this, args[0]);
      } else {
        callback.apply(_this, args);
      }

      $O3AG$var$_throttleTimeout = setTimeout(function () {
        $O3AG$var$_throttleTimeout = void 0;
      }, ms);
    }
  };
}

function $O3AG$export$cancelThrottle() {
  clearTimeout($O3AG$var$_throttleTimeout);
  $O3AG$var$_throttleTimeout = void 0;
}

function $O3AG$export$scrollBy(el, x, y) {
  el.scrollLeft += x;
  el.scrollTop += y;
}

function $O3AG$export$clone(el) {
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

function $O3AG$export$setRect(el, rect) {
  $O3AG$export$css(el, 'position', 'absolute');
  $O3AG$export$css(el, 'top', rect.top);
  $O3AG$export$css(el, 'left', rect.left);
  $O3AG$export$css(el, 'width', rect.width);
  $O3AG$export$css(el, 'height', rect.height);
}

function $O3AG$export$unsetRect(el) {
  $O3AG$export$css(el, 'position', '');
  $O3AG$export$css(el, 'top', '');
  $O3AG$export$css(el, 'left', '');
  $O3AG$export$css(el, 'width', '');
  $O3AG$export$css(el, 'height', '');
}

var $O3AG$export$expando = 'Sortable' + new Date().getTime();

function $V7Ia$var$ownKeys(object, enumerableOnly) {
  var keys = Object.keys(object);

  if (Object.getOwnPropertySymbols) {
    var symbols = Object.getOwnPropertySymbols(object);
    if (enumerableOnly) symbols = symbols.filter(function (sym) {
      return Object.getOwnPropertyDescriptor(object, sym).enumerable;
    });
    keys.push.apply(keys, symbols);
  }

  return keys;
}

function $V7Ia$var$_objectSpread(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};

    if (i % 2) {
      $V7Ia$var$ownKeys(Object(source), true).forEach(function (key) {
        $V7Ia$var$_defineProperty(target, key, source[key]);
      });
    } else if (Object.getOwnPropertyDescriptors) {
      Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
    } else {
      $V7Ia$var$ownKeys(Object(source)).forEach(function (key) {
        Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
      });
    }
  }

  return target;
}

function $V7Ia$var$_defineProperty(obj, key, value) {
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

function $V7Ia$export$default() {
  var animationStates = [],
      animationCallbackId;
  return {
    captureAnimationState: function captureAnimationState() {
      animationStates = [];
      if (!this.options.animation) return;
      var children = [].slice.call(this.el.children);
      children.forEach(function (child) {
        if ($O3AG$export$css(child, 'display') === 'none' || child === $pYnI$export$default.ghost) return;
        animationStates.push({
          target: child,
          rect: $O3AG$export$getRect(child)
        });
        var fromRect = $V7Ia$var$_objectSpread({}, animationStates[animationStates.length - 1].rect); // If animating: compensate for current animation

        if (child.thisAnimationDuration) {
          var childMatrix = $O3AG$export$matrix(child, true);

          if (childMatrix) {
            fromRect.top -= childMatrix.f;
            fromRect.left -= childMatrix.e;
          }
        }

        child.fromRect = fromRect;
      });
    },
    addAnimationState: function addAnimationState(state) {
      animationStates.push(state);
    },
    removeAnimationState: function removeAnimationState(target) {
      animationStates.splice($O3AG$export$indexOfObject(animationStates, {
        target: target
      }), 1);
    },
    animateAll: function animateAll(callback) {
      var _this = this;

      if (!this.options.animation) {
        clearTimeout(animationCallbackId);
        if (typeof callback === 'function') callback();
        return;
      }

      var animating = false,
          animationTime = 0;
      animationStates.forEach(function (state) {
        var time = 0,
            animatingThis = false,
            target = state.target,
            fromRect = target.fromRect,
            toRect = $O3AG$export$getRect(target),
            prevFromRect = target.prevFromRect,
            prevToRect = target.prevToRect,
            animatingRect = state.rect,
            targetMatrix = $O3AG$export$matrix(target, true);

        if (targetMatrix) {
          // Compensate for current animation
          toRect.top -= targetMatrix.f;
          toRect.left -= targetMatrix.e;
        }

        target.toRect = toRect;

        if (target.thisAnimationDuration) {
          // Could also check if animatingRect is between fromRect and toRect
          if ($O3AG$export$isRectEqual(prevFromRect, toRect) && !$O3AG$export$isRectEqual(fromRect, toRect) && // Make sure animatingRect is on line between toRect & fromRect
          (animatingRect.top - toRect.top) / (animatingRect.left - toRect.left) === (fromRect.top - toRect.top) / (fromRect.left - toRect.left)) {
            // If returning to same place as started from animation and on same axis
            time = $V7Ia$var$calculateRealTime(animatingRect, prevFromRect, prevToRect, _this.options);
          }
        } // if fromRect != toRect: animate


        if (!$O3AG$export$isRectEqual(toRect, fromRect)) {
          target.prevFromRect = fromRect;
          target.prevToRect = toRect;

          if (!time) {
            time = _this.options.animation;
          }

          _this.animate(target, animatingRect, toRect, time);
        }

        if (time) {
          animating = true;
          animationTime = Math.max(animationTime, time);
          clearTimeout(target.animationResetTimer);
          target.animationResetTimer = setTimeout(function () {
            target.animationTime = 0;
            target.prevFromRect = null;
            target.fromRect = null;
            target.prevToRect = null;
            target.thisAnimationDuration = null;
          }, time);
          target.thisAnimationDuration = time;
        }
      });
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
    animate: function animate(target, currentRect, toRect, duration) {
      if (duration) {
        $O3AG$export$css(target, 'transition', '');
        $O3AG$export$css(target, 'transform', '');
        var elMatrix = $O3AG$export$matrix(this.el),
            scaleX = elMatrix && elMatrix.a,
            scaleY = elMatrix && elMatrix.d,
            translateX = (currentRect.left - toRect.left) / (scaleX || 1),
            translateY = (currentRect.top - toRect.top) / (scaleY || 1);
        target.animatingX = !!translateX;
        target.animatingY = !!translateY;
        $O3AG$export$css(target, 'transform', 'translate3d(' + translateX + 'px,' + translateY + 'px,0)');
        this.forRepaintDummy = $V7Ia$var$repaint(target); // repaint

        $O3AG$export$css(target, 'transition', 'transform ' + duration + 'ms' + (this.options.easing ? ' ' + this.options.easing : ''));
        $O3AG$export$css(target, 'transform', 'translate3d(0,0,0)');
        typeof target.animated === 'number' && clearTimeout(target.animated);
        target.animated = setTimeout(function () {
          $O3AG$export$css(target, 'transition', '');
          $O3AG$export$css(target, 'transform', '');
          target.animated = false;
          target.animatingX = false;
          target.animatingY = false;
        }, duration);
      }
    }
  };
}

function $V7Ia$var$repaint(target) {
  return target.offsetWidth;
}

function $V7Ia$var$calculateRealTime(animatingRect, fromRect, toRect, options) {
  return Math.sqrt(Math.pow(fromRect.top - animatingRect.top, 2) + Math.pow(fromRect.left - animatingRect.left, 2)) / Math.sqrt(Math.pow(fromRect.top - toRect.top, 2) + Math.pow(fromRect.left - toRect.left, 2)) * options.animation;
}

function $wKiJ$var$ownKeys(object, enumerableOnly) {
  var keys = Object.keys(object);

  if (Object.getOwnPropertySymbols) {
    var symbols = Object.getOwnPropertySymbols(object);
    if (enumerableOnly) symbols = symbols.filter(function (sym) {
      return Object.getOwnPropertyDescriptor(object, sym).enumerable;
    });
    keys.push.apply(keys, symbols);
  }

  return keys;
}

function $wKiJ$var$_objectSpread(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};

    if (i % 2) {
      $wKiJ$var$ownKeys(Object(source), true).forEach(function (key) {
        $wKiJ$var$_defineProperty(target, key, source[key]);
      });
    } else if (Object.getOwnPropertyDescriptors) {
      Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
    } else {
      $wKiJ$var$ownKeys(Object(source)).forEach(function (key) {
        Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
      });
    }
  }

  return target;
}

function $wKiJ$var$_defineProperty(obj, key, value) {
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

var $wKiJ$var$plugins = [];
var $wKiJ$var$defaults = {
  initializeByDefault: true
};
var $wKiJ$export$default = {
  mount: function mount(plugin) {
    // Set default static properties
    for (var option in $wKiJ$var$defaults) {
      if ($wKiJ$var$defaults.hasOwnProperty(option) && !(option in plugin)) {
        plugin[option] = $wKiJ$var$defaults[option];
      }
    }

    $wKiJ$var$plugins.push(plugin);
  },
  pluginEvent: function pluginEvent(eventName, sortable, evt) {
    var _this = this;

    this.eventCanceled = false;

    evt.cancel = function () {
      _this.eventCanceled = true;
    };

    var eventNameGlobal = eventName + 'Global';
    $wKiJ$var$plugins.forEach(function (plugin) {
      if (!sortable[plugin.pluginName]) return; // Fire global events if it exists in this sortable

      if (sortable[plugin.pluginName][eventNameGlobal]) {
        sortable[plugin.pluginName][eventNameGlobal]($wKiJ$var$_objectSpread({
          sortable: sortable
        }, evt));
      } // Only fire plugin event if plugin is enabled in this sortable,
      // and plugin has event defined


      if (sortable.options[plugin.pluginName] && sortable[plugin.pluginName][eventName]) {
        sortable[plugin.pluginName][eventName]($wKiJ$var$_objectSpread({
          sortable: sortable
        }, evt));
      }
    });
  },
  initializePlugins: function initializePlugins(sortable, el, defaults, options) {
    $wKiJ$var$plugins.forEach(function (plugin) {
      var pluginName = plugin.pluginName;
      if (!sortable.options[pluginName] && !plugin.initializeByDefault) return;
      var initialized = new plugin(sortable, el, sortable.options);
      initialized.sortable = sortable;
      initialized.options = sortable.options;
      sortable[pluginName] = initialized; // Add default options from plugin

      Object.assign(defaults, initialized.defaults);
    });

    for (var option in sortable.options) {
      if (!sortable.options.hasOwnProperty(option)) continue;
      var modified = this.modifyOption(sortable, option, sortable.options[option]);

      if (typeof modified !== 'undefined') {
        sortable.options[option] = modified;
      }
    }
  },
  getEventProperties: function getEventProperties(name, sortable) {
    var eventProperties = {};
    $wKiJ$var$plugins.forEach(function (plugin) {
      if (typeof plugin.eventProperties !== 'function') return;
      Object.assign(eventProperties, plugin.eventProperties.call(sortable[plugin.pluginName], name));
    });
    return eventProperties;
  },
  modifyOption: function modifyOption(sortable, name, value) {
    var modifiedValue;
    $wKiJ$var$plugins.forEach(function (plugin) {
      // Plugin must exist on the Sortable
      if (!sortable[plugin.pluginName]) return; // If static option listener exists for this option, call in the context of the Sortable's instance of this plugin

      if (plugin.optionListeners && typeof plugin.optionListeners[name] === 'function') {
        modifiedValue = plugin.optionListeners[name].call(sortable[plugin.pluginName], value);
      }
    });
    return modifiedValue;
  }
};

function $kuw9$var$ownKeys(object, enumerableOnly) {
  var keys = Object.keys(object);

  if (Object.getOwnPropertySymbols) {
    var symbols = Object.getOwnPropertySymbols(object);
    if (enumerableOnly) symbols = symbols.filter(function (sym) {
      return Object.getOwnPropertyDescriptor(object, sym).enumerable;
    });
    keys.push.apply(keys, symbols);
  }

  return keys;
}

function $kuw9$var$_objectSpread(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};

    if (i % 2) {
      $kuw9$var$ownKeys(Object(source), true).forEach(function (key) {
        $kuw9$var$_defineProperty(target, key, source[key]);
      });
    } else if (Object.getOwnPropertyDescriptors) {
      Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
    } else {
      $kuw9$var$ownKeys(Object(source)).forEach(function (key) {
        Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
      });
    }
  }

  return target;
}

function $kuw9$var$_defineProperty(obj, key, value) {
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

function $kuw9$export$default(_ref) {
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
      originalEvent = _ref.originalEvent,
      putSortable = _ref.putSortable,
      extraEventProperties = _ref.extraEventProperties;
  sortable = sortable || rootEl && rootEl[$O3AG$export$expando];
  if (!sortable) return;
  var evt,
      options = sortable.options,
      onName = 'on' + name.charAt(0).toUpperCase() + name.substr(1); // Support for new CustomEvent feature

  if (window.CustomEvent && !$jXvt$export$IE11OrLess && !$jXvt$export$Edge) {
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
  evt.originalEvent = originalEvent;
  evt.pullMode = putSortable ? putSortable.lastPutMode : undefined;
  var allEventProperties = $kuw9$var$_objectSpread($kuw9$var$_objectSpread({}, extraEventProperties), $wKiJ$export$default.getEventProperties(name, sortable));

  for (var option in allEventProperties) {
    evt[option] = allEventProperties[option];
  }

  if (rootEl) {
    rootEl.dispatchEvent(evt);
  }

  if (options[onName]) {
    options[onName].call(sortable, evt);
  }
}

function $pYnI$var$_typeof(obj) {
  "@babel/helpers - typeof";

  if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
    $pYnI$var$_typeof = function _typeof(obj) {
      return typeof obj;
    };
  } else {
    $pYnI$var$_typeof = function _typeof(obj) {
      return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    };
  }

  return $pYnI$var$_typeof(obj);
}

function $pYnI$var$ownKeys(object, enumerableOnly) {
  var keys = Object.keys(object);

  if (Object.getOwnPropertySymbols) {
    var symbols = Object.getOwnPropertySymbols(object);
    if (enumerableOnly) symbols = symbols.filter(function (sym) {
      return Object.getOwnPropertyDescriptor(object, sym).enumerable;
    });
    keys.push.apply(keys, symbols);
  }

  return keys;
}

function $pYnI$var$_objectSpread(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};

    if (i % 2) {
      $pYnI$var$ownKeys(Object(source), true).forEach(function (key) {
        $pYnI$var$_defineProperty(target, key, source[key]);
      });
    } else if (Object.getOwnPropertyDescriptors) {
      Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
    } else {
      $pYnI$var$ownKeys(Object(source)).forEach(function (key) {
        Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
      });
    }
  }

  return target;
}

function $pYnI$var$_defineProperty(obj, key, value) {
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

function $pYnI$var$_objectWithoutProperties(source, excluded) {
  if (source == null) return {};
  var target = $pYnI$var$_objectWithoutPropertiesLoose(source, excluded);
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

function $pYnI$var$_objectWithoutPropertiesLoose(source, excluded) {
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

var $pYnI$var$pluginEvent = function pluginEvent(eventName, sortable) {
  var _ref = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {},
      originalEvent = _ref.evt,
      data = $pYnI$var$_objectWithoutProperties(_ref, ["evt"]);

  $wKiJ$export$default.pluginEvent.bind($pYnI$export$default)(eventName, sortable, $pYnI$var$_objectSpread({
    dragEl: $pYnI$var$dragEl,
    parentEl: $pYnI$var$parentEl,
    ghostEl: $pYnI$var$ghostEl,
    rootEl: $pYnI$var$rootEl,
    nextEl: $pYnI$var$nextEl,
    lastDownEl: $pYnI$var$lastDownEl,
    cloneEl: $pYnI$var$cloneEl,
    cloneHidden: $pYnI$var$cloneHidden,
    dragStarted: $pYnI$var$moved,
    putSortable: $pYnI$var$putSortable,
    activeSortable: $pYnI$export$default.active,
    originalEvent: originalEvent,
    oldIndex: $pYnI$var$oldIndex,
    oldDraggableIndex: $pYnI$var$oldDraggableIndex,
    newIndex: $pYnI$var$newIndex,
    newDraggableIndex: $pYnI$var$newDraggableIndex,
    hideGhostForTarget: $pYnI$var$_hideGhostForTarget,
    unhideGhostForTarget: $pYnI$var$_unhideGhostForTarget,
    cloneNowHidden: function cloneNowHidden() {
      $pYnI$var$cloneHidden = true;
    },
    cloneNowShown: function cloneNowShown() {
      $pYnI$var$cloneHidden = false;
    },
    dispatchSortableEvent: function dispatchSortableEvent(name) {
      $pYnI$var$_dispatchEvent({
        sortable: sortable,
        name: name,
        originalEvent: originalEvent
      });
    }
  }, data));
};

function $pYnI$var$_dispatchEvent(info) {
  $kuw9$export$default($pYnI$var$_objectSpread({
    putSortable: $pYnI$var$putSortable,
    cloneEl: $pYnI$var$cloneEl,
    targetEl: $pYnI$var$dragEl,
    rootEl: $pYnI$var$rootEl,
    oldIndex: $pYnI$var$oldIndex,
    oldDraggableIndex: $pYnI$var$oldDraggableIndex,
    newIndex: $pYnI$var$newIndex,
    newDraggableIndex: $pYnI$var$newDraggableIndex
  }, info));
}

var $pYnI$var$dragEl,
    $pYnI$var$parentEl,
    $pYnI$var$ghostEl,
    $pYnI$var$rootEl,
    $pYnI$var$nextEl,
    $pYnI$var$lastDownEl,
    $pYnI$var$cloneEl,
    $pYnI$var$cloneHidden,
    $pYnI$var$oldIndex,
    $pYnI$var$newIndex,
    $pYnI$var$oldDraggableIndex,
    $pYnI$var$newDraggableIndex,
    $pYnI$var$activeGroup,
    $pYnI$var$putSortable,
    $pYnI$var$awaitingDragStarted = false,
    $pYnI$var$ignoreNextClick = false,
    $pYnI$var$sortables = [],
    $pYnI$var$tapEvt,
    $pYnI$var$touchEvt,
    $pYnI$var$lastDx,
    $pYnI$var$lastDy,
    $pYnI$var$tapDistanceLeft,
    $pYnI$var$tapDistanceTop,
    $pYnI$var$moved,
    $pYnI$var$lastTarget,
    $pYnI$var$lastDirection,
    $pYnI$var$pastFirstInvertThresh = false,
    $pYnI$var$isCircumstantialInvert = false,
    $pYnI$var$targetMoveDistance,
    // For positioning ghost absolutely
$pYnI$var$ghostRelativeParent,
    $pYnI$var$ghostRelativeParentInitialScroll = [],
    // (left, top)
$pYnI$var$_silent = false,
    $pYnI$var$savedInputChecked = [];
/** @const */

var $pYnI$var$documentExists = typeof document !== 'undefined',
    $pYnI$var$PositionGhostAbsolutely = $jXvt$export$IOS,
    $pYnI$var$CSSFloatProperty = $jXvt$export$Edge || $jXvt$export$IE11OrLess ? 'cssFloat' : 'float',
    // This will not pass for IE9, because IE9 DnD only works on anchors
$pYnI$var$supportDraggable = $pYnI$var$documentExists && !$jXvt$export$ChromeForAndroid && !$jXvt$export$IOS && 'draggable' in document.createElement('div'),
    $pYnI$var$supportCssPointerEvents = function () {
  if (!$pYnI$var$documentExists) return; // false when <= IE11

  if ($jXvt$export$IE11OrLess) {
    return false;
  }

  var el = document.createElement('x');
  el.style.cssText = 'pointer-events:auto';
  return el.style.pointerEvents === 'auto';
}(),
    $pYnI$var$_detectDirection = function _detectDirection(el, options) {
  var elCSS = $O3AG$export$css(el),
      elWidth = parseInt(elCSS.width) - parseInt(elCSS.paddingLeft) - parseInt(elCSS.paddingRight) - parseInt(elCSS.borderLeftWidth) - parseInt(elCSS.borderRightWidth),
      child1 = $O3AG$export$getChild(el, 0, options),
      child2 = $O3AG$export$getChild(el, 1, options),
      firstChildCSS = child1 && $O3AG$export$css(child1),
      secondChildCSS = child2 && $O3AG$export$css(child2),
      firstChildWidth = firstChildCSS && parseInt(firstChildCSS.marginLeft) + parseInt(firstChildCSS.marginRight) + $O3AG$export$getRect(child1).width,
      secondChildWidth = secondChildCSS && parseInt(secondChildCSS.marginLeft) + parseInt(secondChildCSS.marginRight) + $O3AG$export$getRect(child2).width;

  if (elCSS.display === 'flex') {
    return elCSS.flexDirection === 'column' || elCSS.flexDirection === 'column-reverse' ? 'vertical' : 'horizontal';
  }

  if (elCSS.display === 'grid') {
    return elCSS.gridTemplateColumns.split(' ').length <= 1 ? 'vertical' : 'horizontal';
  }

  if (child1 && firstChildCSS.float && firstChildCSS.float !== 'none') {
    var touchingSideChild2 = firstChildCSS.float === 'left' ? 'left' : 'right';
    return child2 && (secondChildCSS.clear === 'both' || secondChildCSS.clear === touchingSideChild2) ? 'vertical' : 'horizontal';
  }

  return child1 && (firstChildCSS.display === 'block' || firstChildCSS.display === 'flex' || firstChildCSS.display === 'table' || firstChildCSS.display === 'grid' || firstChildWidth >= elWidth && elCSS[$pYnI$var$CSSFloatProperty] === 'none' || child2 && elCSS[$pYnI$var$CSSFloatProperty] === 'none' && firstChildWidth + secondChildWidth > elWidth) ? 'vertical' : 'horizontal';
},
    $pYnI$var$_dragElInRowColumn = function _dragElInRowColumn(dragRect, targetRect, vertical) {
  var dragElS1Opp = vertical ? dragRect.left : dragRect.top,
      dragElS2Opp = vertical ? dragRect.right : dragRect.bottom,
      dragElOppLength = vertical ? dragRect.width : dragRect.height,
      targetS1Opp = vertical ? targetRect.left : targetRect.top,
      targetS2Opp = vertical ? targetRect.right : targetRect.bottom,
      targetOppLength = vertical ? targetRect.width : targetRect.height;
  return dragElS1Opp === targetS1Opp || dragElS2Opp === targetS2Opp || dragElS1Opp + dragElOppLength / 2 === targetS1Opp + targetOppLength / 2;
},

/**
 * Detects first nearest empty sortable to X and Y position using emptyInsertThreshold.
 * @param  {Number} x      X position
 * @param  {Number} y      Y position
 * @return {HTMLElement}   Element of the first found nearest Sortable
 */
$pYnI$var$_detectNearestEmptySortable = function _detectNearestEmptySortable(x, y) {
  var ret;
  $pYnI$var$sortables.some(function (sortable) {
    if ($O3AG$export$lastChild(sortable)) return;
    var rect = $O3AG$export$getRect(sortable),
        threshold = sortable[$O3AG$export$expando].options.emptyInsertThreshold,
        insideHorizontally = x >= rect.left - threshold && x <= rect.right + threshold,
        insideVertically = y >= rect.top - threshold && y <= rect.bottom + threshold;

    if (threshold && insideHorizontally && insideVertically) {
      return ret = sortable;
    }
  });
  return ret;
},
    $pYnI$var$_prepareGroup = function _prepareGroup(options) {
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

  if (!originalGroup || $pYnI$var$_typeof(originalGroup) != 'object') {
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
    $pYnI$var$_hideGhostForTarget = function _hideGhostForTarget() {
  if (!$pYnI$var$supportCssPointerEvents && $pYnI$var$ghostEl) {
    $O3AG$export$css($pYnI$var$ghostEl, 'display', 'none');
  }
},
    $pYnI$var$_unhideGhostForTarget = function _unhideGhostForTarget() {
  if (!$pYnI$var$supportCssPointerEvents && $pYnI$var$ghostEl) {
    $O3AG$export$css($pYnI$var$ghostEl, 'display', '');
  }
}; // #1184 fix - Prevent click event on fallback if dragged but item not changed position


if ($pYnI$var$documentExists) {
  document.addEventListener('click', function (evt) {
    if ($pYnI$var$ignoreNextClick) {
      evt.preventDefault();
      evt.stopPropagation && evt.stopPropagation();
      evt.stopImmediatePropagation && evt.stopImmediatePropagation();
      $pYnI$var$ignoreNextClick = false;
      return false;
    }
  }, true);
}

var $pYnI$var$nearestEmptyInsertDetectEvent = function nearestEmptyInsertDetectEvent(evt) {
  if ($pYnI$var$dragEl) {
    evt = evt.touches ? evt.touches[0] : evt;
    var nearest = $pYnI$var$_detectNearestEmptySortable(evt.clientX, evt.clientY);

    if (nearest) {
      // Create imitation event
      var event = {};

      for (var i in evt) {
        if (evt.hasOwnProperty(i)) {
          event[i] = evt[i];
        }
      }

      event.target = event.rootEl = nearest;
      event.preventDefault = void 0;
      event.stopPropagation = void 0;

      nearest[$O3AG$export$expando]._onDragOver(event);
    }
  }
};

var $pYnI$var$_checkOutsideTargetEl = function _checkOutsideTargetEl(evt) {
  if ($pYnI$var$dragEl) {
    $pYnI$var$dragEl.parentNode[$O3AG$export$expando]._isOutsideThisEl(evt.target);
  }
};
/**
 * @class  Sortable
 * @param  {HTMLElement}  el
 * @param  {Object}       [options]
 */


function $pYnI$export$default(el, options) {
  if (!(el && el.nodeType && el.nodeType === 1)) {
    throw "Sortable: `el` must be an HTMLElement, not ".concat({}.toString.call(el));
  }

  this.el = el; // root element

  this.options = options = Object.assign({}, options); // Export instance

  el[$O3AG$export$expando] = this;
  var defaults = {
    group: null,
    sort: true,
    disabled: false,
    store: null,
    handle: null,
    draggable: /^[uo]l$/i.test(el.nodeName) ? '>li' : '>*',
    swapThreshold: 1,
    // percentage; 0 <= x <= 1
    invertSwap: false,
    // invert always
    invertedSwapThreshold: null,
    // will be set to same as swapThreshold if default
    removeCloneOnHide: true,
    direction: function direction() {
      return $pYnI$var$_detectDirection(el, this.options);
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
    touchStartThreshold: (Number.parseInt ? Number : window).parseInt(window.devicePixelRatio, 10) || 1,
    forceFallback: false,
    fallbackClass: 'sortable-fallback',
    fallbackOnBody: false,
    fallbackTolerance: 0,
    fallbackOffset: {
      x: 0,
      y: 0
    },
    supportPointer: $pYnI$export$default.supportPointer !== false && 'PointerEvent' in window,
    emptyInsertThreshold: 5
  };
  $wKiJ$export$default.initializePlugins(this, el, defaults); // Set default options

  for (var name in defaults) {
    !(name in options) && (options[name] = defaults[name]);
  }

  $pYnI$var$_prepareGroup(options); // Bind all private methods

  for (var fn in this) {
    if (fn.charAt(0) === '_' && typeof this[fn] === 'function') {
      this[fn] = this[fn].bind(this);
    }
  } // Setup drag mode


  this.nativeDraggable = options.forceFallback ? false : $pYnI$var$supportDraggable;

  if (this.nativeDraggable) {
    // Touch start threshold cannot be greater than the native dragstart threshold
    this.options.touchStartThreshold = 1;
  } // Bind events


  if (options.supportPointer) {
    $O3AG$export$on(el, 'pointerdown', this._onTapStart);
  } else {
    $O3AG$export$on(el, 'mousedown', this._onTapStart);
    $O3AG$export$on(el, 'touchstart', this._onTapStart);
  }

  if (this.nativeDraggable) {
    $O3AG$export$on(el, 'dragover', this);
    $O3AG$export$on(el, 'dragenter', this);
  }

  $pYnI$var$sortables.push(this.el); // Restore sorting

  options.store && options.store.get && this.sort(options.store.get(this) || []); // Add animation state manager

  Object.assign(this, $V7Ia$export$default());
}

$pYnI$export$default.prototype =
/** @lends Sortable.prototype */
{
  constructor: $pYnI$export$default,
  _isOutsideThisEl: function _isOutsideThisEl(target) {
    if (!this.el.contains(target) && target !== this.el) {
      $pYnI$var$lastTarget = null;
    }
  },
  _getDirection: function _getDirection(evt, target) {
    return typeof this.options.direction === 'function' ? this.options.direction.call(this, evt, target, $pYnI$var$dragEl) : this.options.direction;
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
        touch = evt.touches && evt.touches[0] || evt.pointerType && evt.pointerType === 'touch' && evt,
        target = (touch || evt).target,
        originalTarget = evt.target.shadowRoot && (evt.path && evt.path[0] || evt.composedPath && evt.composedPath()[0]) || target,
        filter = options.filter;

    $pYnI$var$_saveInputCheckedState(el); // Don't trigger start event when an element is been dragged, otherwise the evt.oldindex always wrong when set option.group.

    if ($pYnI$var$dragEl) {
      return;
    }

    if (/mousedown|pointerdown/.test(type) && evt.button !== 0 || options.disabled) {
      return; // only left button and enabled
    } // cancel dnd if original target is content editable


    if (originalTarget.isContentEditable) {
      return;
    } // Safari ignores further event handling after mousedown


    if (!this.nativeDraggable && $jXvt$export$Safari && target && target.tagName.toUpperCase() === 'SELECT') {
      return;
    }

    target = $O3AG$export$closest(target, options.draggable, el, false);

    if (target && target.animated) {
      return;
    }

    if ($pYnI$var$lastDownEl === target) {
      // Ignoring duplicate `down`
      return;
    } // Get the index of the dragged element within its parent


    $pYnI$var$oldIndex = $O3AG$export$index(target);
    $pYnI$var$oldDraggableIndex = $O3AG$export$index(target, options.draggable); // Check filter

    if (typeof filter === 'function') {
      if (filter.call(this, evt, target, this)) {
        $pYnI$var$_dispatchEvent({
          sortable: _this,
          rootEl: originalTarget,
          name: 'filter',
          targetEl: target,
          toEl: el,
          fromEl: el
        });
        $pYnI$var$pluginEvent('filter', _this, {
          evt: evt
        });
        preventOnFilter && evt.cancelable && evt.preventDefault();
        return; // cancel dnd
      }
    } else if (filter) {
      filter = filter.split(',').some(function (criteria) {
        criteria = $O3AG$export$closest(originalTarget, criteria.trim(), el, false);

        if (criteria) {
          $pYnI$var$_dispatchEvent({
            sortable: _this,
            rootEl: criteria,
            name: 'filter',
            targetEl: target,
            fromEl: el,
            toEl: el
          });
          $pYnI$var$pluginEvent('filter', _this, {
            evt: evt
          });
          return true;
        }
      });

      if (filter) {
        preventOnFilter && evt.cancelable && evt.preventDefault();
        return; // cancel dnd
      }
    }

    if (options.handle && !$O3AG$export$closest(originalTarget, options.handle, el, false)) {
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

    if (target && !$pYnI$var$dragEl && target.parentNode === el) {
      var dragRect = $O3AG$export$getRect(target);
      $pYnI$var$rootEl = el;
      $pYnI$var$dragEl = target;
      $pYnI$var$parentEl = $pYnI$var$dragEl.parentNode;
      $pYnI$var$nextEl = $pYnI$var$dragEl.nextSibling;
      $pYnI$var$lastDownEl = target;
      $pYnI$var$activeGroup = options.group;
      $pYnI$export$default.dragged = $pYnI$var$dragEl;
      $pYnI$var$tapEvt = {
        target: $pYnI$var$dragEl,
        clientX: (touch || evt).clientX,
        clientY: (touch || evt).clientY
      };
      $pYnI$var$tapDistanceLeft = $pYnI$var$tapEvt.clientX - dragRect.left;
      $pYnI$var$tapDistanceTop = $pYnI$var$tapEvt.clientY - dragRect.top;
      this._lastX = (touch || evt).clientX;
      this._lastY = (touch || evt).clientY;
      $pYnI$var$dragEl.style['will-change'] = 'all';

      dragStartFn = function dragStartFn() {
        $pYnI$var$pluginEvent('delayEnded', _this, {
          evt: evt
        });

        if ($pYnI$export$default.eventCanceled) {
          _this._onDrop();

          return;
        } // Delayed drag has been triggered
        // we can re-enable the events: touchmove/mousemove


        _this._disableDelayedDragEvents();

        if (!$jXvt$export$FireFox && _this.nativeDraggable) {
          $pYnI$var$dragEl.draggable = true;
        } // Bind the events: dragstart/dragend


        _this._triggerDragStart(evt, touch); // Drag start event


        $pYnI$var$_dispatchEvent({
          sortable: _this,
          name: 'choose',
          originalEvent: evt
        }); // Chosen item

        $O3AG$export$toggleClass($pYnI$var$dragEl, options.chosenClass, true);
      }; // Disable "draggable"


      options.ignore.split(',').forEach(function (criteria) {
        $O3AG$export$find($pYnI$var$dragEl, criteria.trim(), $pYnI$var$_disableDraggable);
      });
      $O3AG$export$on(ownerDocument, 'dragover', $pYnI$var$nearestEmptyInsertDetectEvent);
      $O3AG$export$on(ownerDocument, 'mousemove', $pYnI$var$nearestEmptyInsertDetectEvent);
      $O3AG$export$on(ownerDocument, 'touchmove', $pYnI$var$nearestEmptyInsertDetectEvent);
      $O3AG$export$on(ownerDocument, 'mouseup', _this._onDrop);
      $O3AG$export$on(ownerDocument, 'touchend', _this._onDrop);
      $O3AG$export$on(ownerDocument, 'touchcancel', _this._onDrop); // Make dragEl draggable (must be before delay for FireFox)

      if ($jXvt$export$FireFox && this.nativeDraggable) {
        this.options.touchStartThreshold = 4;
        $pYnI$var$dragEl.draggable = true;
      }

      $pYnI$var$pluginEvent('delayStart', this, {
        evt: evt
      }); // Delay is impossible for native DnD in Edge or IE

      if (options.delay && (!options.delayOnTouchOnly || touch) && (!this.nativeDraggable || !($jXvt$export$Edge || $jXvt$export$IE11OrLess))) {
        if ($pYnI$export$default.eventCanceled) {
          this._onDrop();

          return;
        } // If the user moves the pointer or let go the click or touch
        // before the delay has been reached:
        // disable the delayed drag


        $O3AG$export$on(ownerDocument, 'mouseup', _this._disableDelayedDrag);
        $O3AG$export$on(ownerDocument, 'touchend', _this._disableDelayedDrag);
        $O3AG$export$on(ownerDocument, 'touchcancel', _this._disableDelayedDrag);
        $O3AG$export$on(ownerDocument, 'mousemove', _this._delayedDragTouchMoveHandler);
        $O3AG$export$on(ownerDocument, 'touchmove', _this._delayedDragTouchMoveHandler);
        options.supportPointer && $O3AG$export$on(ownerDocument, 'pointermove', _this._delayedDragTouchMoveHandler);
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
    $pYnI$var$dragEl && $pYnI$var$_disableDraggable($pYnI$var$dragEl);
    clearTimeout(this._dragStartTimer);

    this._disableDelayedDragEvents();
  },
  _disableDelayedDragEvents: function _disableDelayedDragEvents() {
    var ownerDocument = this.el.ownerDocument;
    $O3AG$export$off(ownerDocument, 'mouseup', this._disableDelayedDrag);
    $O3AG$export$off(ownerDocument, 'touchend', this._disableDelayedDrag);
    $O3AG$export$off(ownerDocument, 'touchcancel', this._disableDelayedDrag);
    $O3AG$export$off(ownerDocument, 'mousemove', this._delayedDragTouchMoveHandler);
    $O3AG$export$off(ownerDocument, 'touchmove', this._delayedDragTouchMoveHandler);
    $O3AG$export$off(ownerDocument, 'pointermove', this._delayedDragTouchMoveHandler);
  },
  _triggerDragStart: function _triggerDragStart(
  /** Event */
  evt,
  /** Touch */
  touch) {
    touch = touch || evt.pointerType == 'touch' && evt;

    if (!this.nativeDraggable || touch) {
      if (this.options.supportPointer) {
        $O3AG$export$on(document, 'pointermove', this._onTouchMove);
      } else if (touch) {
        $O3AG$export$on(document, 'touchmove', this._onTouchMove);
      } else {
        $O3AG$export$on(document, 'mousemove', this._onTouchMove);
      }
    } else {
      $O3AG$export$on($pYnI$var$dragEl, 'dragend', this);
      $O3AG$export$on($pYnI$var$rootEl, 'dragstart', this._onDragStart);
    }

    try {
      if (document.selection) {
        // Timeout neccessary for IE9
        $pYnI$var$_nextTick(function () {
          document.selection.empty();
        });
      } else {
        window.getSelection().removeAllRanges();
      }
    } catch (err) {}
  },
  _dragStarted: function _dragStarted(fallback, evt) {
    var _this = this;

    $pYnI$var$awaitingDragStarted = false;

    if ($pYnI$var$rootEl && $pYnI$var$dragEl) {
      $pYnI$var$pluginEvent('dragStarted', this, {
        evt: evt
      });

      if (this.nativeDraggable) {
        $O3AG$export$on(document, 'dragover', $pYnI$var$_checkOutsideTargetEl);
      }

      var options = this.options; // Apply effect

      !fallback && $O3AG$export$toggleClass($pYnI$var$dragEl, options.dragClass, false);
      $O3AG$export$toggleClass($pYnI$var$dragEl, options.ghostClass, true);
      $pYnI$export$default.active = this;
      fallback && this._appendGhost(); // Drag start event

      $pYnI$var$_dispatchEvent({
        sortable: this,
        name: 'start',
        originalEvent: evt
      });
    } else {
      this._nulling();
    }
  },
  _emulateDragOver: function _emulateDragOver() {
    if ($pYnI$var$touchEvt) {
      this._lastX = $pYnI$var$touchEvt.clientX;
      this._lastY = $pYnI$var$touchEvt.clientY;
      $pYnI$var$_hideGhostForTarget();
      var target = document.elementFromPoint($pYnI$var$touchEvt.clientX, $pYnI$var$touchEvt.clientY);
      var parent = target;

      while (target && target.shadowRoot) {
        target = target.shadowRoot.elementFromPoint($pYnI$var$touchEvt.clientX, $pYnI$var$touchEvt.clientY);
        if (target === parent) break;
        parent = target;
      }

      $pYnI$var$dragEl.parentNode[$O3AG$export$expando]._isOutsideThisEl(target);

      if (parent) {
        do {
          if (parent[$O3AG$export$expando]) {
            var inserted = void 0;
            inserted = parent[$O3AG$export$expando]._onDragOver({
              clientX: $pYnI$var$touchEvt.clientX,
              clientY: $pYnI$var$touchEvt.clientY,
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

      $pYnI$var$_unhideGhostForTarget();
    }
  },
  _onTouchMove: function _onTouchMove(
  /**TouchEvent*/
  evt) {
    if ($pYnI$var$tapEvt) {
      var options = this.options,
          fallbackTolerance = options.fallbackTolerance,
          fallbackOffset = options.fallbackOffset,
          touch = evt.touches ? evt.touches[0] : evt,
          ghostMatrix = $pYnI$var$ghostEl && $O3AG$export$matrix($pYnI$var$ghostEl, true),
          scaleX = $pYnI$var$ghostEl && ghostMatrix && ghostMatrix.a,
          scaleY = $pYnI$var$ghostEl && ghostMatrix && ghostMatrix.d,
          relativeScrollOffset = $pYnI$var$PositionGhostAbsolutely && $pYnI$var$ghostRelativeParent && $O3AG$export$getRelativeScrollOffset($pYnI$var$ghostRelativeParent),
          dx = (touch.clientX - $pYnI$var$tapEvt.clientX + fallbackOffset.x) / (scaleX || 1) + (relativeScrollOffset ? relativeScrollOffset[0] - $pYnI$var$ghostRelativeParentInitialScroll[0] : 0) / (scaleX || 1),
          dy = (touch.clientY - $pYnI$var$tapEvt.clientY + fallbackOffset.y) / (scaleY || 1) + (relativeScrollOffset ? relativeScrollOffset[1] - $pYnI$var$ghostRelativeParentInitialScroll[1] : 0) / (scaleY || 1); // only set the status to dragging, when we are actually dragging

      if (!$pYnI$export$default.active && !$pYnI$var$awaitingDragStarted) {
        if (fallbackTolerance && Math.max(Math.abs(touch.clientX - this._lastX), Math.abs(touch.clientY - this._lastY)) < fallbackTolerance) {
          return;
        }

        this._onDragStart(evt, true);
      }

      if ($pYnI$var$ghostEl) {
        if (ghostMatrix) {
          ghostMatrix.e += dx - ($pYnI$var$lastDx || 0);
          ghostMatrix.f += dy - ($pYnI$var$lastDy || 0);
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

        var cssMatrix = "matrix(".concat(ghostMatrix.a, ",").concat(ghostMatrix.b, ",").concat(ghostMatrix.c, ",").concat(ghostMatrix.d, ",").concat(ghostMatrix.e, ",").concat(ghostMatrix.f, ")");
        $O3AG$export$css($pYnI$var$ghostEl, 'webkitTransform', cssMatrix);
        $O3AG$export$css($pYnI$var$ghostEl, 'mozTransform', cssMatrix);
        $O3AG$export$css($pYnI$var$ghostEl, 'msTransform', cssMatrix);
        $O3AG$export$css($pYnI$var$ghostEl, 'transform', cssMatrix);
        $pYnI$var$lastDx = dx;
        $pYnI$var$lastDy = dy;
        $pYnI$var$touchEvt = touch;
      }

      evt.cancelable && evt.preventDefault();
    }
  },
  _appendGhost: function _appendGhost() {
    // Bug if using scale(): https://stackoverflow.com/questions/2637058
    // Not being adjusted for
    if (!$pYnI$var$ghostEl) {
      var container = this.options.fallbackOnBody ? document.body : $pYnI$var$rootEl,
          rect = $O3AG$export$getRect($pYnI$var$dragEl, true, $pYnI$var$PositionGhostAbsolutely, true, container),
          options = this.options; // Position absolutely

      if ($pYnI$var$PositionGhostAbsolutely) {
        // Get relatively positioned parent
        $pYnI$var$ghostRelativeParent = container;

        while ($O3AG$export$css($pYnI$var$ghostRelativeParent, 'position') === 'static' && $O3AG$export$css($pYnI$var$ghostRelativeParent, 'transform') === 'none' && $pYnI$var$ghostRelativeParent !== document) {
          $pYnI$var$ghostRelativeParent = $pYnI$var$ghostRelativeParent.parentNode;
        }

        if ($pYnI$var$ghostRelativeParent !== document.body && $pYnI$var$ghostRelativeParent !== document.documentElement) {
          if ($pYnI$var$ghostRelativeParent === document) $pYnI$var$ghostRelativeParent = $O3AG$export$getWindowScrollingElement();
          rect.top += $pYnI$var$ghostRelativeParent.scrollTop;
          rect.left += $pYnI$var$ghostRelativeParent.scrollLeft;
        } else {
          $pYnI$var$ghostRelativeParent = $O3AG$export$getWindowScrollingElement();
        }

        $pYnI$var$ghostRelativeParentInitialScroll = $O3AG$export$getRelativeScrollOffset($pYnI$var$ghostRelativeParent);
      }

      $pYnI$var$ghostEl = $pYnI$var$dragEl.cloneNode(true);
      $O3AG$export$toggleClass($pYnI$var$ghostEl, options.ghostClass, false);
      $O3AG$export$toggleClass($pYnI$var$ghostEl, options.fallbackClass, true);
      $O3AG$export$toggleClass($pYnI$var$ghostEl, options.dragClass, true);
      $O3AG$export$css($pYnI$var$ghostEl, 'transition', '');
      $O3AG$export$css($pYnI$var$ghostEl, 'transform', '');
      $O3AG$export$css($pYnI$var$ghostEl, 'box-sizing', 'border-box');
      $O3AG$export$css($pYnI$var$ghostEl, 'margin', 0);
      $O3AG$export$css($pYnI$var$ghostEl, 'top', rect.top);
      $O3AG$export$css($pYnI$var$ghostEl, 'left', rect.left);
      $O3AG$export$css($pYnI$var$ghostEl, 'width', rect.width);
      $O3AG$export$css($pYnI$var$ghostEl, 'height', rect.height);
      $O3AG$export$css($pYnI$var$ghostEl, 'opacity', '0.8');
      $O3AG$export$css($pYnI$var$ghostEl, 'position', $pYnI$var$PositionGhostAbsolutely ? 'absolute' : 'fixed');
      $O3AG$export$css($pYnI$var$ghostEl, 'zIndex', '100000');
      $O3AG$export$css($pYnI$var$ghostEl, 'pointerEvents', 'none');
      $pYnI$export$default.ghost = $pYnI$var$ghostEl;
      container.appendChild($pYnI$var$ghostEl); // Set transform-origin

      $O3AG$export$css($pYnI$var$ghostEl, 'transform-origin', $pYnI$var$tapDistanceLeft / parseInt($pYnI$var$ghostEl.style.width) * 100 + '% ' + $pYnI$var$tapDistanceTop / parseInt($pYnI$var$ghostEl.style.height) * 100 + '%');
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
    $pYnI$var$pluginEvent('dragStart', this, {
      evt: evt
    });

    if ($pYnI$export$default.eventCanceled) {
      this._onDrop();

      return;
    }

    $pYnI$var$pluginEvent('setupClone', this);

    if (!$pYnI$export$default.eventCanceled) {
      $pYnI$var$cloneEl = $O3AG$export$clone($pYnI$var$dragEl);
      $pYnI$var$cloneEl.draggable = false;
      $pYnI$var$cloneEl.style['will-change'] = '';

      this._hideClone();

      $O3AG$export$toggleClass($pYnI$var$cloneEl, this.options.chosenClass, false);
      $pYnI$export$default.clone = $pYnI$var$cloneEl;
    } // #1143: IFrame support workaround


    _this.cloneId = $pYnI$var$_nextTick(function () {
      $pYnI$var$pluginEvent('clone', _this);
      if ($pYnI$export$default.eventCanceled) return;

      if (!_this.options.removeCloneOnHide) {
        $pYnI$var$rootEl.insertBefore($pYnI$var$cloneEl, $pYnI$var$dragEl);
      }

      _this._hideClone();

      $pYnI$var$_dispatchEvent({
        sortable: _this,
        name: 'clone'
      });
    });
    !fallback && $O3AG$export$toggleClass($pYnI$var$dragEl, options.dragClass, true); // Set proper drop events

    if (fallback) {
      $pYnI$var$ignoreNextClick = true;
      _this._loopId = setInterval(_this._emulateDragOver, 50);
    } else {
      // Undo what was set in _prepareDragStart before drag started
      $O3AG$export$off(document, 'mouseup', _this._onDrop);
      $O3AG$export$off(document, 'touchend', _this._onDrop);
      $O3AG$export$off(document, 'touchcancel', _this._onDrop);

      if (dataTransfer) {
        dataTransfer.effectAllowed = 'move';
        options.setData && options.setData.call(_this, dataTransfer, $pYnI$var$dragEl);
      }

      $O3AG$export$on(document, 'drop', _this); // #1276 fix:

      $O3AG$export$css($pYnI$var$dragEl, 'transform', 'translateZ(0)');
    }

    $pYnI$var$awaitingDragStarted = true;
    _this._dragStartId = $pYnI$var$_nextTick(_this._dragStarted.bind(_this, fallback, evt));
    $O3AG$export$on(document, 'selectstart', _this);
    $pYnI$var$moved = true;

    if ($jXvt$export$Safari) {
      $O3AG$export$css(document.body, 'user-select', 'none');
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
        activeSortable = $pYnI$export$default.active,
        isOwner = $pYnI$var$activeGroup === group,
        canSort = options.sort,
        fromSortable = $pYnI$var$putSortable || activeSortable,
        vertical,
        _this = this,
        completedFired = false;

    if ($pYnI$var$_silent) return;

    function dragOverEvent(name, extra) {
      $pYnI$var$pluginEvent(name, _this, $pYnI$var$_objectSpread({
        evt: evt,
        isOwner: isOwner,
        axis: vertical ? 'vertical' : 'horizontal',
        revert: revert,
        dragRect: dragRect,
        targetRect: targetRect,
        canSort: canSort,
        fromSortable: fromSortable,
        target: target,
        completed: completed,
        onMove: function onMove(target, after) {
          return $pYnI$var$_onMove($pYnI$var$rootEl, el, $pYnI$var$dragEl, dragRect, target, $O3AG$export$getRect(target), evt, after);
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

        if (_this !== fromSortable) {
          // Set ghost class to new sortable's ghost class
          $O3AG$export$toggleClass($pYnI$var$dragEl, $pYnI$var$putSortable ? $pYnI$var$putSortable.options.ghostClass : activeSortable.options.ghostClass, false);
          $O3AG$export$toggleClass($pYnI$var$dragEl, options.ghostClass, true);
        }

        if ($pYnI$var$putSortable !== _this && _this !== $pYnI$export$default.active) {
          $pYnI$var$putSortable = _this;
        } else if (_this === $pYnI$export$default.active && $pYnI$var$putSortable) {
          $pYnI$var$putSortable = null;
        } // Animation


        if (fromSortable === _this) {
          _this._ignoreWhileAnimating = target;
        }

        _this.animateAll(function () {
          dragOverEvent('dragOverAnimationComplete');
          _this._ignoreWhileAnimating = null;
        });

        if (_this !== fromSortable) {
          fromSortable.animateAll();
          fromSortable._ignoreWhileAnimating = null;
        }
      } // Null lastTarget if it is not inside a previously swapped element


      if (target === $pYnI$var$dragEl && !$pYnI$var$dragEl.animated || target === el && !target.animated) {
        $pYnI$var$lastTarget = null;
      } // no bubbling and not fallback


      if (!options.dragoverBubble && !evt.rootEl && target !== document) {
        $pYnI$var$dragEl.parentNode[$O3AG$export$expando]._isOutsideThisEl(evt.target); // Do not detect for empty insert if already inserted


        !insertion && $pYnI$var$nearestEmptyInsertDetectEvent(evt);
      }

      !options.dragoverBubble && evt.stopPropagation && evt.stopPropagation();
      return completedFired = true;
    } // Call when dragEl has been inserted


    function changed() {
      $pYnI$var$newIndex = $O3AG$export$index($pYnI$var$dragEl);
      $pYnI$var$newDraggableIndex = $O3AG$export$index($pYnI$var$dragEl, options.draggable);
      $pYnI$var$_dispatchEvent({
        sortable: _this,
        name: 'change',
        toEl: el,
        newIndex: $pYnI$var$newIndex,
        newDraggableIndex: $pYnI$var$newDraggableIndex,
        originalEvent: evt
      });
    }

    if (evt.preventDefault !== void 0) {
      evt.cancelable && evt.preventDefault();
    }

    target = $O3AG$export$closest(target, options.draggable, el, true);
    dragOverEvent('dragOver');
    if ($pYnI$export$default.eventCanceled) return completedFired;

    if ($pYnI$var$dragEl.contains(evt.target) || target.animated && target.animatingX && target.animatingY || _this._ignoreWhileAnimating === target) {
      return completed(false);
    }

    $pYnI$var$ignoreNextClick = false;

    if (activeSortable && !options.disabled && (isOwner ? canSort || (revert = !$pYnI$var$rootEl.contains($pYnI$var$dragEl)) // Reverting item into the original list
    : $pYnI$var$putSortable === this || (this.lastPutMode = $pYnI$var$activeGroup.checkPull(this, activeSortable, $pYnI$var$dragEl, evt)) && group.checkPut(this, activeSortable, $pYnI$var$dragEl, evt))) {
      vertical = this._getDirection(evt, target) === 'vertical';
      dragRect = $O3AG$export$getRect($pYnI$var$dragEl);
      dragOverEvent('dragOverValid');
      if ($pYnI$export$default.eventCanceled) return completedFired;

      if (revert) {
        $pYnI$var$parentEl = $pYnI$var$rootEl; // actualization

        capture();

        this._hideClone();

        dragOverEvent('revert');

        if (!$pYnI$export$default.eventCanceled) {
          if ($pYnI$var$nextEl) {
            $pYnI$var$rootEl.insertBefore($pYnI$var$dragEl, $pYnI$var$nextEl);
          } else {
            $pYnI$var$rootEl.appendChild($pYnI$var$dragEl);
          }
        }

        return completed(true);
      }

      var elLastChild = $O3AG$export$lastChild(el, options.draggable);

      if (!elLastChild || $pYnI$var$_ghostIsLast(evt, vertical, this) && !elLastChild.animated) {
        // If already at end of list: Do not insert
        if (elLastChild === $pYnI$var$dragEl) {
          return completed(false);
        } // assign target only if condition is true


        if (elLastChild && el === evt.target) {
          target = elLastChild;
        }

        if (target) {
          targetRect = $O3AG$export$getRect(target);
        }

        if ($pYnI$var$_onMove($pYnI$var$rootEl, el, $pYnI$var$dragEl, dragRect, target, targetRect, evt, !!target) !== false) {
          capture();
          el.appendChild($pYnI$var$dragEl);
          $pYnI$var$parentEl = el; // actualization

          changed();
          return completed(true);
        }
      } else if (target.parentNode === el) {
        targetRect = $O3AG$export$getRect(target);
        var direction = 0,
            targetBeforeFirstSwap,
            differentLevel = $pYnI$var$dragEl.parentNode !== el,
            differentRowCol = !$pYnI$var$_dragElInRowColumn($pYnI$var$dragEl.animated && $pYnI$var$dragEl.toRect || dragRect, target.animated && target.toRect || targetRect, vertical),
            side1 = vertical ? 'top' : 'left',
            scrolledPastTop = $O3AG$export$isScrolledPast(target, 'top', 'top') || $O3AG$export$isScrolledPast($pYnI$var$dragEl, 'top', 'top'),
            scrollBefore = scrolledPastTop ? scrolledPastTop.scrollTop : void 0;

        if ($pYnI$var$lastTarget !== target) {
          targetBeforeFirstSwap = targetRect[side1];
          $pYnI$var$pastFirstInvertThresh = false;
          $pYnI$var$isCircumstantialInvert = !differentRowCol && options.invertSwap || differentLevel;
        }

        direction = $pYnI$var$_getSwapDirection(evt, target, targetRect, vertical, differentRowCol ? 1 : options.swapThreshold, options.invertedSwapThreshold == null ? options.swapThreshold : options.invertedSwapThreshold, $pYnI$var$isCircumstantialInvert, $pYnI$var$lastTarget === target);
        var sibling;

        if (direction !== 0) {
          // Check if target is beside dragEl in respective direction (ignoring hidden elements)
          var dragIndex = $O3AG$export$index($pYnI$var$dragEl);

          do {
            dragIndex -= direction;
            sibling = $pYnI$var$parentEl.children[dragIndex];
          } while (sibling && ($O3AG$export$css(sibling, 'display') === 'none' || sibling === $pYnI$var$ghostEl));
        } // If dragEl is already beside target: Do not insert


        if (direction === 0 || sibling === target) {
          return completed(false);
        }

        $pYnI$var$lastTarget = target;
        $pYnI$var$lastDirection = direction;
        var nextSibling = target.nextElementSibling,
            after = false;
        after = direction === 1;
        var moveVector = $pYnI$var$_onMove($pYnI$var$rootEl, el, $pYnI$var$dragEl, dragRect, target, targetRect, evt, after);

        if (moveVector !== false) {
          if (moveVector === 1 || moveVector === -1) {
            after = moveVector === 1;
          }

          $pYnI$var$_silent = true;
          setTimeout($pYnI$var$_unsilent, 30);
          capture();

          if (after && !nextSibling) {
            el.appendChild($pYnI$var$dragEl);
          } else {
            target.parentNode.insertBefore($pYnI$var$dragEl, after ? nextSibling : target);
          } // Undo chrome's scroll adjustment (has no effect on other browsers)


          if (scrolledPastTop) {
            $O3AG$export$scrollBy(scrolledPastTop, 0, scrollBefore - scrolledPastTop.scrollTop);
          }

          $pYnI$var$parentEl = $pYnI$var$dragEl.parentNode; // actualization
          // must be done before animation

          if (targetBeforeFirstSwap !== undefined && !$pYnI$var$isCircumstantialInvert) {
            $pYnI$var$targetMoveDistance = Math.abs(targetBeforeFirstSwap - $O3AG$export$getRect(target)[side1]);
          }

          changed();
          return completed(true);
        }
      }

      if (el.contains($pYnI$var$dragEl)) {
        return completed(false);
      }
    }

    return false;
  },
  _ignoreWhileAnimating: null,
  _offMoveEvents: function _offMoveEvents() {
    $O3AG$export$off(document, 'mousemove', this._onTouchMove);
    $O3AG$export$off(document, 'touchmove', this._onTouchMove);
    $O3AG$export$off(document, 'pointermove', this._onTouchMove);
    $O3AG$export$off(document, 'dragover', $pYnI$var$nearestEmptyInsertDetectEvent);
    $O3AG$export$off(document, 'mousemove', $pYnI$var$nearestEmptyInsertDetectEvent);
    $O3AG$export$off(document, 'touchmove', $pYnI$var$nearestEmptyInsertDetectEvent);
  },
  _offUpEvents: function _offUpEvents() {
    var ownerDocument = this.el.ownerDocument;
    $O3AG$export$off(ownerDocument, 'mouseup', this._onDrop);
    $O3AG$export$off(ownerDocument, 'touchend', this._onDrop);
    $O3AG$export$off(ownerDocument, 'pointerup', this._onDrop);
    $O3AG$export$off(ownerDocument, 'touchcancel', this._onDrop);
    $O3AG$export$off(document, 'selectstart', this);
  },
  _onDrop: function _onDrop(
  /**Event*/
  evt) {
    var el = this.el,
        options = this.options; // Get the index of the dragged element within its parent

    $pYnI$var$newIndex = $O3AG$export$index($pYnI$var$dragEl);
    $pYnI$var$newDraggableIndex = $O3AG$export$index($pYnI$var$dragEl, options.draggable);
    $pYnI$var$pluginEvent('drop', this, {
      evt: evt
    });
    $pYnI$var$parentEl = $pYnI$var$dragEl && $pYnI$var$dragEl.parentNode; // Get again after plugin event

    $pYnI$var$newIndex = $O3AG$export$index($pYnI$var$dragEl);
    $pYnI$var$newDraggableIndex = $O3AG$export$index($pYnI$var$dragEl, options.draggable);

    if ($pYnI$export$default.eventCanceled) {
      this._nulling();

      return;
    }

    $pYnI$var$awaitingDragStarted = false;
    $pYnI$var$isCircumstantialInvert = false;
    $pYnI$var$pastFirstInvertThresh = false;
    clearInterval(this._loopId);
    clearTimeout(this._dragStartTimer);
    $pYnI$var$_cancelNextTick(this.cloneId);
    $pYnI$var$_cancelNextTick(this._dragStartId); // Unbind events

    if (this.nativeDraggable) {
      $O3AG$export$off(document, 'drop', this);
      $O3AG$export$off(el, 'dragstart', this._onDragStart);
    }

    this._offMoveEvents();

    this._offUpEvents();

    if ($jXvt$export$Safari) {
      $O3AG$export$css(document.body, 'user-select', '');
    }

    $O3AG$export$css($pYnI$var$dragEl, 'transform', '');

    if (evt) {
      if ($pYnI$var$moved) {
        evt.cancelable && evt.preventDefault();
        !options.dropBubble && evt.stopPropagation();
      }

      $pYnI$var$ghostEl && $pYnI$var$ghostEl.parentNode && $pYnI$var$ghostEl.parentNode.removeChild($pYnI$var$ghostEl);

      if ($pYnI$var$rootEl === $pYnI$var$parentEl || $pYnI$var$putSortable && $pYnI$var$putSortable.lastPutMode !== 'clone') {
        // Remove clone(s)
        $pYnI$var$cloneEl && $pYnI$var$cloneEl.parentNode && $pYnI$var$cloneEl.parentNode.removeChild($pYnI$var$cloneEl);
      }

      if ($pYnI$var$dragEl) {
        if (this.nativeDraggable) {
          $O3AG$export$off($pYnI$var$dragEl, 'dragend', this);
        }

        $pYnI$var$_disableDraggable($pYnI$var$dragEl);
        $pYnI$var$dragEl.style['will-change'] = ''; // Remove classes
        // ghostClass is added in dragStarted

        if ($pYnI$var$moved && !$pYnI$var$awaitingDragStarted) {
          $O3AG$export$toggleClass($pYnI$var$dragEl, $pYnI$var$putSortable ? $pYnI$var$putSortable.options.ghostClass : this.options.ghostClass, false);
        }

        $O3AG$export$toggleClass($pYnI$var$dragEl, this.options.chosenClass, false); // Drag stop event

        $pYnI$var$_dispatchEvent({
          sortable: this,
          name: 'unchoose',
          toEl: $pYnI$var$parentEl,
          newIndex: null,
          newDraggableIndex: null,
          originalEvent: evt
        });

        if ($pYnI$var$rootEl !== $pYnI$var$parentEl) {
          if ($pYnI$var$newIndex >= 0) {
            // Add event
            $pYnI$var$_dispatchEvent({
              rootEl: $pYnI$var$parentEl,
              name: 'add',
              toEl: $pYnI$var$parentEl,
              fromEl: $pYnI$var$rootEl,
              originalEvent: evt
            }); // Remove event

            $pYnI$var$_dispatchEvent({
              sortable: this,
              name: 'remove',
              toEl: $pYnI$var$parentEl,
              originalEvent: evt
            }); // drag from one list and drop into another

            $pYnI$var$_dispatchEvent({
              rootEl: $pYnI$var$parentEl,
              name: 'sort',
              toEl: $pYnI$var$parentEl,
              fromEl: $pYnI$var$rootEl,
              originalEvent: evt
            });
            $pYnI$var$_dispatchEvent({
              sortable: this,
              name: 'sort',
              toEl: $pYnI$var$parentEl,
              originalEvent: evt
            });
          }

          $pYnI$var$putSortable && $pYnI$var$putSortable.save();
        } else {
          if ($pYnI$var$newIndex !== $pYnI$var$oldIndex) {
            if ($pYnI$var$newIndex >= 0) {
              // drag & drop within the same list
              $pYnI$var$_dispatchEvent({
                sortable: this,
                name: 'update',
                toEl: $pYnI$var$parentEl,
                originalEvent: evt
              });
              $pYnI$var$_dispatchEvent({
                sortable: this,
                name: 'sort',
                toEl: $pYnI$var$parentEl,
                originalEvent: evt
              });
            }
          }
        }

        if ($pYnI$export$default.active) {
          /* jshint eqnull:true */
          if ($pYnI$var$newIndex == null || $pYnI$var$newIndex === -1) {
            $pYnI$var$newIndex = $pYnI$var$oldIndex;
            $pYnI$var$newDraggableIndex = $pYnI$var$oldDraggableIndex;
          }

          $pYnI$var$_dispatchEvent({
            sortable: this,
            name: 'end',
            toEl: $pYnI$var$parentEl,
            originalEvent: evt
          }); // Save sorting

          this.save();
        }
      }
    }

    this._nulling();
  },
  _nulling: function _nulling() {
    $pYnI$var$pluginEvent('nulling', this);
    $pYnI$var$rootEl = $pYnI$var$dragEl = $pYnI$var$parentEl = $pYnI$var$ghostEl = $pYnI$var$nextEl = $pYnI$var$cloneEl = $pYnI$var$lastDownEl = $pYnI$var$cloneHidden = $pYnI$var$tapEvt = $pYnI$var$touchEvt = $pYnI$var$moved = $pYnI$var$newIndex = $pYnI$var$newDraggableIndex = $pYnI$var$oldIndex = $pYnI$var$oldDraggableIndex = $pYnI$var$lastTarget = $pYnI$var$lastDirection = $pYnI$var$putSortable = $pYnI$var$activeGroup = $pYnI$export$default.dragged = $pYnI$export$default.ghost = $pYnI$export$default.clone = $pYnI$export$default.active = null;
    $pYnI$var$savedInputChecked.forEach(function (el) {
      el.checked = true;
    });
    $pYnI$var$savedInputChecked.length = $pYnI$var$lastDx = $pYnI$var$lastDy = 0;
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
        if ($pYnI$var$dragEl) {
          this._onDragOver(evt);

          $pYnI$var$_globalDragOver(evt);
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

      if ($O3AG$export$closest(el, options.draggable, this.el, false)) {
        order.push(el.getAttribute(options.dataIdAttr) || $pYnI$var$_generateId(el));
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

      if ($O3AG$export$closest(el, this.options.draggable, rootEl, false)) {
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
    return $O3AG$export$closest(el, selector || this.options.draggable, this.el, false);
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
      var modifiedValue = $wKiJ$export$default.modifyOption(this, name, value);

      if (typeof modifiedValue !== 'undefined') {
        options[name] = modifiedValue;
      } else {
        options[name] = value;
      }

      if (name === 'group') {
        $pYnI$var$_prepareGroup(options);
      }
    }
  },

  /**
   * Destroy
   */
  destroy: function destroy() {
    $pYnI$var$pluginEvent('destroy', this);
    var el = this.el;
    el[$O3AG$export$expando] = null;
    $O3AG$export$off(el, 'mousedown', this._onTapStart);
    $O3AG$export$off(el, 'touchstart', this._onTapStart);
    $O3AG$export$off(el, 'pointerdown', this._onTapStart);

    if (this.nativeDraggable) {
      $O3AG$export$off(el, 'dragover', this);
      $O3AG$export$off(el, 'dragenter', this);
    } // Remove draggable attributes


    Array.prototype.forEach.call(el.querySelectorAll('[draggable]'), function (el) {
      el.removeAttribute('draggable');
    });

    this._onDrop();

    this._disableDelayedDragEvents();

    $pYnI$var$sortables.splice($pYnI$var$sortables.indexOf(this.el), 1);
    this.el = el = null;
  },
  _hideClone: function _hideClone() {
    if (!$pYnI$var$cloneHidden) {
      $pYnI$var$pluginEvent('hideClone', this);
      if ($pYnI$export$default.eventCanceled) return;
      $O3AG$export$css($pYnI$var$cloneEl, 'display', 'none');

      if (this.options.removeCloneOnHide && $pYnI$var$cloneEl.parentNode) {
        $pYnI$var$cloneEl.parentNode.removeChild($pYnI$var$cloneEl);
      }

      $pYnI$var$cloneHidden = true;
    }
  },
  _showClone: function _showClone(putSortable) {
    if (putSortable.lastPutMode !== 'clone') {
      this._hideClone();

      return;
    }

    if ($pYnI$var$cloneHidden) {
      $pYnI$var$pluginEvent('showClone', this);
      if ($pYnI$export$default.eventCanceled) return; // show clone at dragEl or original position

      if ($pYnI$var$dragEl.parentNode == $pYnI$var$rootEl && !this.options.group.revertClone) {
        $pYnI$var$rootEl.insertBefore($pYnI$var$cloneEl, $pYnI$var$dragEl);
      } else if ($pYnI$var$nextEl) {
        $pYnI$var$rootEl.insertBefore($pYnI$var$cloneEl, $pYnI$var$nextEl);
      } else {
        $pYnI$var$rootEl.appendChild($pYnI$var$cloneEl);
      }

      if (this.options.group.revertClone) {
        this.animate($pYnI$var$dragEl, $pYnI$var$cloneEl);
      }

      $O3AG$export$css($pYnI$var$cloneEl, 'display', '');
      $pYnI$var$cloneHidden = false;
    }
  }
};

function $pYnI$var$_globalDragOver(
/**Event*/
evt) {
  if (evt.dataTransfer) {
    evt.dataTransfer.dropEffect = 'move';
  }

  evt.cancelable && evt.preventDefault();
}

function $pYnI$var$_onMove(fromEl, toEl, dragEl, dragRect, targetEl, targetRect, originalEvent, willInsertAfter) {
  var evt,
      sortable = fromEl[$O3AG$export$expando],
      onMoveFn = sortable.options.onMove,
      retVal; // Support for new CustomEvent feature

  if (window.CustomEvent && !$jXvt$export$IE11OrLess && !$jXvt$export$Edge) {
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
  evt.relatedRect = targetRect || $O3AG$export$getRect(toEl);
  evt.willInsertAfter = willInsertAfter;
  evt.originalEvent = originalEvent;
  fromEl.dispatchEvent(evt);

  if (onMoveFn) {
    retVal = onMoveFn.call(sortable, evt, originalEvent);
  }

  return retVal;
}

function $pYnI$var$_disableDraggable(el) {
  el.draggable = false;
}

function $pYnI$var$_unsilent() {
  $pYnI$var$_silent = false;
}

function $pYnI$var$_ghostIsLast(evt, vertical, sortable) {
  var rect = $O3AG$export$getRect($O3AG$export$lastChild(sortable.el, sortable.options.draggable));
  var spacer = 10;
  return vertical ? evt.clientX > rect.right + spacer || evt.clientX <= rect.right && evt.clientY > rect.bottom && evt.clientX >= rect.left : evt.clientX > rect.right && evt.clientY > rect.top || evt.clientX <= rect.right && evt.clientY > rect.bottom + spacer;
}

function $pYnI$var$_getSwapDirection(evt, target, targetRect, vertical, swapThreshold, invertedSwapThreshold, invertSwap, isLastTarget) {
  var mouseOnAxis = vertical ? evt.clientY : evt.clientX,
      targetLength = vertical ? targetRect.height : targetRect.width,
      targetS1 = vertical ? targetRect.top : targetRect.left,
      targetS2 = vertical ? targetRect.bottom : targetRect.right,
      invert = false;

  if (!invertSwap) {
    // Never invert or create dragEl shadow when target movemenet causes mouse to move past the end of regular swapThreshold
    if (isLastTarget && $pYnI$var$targetMoveDistance < targetLength * swapThreshold) {
      // multiplied only by swapThreshold because mouse will already be inside target by (1 - threshold) * targetLength / 2
      // check if past first invert threshold on side opposite of lastDirection
      if (!$pYnI$var$pastFirstInvertThresh && ($pYnI$var$lastDirection === 1 ? mouseOnAxis > targetS1 + targetLength * invertedSwapThreshold / 2 : mouseOnAxis < targetS2 - targetLength * invertedSwapThreshold / 2)) {
        // past first invert threshold, do not restrict inverted threshold to dragEl shadow
        $pYnI$var$pastFirstInvertThresh = true;
      }

      if (!$pYnI$var$pastFirstInvertThresh) {
        // dragEl shadow (target move distance shadow)
        if ($pYnI$var$lastDirection === 1 ? mouseOnAxis < targetS1 + $pYnI$var$targetMoveDistance // over dragEl shadow
        : mouseOnAxis > targetS2 - $pYnI$var$targetMoveDistance) {
          return -$pYnI$var$lastDirection;
        }
      } else {
        invert = true;
      }
    } else {
      // Regular
      if (mouseOnAxis > targetS1 + targetLength * (1 - swapThreshold) / 2 && mouseOnAxis < targetS2 - targetLength * (1 - swapThreshold) / 2) {
        return $pYnI$var$_getInsertDirection(target);
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


function $pYnI$var$_getInsertDirection(target) {
  if ($O3AG$export$index($pYnI$var$dragEl) < $O3AG$export$index(target)) {
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


function $pYnI$var$_generateId(el) {
  var str = el.tagName + el.className + el.src + el.href + el.textContent,
      i = str.length,
      sum = 0;

  while (i--) {
    sum += str.charCodeAt(i);
  }

  return sum.toString(36);
}

function $pYnI$var$_saveInputCheckedState(root) {
  $pYnI$var$savedInputChecked.length = 0;
  var inputs = root.getElementsByTagName('input');
  var idx = inputs.length;

  while (idx--) {
    var el = inputs[idx];
    el.checked && $pYnI$var$savedInputChecked.push(el);
  }
}

function $pYnI$var$_nextTick(fn) {
  return setTimeout(fn, 0);
}

function $pYnI$var$_cancelNextTick(id) {
  return clearTimeout(id);
} // Fixed #973:


if ($pYnI$var$documentExists) {
  $O3AG$export$on(document, 'touchmove', function (evt) {
    if (($pYnI$export$default.active || $pYnI$var$awaitingDragStarted) && evt.cancelable) {
      evt.preventDefault();
    }
  });
} // Export utils


$pYnI$export$default.utils = {
  on: $O3AG$export$on,
  off: $O3AG$export$off,
  css: $O3AG$export$css,
  find: $O3AG$export$find,
  is: function is(el, selector) {
    return !!$O3AG$export$closest(el, selector, el, false);
  },
  extend: $O3AG$export$extend,
  throttle: $O3AG$export$throttle,
  closest: $O3AG$export$closest,
  toggleClass: $O3AG$export$toggleClass,
  clone: $O3AG$export$clone,
  index: $O3AG$export$index,
  nextTick: $pYnI$var$_nextTick,
  cancelNextTick: $pYnI$var$_cancelNextTick,
  detectDirection: $pYnI$var$_detectDirection,
  getChild: $O3AG$export$getChild
};
/**
 * Get the Sortable instance of an element
 * @param  {HTMLElement} element The element
 * @return {Sortable|undefined}         The instance of Sortable
 */

$pYnI$export$default.get = function (element) {
  return element[$O3AG$export$expando];
};
/**
 * Mount a plugin to Sortable
 * @param  {...SortablePlugin|SortablePlugin[]} plugins       Plugins being mounted
 */


$pYnI$export$default.mount = function () {
  for (var _len = arguments.length, plugins = new Array(_len), _key = 0; _key < _len; _key++) {
    plugins[_key] = arguments[_key];
  }

  if (plugins[0].constructor === Array) plugins = plugins[0];
  plugins.forEach(function (plugin) {
    if (!plugin.prototype || !plugin.prototype.constructor) {
      throw "Sortable: Mounted plugin must be a constructor function, not ".concat({}.toString.call(plugin));
    }

    if (plugin.utils) $pYnI$export$default.utils = $pYnI$var$_objectSpread($pYnI$var$_objectSpread({}, $pYnI$export$default.utils), plugin.utils);
    $wKiJ$export$default.mount(plugin);
  });
};
/**
 * Create sortable instance
 * @param {HTMLElement}  el
 * @param {Object}      [options]
 */


$pYnI$export$default.create = function (el, options) {
  return new $pYnI$export$default(el, options);
}; // Export


$pYnI$export$default.version = $EHrm$exports.version;
var $blm2$var$autoScrolls = [],
    $blm2$var$scrollEl,
    $blm2$var$scrollRootEl,
    $blm2$var$scrolling = false,
    $blm2$var$lastAutoScrollX,
    $blm2$var$lastAutoScrollY,
    $blm2$var$touchEvt,
    $blm2$var$pointerElemChangedInterval;

function $blm2$export$default() {
  function AutoScroll() {
    this.defaults = {
      scroll: true,
      scrollSensitivity: 30,
      scrollSpeed: 10,
      bubbleScroll: true
    }; // Bind all private methods

    for (var fn in this) {
      if (fn.charAt(0) === '_' && typeof this[fn] === 'function') {
        this[fn] = this[fn].bind(this);
      }
    }
  }

  AutoScroll.prototype = {
    dragStarted: function dragStarted(_ref) {
      var originalEvent = _ref.originalEvent;

      if (this.sortable.nativeDraggable) {
        $O3AG$export$on(document, 'dragover', this._handleAutoScroll);
      } else {
        if (this.options.supportPointer) {
          $O3AG$export$on(document, 'pointermove', this._handleFallbackAutoScroll);
        } else if (originalEvent.touches) {
          $O3AG$export$on(document, 'touchmove', this._handleFallbackAutoScroll);
        } else {
          $O3AG$export$on(document, 'mousemove', this._handleFallbackAutoScroll);
        }
      }
    },
    dragOverCompleted: function dragOverCompleted(_ref2) {
      var originalEvent = _ref2.originalEvent; // For when bubbling is canceled and using fallback (fallback 'touchmove' always reached)

      if (!this.options.dragOverBubble && !originalEvent.rootEl) {
        this._handleAutoScroll(originalEvent);
      }
    },
    drop: function drop() {
      if (this.sortable.nativeDraggable) {
        $O3AG$export$off(document, 'dragover', this._handleAutoScroll);
      } else {
        $O3AG$export$off(document, 'pointermove', this._handleFallbackAutoScroll);
        $O3AG$export$off(document, 'touchmove', this._handleFallbackAutoScroll);
        $O3AG$export$off(document, 'mousemove', this._handleFallbackAutoScroll);
      }

      $blm2$var$clearPointerElemChangedInterval();
      $blm2$var$clearAutoScrolls();
      $O3AG$export$cancelThrottle();
    },
    nulling: function nulling() {
      $blm2$var$touchEvt = $blm2$var$scrollRootEl = $blm2$var$scrollEl = $blm2$var$scrolling = $blm2$var$pointerElemChangedInterval = $blm2$var$lastAutoScrollX = $blm2$var$lastAutoScrollY = null;
      $blm2$var$autoScrolls.length = 0;
    },
    _handleFallbackAutoScroll: function _handleFallbackAutoScroll(evt) {
      this._handleAutoScroll(evt, true);
    },
    _handleAutoScroll: function _handleAutoScroll(evt, fallback) {
      var _this = this;

      var x = (evt.touches ? evt.touches[0] : evt).clientX,
          y = (evt.touches ? evt.touches[0] : evt).clientY,
          elem = document.elementFromPoint(x, y);
      $blm2$var$touchEvt = evt; // IE does not seem to have native autoscroll,
      // Edge's autoscroll seems too conditional,
      // MACOS Safari does not have autoscroll,
      // Firefox and Chrome are good

      if (fallback || $jXvt$export$Edge || $jXvt$export$IE11OrLess || $jXvt$export$Safari) {
        $blm2$var$autoScroll(evt, this.options, elem, fallback); // Listener for pointer element change

        var ogElemScroller = $O3AG$export$getParentAutoScrollElement(elem, true);

        if ($blm2$var$scrolling && (!$blm2$var$pointerElemChangedInterval || x !== $blm2$var$lastAutoScrollX || y !== $blm2$var$lastAutoScrollY)) {
          $blm2$var$pointerElemChangedInterval && $blm2$var$clearPointerElemChangedInterval(); // Detect for pointer elem change, emulating native DnD behaviour

          $blm2$var$pointerElemChangedInterval = setInterval(function () {
            var newElem = $O3AG$export$getParentAutoScrollElement(document.elementFromPoint(x, y), true);

            if (newElem !== ogElemScroller) {
              ogElemScroller = newElem;
              $blm2$var$clearAutoScrolls();
            }

            $blm2$var$autoScroll(evt, _this.options, newElem, fallback);
          }, 10);
          $blm2$var$lastAutoScrollX = x;
          $blm2$var$lastAutoScrollY = y;
        }
      } else {
        // if DnD is enabled (and browser has good autoscrolling), first autoscroll will already scroll, so get parent autoscroll of first autoscroll
        if (!this.options.bubbleScroll || $O3AG$export$getParentAutoScrollElement(elem, true) === $O3AG$export$getWindowScrollingElement()) {
          $blm2$var$clearAutoScrolls();
          return;
        }

        $blm2$var$autoScroll(evt, this.options, $O3AG$export$getParentAutoScrollElement(elem, false), false);
      }
    }
  };
  return Object.assign(AutoScroll, {
    pluginName: 'scroll',
    initializeByDefault: true
  });
}

function $blm2$var$clearAutoScrolls() {
  $blm2$var$autoScrolls.forEach(function (autoScroll) {
    clearInterval(autoScroll.pid);
  });
  $blm2$var$autoScrolls = [];
}

function $blm2$var$clearPointerElemChangedInterval() {
  clearInterval($blm2$var$pointerElemChangedInterval);
}

var $blm2$var$autoScroll = $O3AG$export$throttle(function (evt, options, rootEl, isFallback) {
  // Bug: https://bugzilla.mozilla.org/show_bug.cgi?id=505521
  if (!options.scroll) return;
  var x = (evt.touches ? evt.touches[0] : evt).clientX,
      y = (evt.touches ? evt.touches[0] : evt).clientY,
      sens = options.scrollSensitivity,
      speed = options.scrollSpeed,
      winScroller = $O3AG$export$getWindowScrollingElement();
  var scrollThisInstance = false,
      scrollCustomFn; // New scroll root, set scrollEl

  if ($blm2$var$scrollRootEl !== rootEl) {
    $blm2$var$scrollRootEl = rootEl;
    $blm2$var$clearAutoScrolls();
    $blm2$var$scrollEl = options.scroll;
    scrollCustomFn = options.scrollFn;

    if ($blm2$var$scrollEl === true) {
      $blm2$var$scrollEl = $O3AG$export$getParentAutoScrollElement(rootEl, true);
    }
  }

  var layersOut = 0;
  var currentParent = $blm2$var$scrollEl;

  do {
    var el = currentParent,
        rect = $O3AG$export$getRect(el),
        top = rect.top,
        bottom = rect.bottom,
        left = rect.left,
        right = rect.right,
        width = rect.width,
        height = rect.height,
        canScrollX = void 0,
        canScrollY = void 0,
        scrollWidth = el.scrollWidth,
        scrollHeight = el.scrollHeight,
        elCSS = $O3AG$export$css(el),
        scrollPosX = el.scrollLeft,
        scrollPosY = el.scrollTop;

    if (el === winScroller) {
      canScrollX = width < scrollWidth && (elCSS.overflowX === 'auto' || elCSS.overflowX === 'scroll' || elCSS.overflowX === 'visible');
      canScrollY = height < scrollHeight && (elCSS.overflowY === 'auto' || elCSS.overflowY === 'scroll' || elCSS.overflowY === 'visible');
    } else {
      canScrollX = width < scrollWidth && (elCSS.overflowX === 'auto' || elCSS.overflowX === 'scroll');
      canScrollY = height < scrollHeight && (elCSS.overflowY === 'auto' || elCSS.overflowY === 'scroll');
    }

    var vx = canScrollX && (Math.abs(right - x) <= sens && scrollPosX + width < scrollWidth) - (Math.abs(left - x) <= sens && !!scrollPosX);
    var vy = canScrollY && (Math.abs(bottom - y) <= sens && scrollPosY + height < scrollHeight) - (Math.abs(top - y) <= sens && !!scrollPosY);

    if (!$blm2$var$autoScrolls[layersOut]) {
      for (var i = 0; i <= layersOut; i++) {
        if (!$blm2$var$autoScrolls[i]) {
          $blm2$var$autoScrolls[i] = {};
        }
      }
    }

    if ($blm2$var$autoScrolls[layersOut].vx != vx || $blm2$var$autoScrolls[layersOut].vy != vy || $blm2$var$autoScrolls[layersOut].el !== el) {
      $blm2$var$autoScrolls[layersOut].el = el;
      $blm2$var$autoScrolls[layersOut].vx = vx;
      $blm2$var$autoScrolls[layersOut].vy = vy;
      clearInterval($blm2$var$autoScrolls[layersOut].pid);

      if (vx != 0 || vy != 0) {
        scrollThisInstance = true;
        /* jshint loopfunc:true */

        $blm2$var$autoScrolls[layersOut].pid = setInterval(function () {
          // emulate drag over during autoscroll (fallback), emulating native DnD behaviour
          if (isFallback && this.layer === 0) {
            $pYnI$export$default.active._onTouchMove($blm2$var$touchEvt); // To move ghost if it is positioned absolutely

          }

          var scrollOffsetY = $blm2$var$autoScrolls[this.layer].vy ? $blm2$var$autoScrolls[this.layer].vy * speed : 0;
          var scrollOffsetX = $blm2$var$autoScrolls[this.layer].vx ? $blm2$var$autoScrolls[this.layer].vx * speed : 0;

          if (typeof scrollCustomFn === 'function') {
            if (scrollCustomFn.call($pYnI$export$default.dragged.parentNode[$O3AG$export$expando], scrollOffsetX, scrollOffsetY, evt, $blm2$var$touchEvt, $blm2$var$autoScrolls[this.layer].el) !== 'continue') {
              return;
            }
          }

          $O3AG$export$scrollBy($blm2$var$autoScrolls[this.layer].el, scrollOffsetX, scrollOffsetY);
        }.bind({
          layer: layersOut
        }), 24);
      }
    }

    layersOut++;
  } while (options.bubbleScroll && currentParent !== winScroller && (currentParent = $O3AG$export$getParentAutoScrollElement(currentParent, false)));

  $blm2$var$scrolling = scrollThisInstance; // in case another function catches scrolling as false in between when it is not
}, 30);

var $nFhH$var$drop = function drop(_ref) {
  var originalEvent = _ref.originalEvent,
      putSortable = _ref.putSortable,
      dragEl = _ref.dragEl,
      activeSortable = _ref.activeSortable,
      dispatchSortableEvent = _ref.dispatchSortableEvent,
      hideGhostForTarget = _ref.hideGhostForTarget,
      unhideGhostForTarget = _ref.unhideGhostForTarget;
  if (!originalEvent) return;
  var toSortable = putSortable || activeSortable;
  hideGhostForTarget();
  var touch = originalEvent.changedTouches && originalEvent.changedTouches.length ? originalEvent.changedTouches[0] : originalEvent;
  var target = document.elementFromPoint(touch.clientX, touch.clientY);
  unhideGhostForTarget();

  if (toSortable && !toSortable.el.contains(target)) {
    dispatchSortableEvent('spill');
    this.onSpill({
      dragEl: dragEl,
      putSortable: putSortable
    });
  }
};

function $nFhH$export$RevertOnSpill() {}

$nFhH$export$RevertOnSpill.prototype = {
  startIndex: null,
  dragStart: function dragStart(_ref2) {
    var oldDraggableIndex = _ref2.oldDraggableIndex;
    this.startIndex = oldDraggableIndex;
  },
  onSpill: function onSpill(_ref3) {
    var dragEl = _ref3.dragEl,
        putSortable = _ref3.putSortable;
    this.sortable.captureAnimationState();

    if (putSortable) {
      putSortable.captureAnimationState();
    }

    var nextSibling = $O3AG$export$getChild(this.sortable.el, this.startIndex, this.options);

    if (nextSibling) {
      this.sortable.el.insertBefore(dragEl, nextSibling);
    } else {
      this.sortable.el.appendChild(dragEl);
    }

    this.sortable.animateAll();

    if (putSortable) {
      putSortable.animateAll();
    }
  },
  drop: $nFhH$var$drop
};
Object.assign($nFhH$export$RevertOnSpill, {
  pluginName: 'revertOnSpill'
});

function $nFhH$export$RemoveOnSpill() {}

$nFhH$export$RemoveOnSpill.prototype = {
  onSpill: function onSpill(_ref4) {
    var dragEl = _ref4.dragEl,
        putSortable = _ref4.putSortable;
    var parentSortable = putSortable || this.sortable;
    parentSortable.captureAnimationState();
    dragEl.parentNode && dragEl.parentNode.removeChild(dragEl);
    parentSortable.animateAll();
  },
  drop: $nFhH$var$drop
};
Object.assign($nFhH$export$RemoveOnSpill, {
  pluginName: 'removeOnSpill'
});
var $XnBf$var$lastSwapEl;

function $XnBf$export$default() {
  function Swap() {
    this.defaults = {
      swapClass: 'sortable-swap-highlight'
    };
  }

  Swap.prototype = {
    dragStart: function dragStart(_ref) {
      var dragEl = _ref.dragEl;
      $XnBf$var$lastSwapEl = dragEl;
    },
    dragOverValid: function dragOverValid(_ref2) {
      var completed = _ref2.completed,
          target = _ref2.target,
          onMove = _ref2.onMove,
          activeSortable = _ref2.activeSortable,
          changed = _ref2.changed,
          cancel = _ref2.cancel;
      if (!activeSortable.options.swap) return;
      var el = this.sortable.el,
          options = this.options;

      if (target && target !== el) {
        var prevSwapEl = $XnBf$var$lastSwapEl;

        if (onMove(target) !== false) {
          $O3AG$export$toggleClass(target, options.swapClass, true);
          $XnBf$var$lastSwapEl = target;
        } else {
          $XnBf$var$lastSwapEl = null;
        }

        if (prevSwapEl && prevSwapEl !== $XnBf$var$lastSwapEl) {
          $O3AG$export$toggleClass(prevSwapEl, options.swapClass, false);
        }
      }

      changed();
      completed(true);
      cancel();
    },
    drop: function drop(_ref3) {
      var activeSortable = _ref3.activeSortable,
          putSortable = _ref3.putSortable,
          dragEl = _ref3.dragEl;
      var toSortable = putSortable || this.sortable;
      var options = this.options;
      $XnBf$var$lastSwapEl && $O3AG$export$toggleClass($XnBf$var$lastSwapEl, options.swapClass, false);

      if ($XnBf$var$lastSwapEl && (options.swap || putSortable && putSortable.options.swap)) {
        if (dragEl !== $XnBf$var$lastSwapEl) {
          toSortable.captureAnimationState();
          if (toSortable !== activeSortable) activeSortable.captureAnimationState();
          $XnBf$var$swapNodes(dragEl, $XnBf$var$lastSwapEl);
          toSortable.animateAll();
          if (toSortable !== activeSortable) activeSortable.animateAll();
        }
      }
    },
    nulling: function nulling() {
      $XnBf$var$lastSwapEl = null;
    }
  };
  return Object.assign(Swap, {
    pluginName: 'swap',
    eventProperties: function eventProperties() {
      return {
        swapItem: $XnBf$var$lastSwapEl
      };
    }
  });
}

function $XnBf$var$swapNodes(n1, n2) {
  var p1 = n1.parentNode,
      p2 = n2.parentNode,
      i1,
      i2;
  if (!p1 || !p2 || p1.isEqualNode(n2) || p2.isEqualNode(n1)) return;
  i1 = $O3AG$export$index(n1);
  i2 = $O3AG$export$index(n2);

  if (p1.isEqualNode(p2) && i1 < i2) {
    i2++;
  }

  p1.insertBefore(n2, p1.children[i1]);
  p2.insertBefore(n1, p2.children[i2]);
}

function $Wg5j$var$_toConsumableArray(arr) {
  return $Wg5j$var$_arrayWithoutHoles(arr) || $Wg5j$var$_iterableToArray(arr) || $Wg5j$var$_unsupportedIterableToArray(arr) || $Wg5j$var$_nonIterableSpread();
}

function $Wg5j$var$_nonIterableSpread() {
  throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}

function $Wg5j$var$_unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return $Wg5j$var$_arrayLikeToArray(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return $Wg5j$var$_arrayLikeToArray(o, minLen);
}

function $Wg5j$var$_iterableToArray(iter) {
  if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter);
}

function $Wg5j$var$_arrayWithoutHoles(arr) {
  if (Array.isArray(arr)) return $Wg5j$var$_arrayLikeToArray(arr);
}

function $Wg5j$var$_arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;

  for (var i = 0, arr2 = new Array(len); i < len; i++) {
    arr2[i] = arr[i];
  }

  return arr2;
}

var $Wg5j$var$multiDragElements = [],
    $Wg5j$var$multiDragClones = [],
    $Wg5j$var$lastMultiDragSelect,
    // for selection with modifier key down (SHIFT)
$Wg5j$var$multiDragSortable,
    $Wg5j$var$initialFolding = false,
    // Initial multi-drag fold when drag started
$Wg5j$var$folding = false,
    // Folding any other time
$Wg5j$var$dragStarted = false,
    $Wg5j$var$dragEl,
    $Wg5j$var$clonesFromRect,
    $Wg5j$var$clonesHidden;

function $Wg5j$export$default() {
  function MultiDrag(sortable) {
    // Bind all private methods
    for (var fn in this) {
      if (fn.charAt(0) === '_' && typeof this[fn] === 'function') {
        this[fn] = this[fn].bind(this);
      }
    }

    if (sortable.options.supportPointer) {
      $O3AG$export$on(document, 'pointerup', this._deselectMultiDrag);
    } else {
      $O3AG$export$on(document, 'mouseup', this._deselectMultiDrag);
      $O3AG$export$on(document, 'touchend', this._deselectMultiDrag);
    }

    $O3AG$export$on(document, 'keydown', this._checkKeyDown);
    $O3AG$export$on(document, 'keyup', this._checkKeyUp);
    this.defaults = {
      selectedClass: 'sortable-selected',
      multiDragKey: null,
      setData: function setData(dataTransfer, dragEl) {
        var data = '';

        if ($Wg5j$var$multiDragElements.length && $Wg5j$var$multiDragSortable === sortable) {
          $Wg5j$var$multiDragElements.forEach(function (multiDragElement, i) {
            data += (!i ? '' : ', ') + multiDragElement.textContent;
          });
        } else {
          data = dragEl.textContent;
        }

        dataTransfer.setData('Text', data);
      }
    };
  }

  MultiDrag.prototype = {
    multiDragKeyDown: false,
    isMultiDrag: false,
    delayStartGlobal: function delayStartGlobal(_ref) {
      var dragged = _ref.dragEl;
      $Wg5j$var$dragEl = dragged;
    },
    delayEnded: function delayEnded() {
      this.isMultiDrag = ~$Wg5j$var$multiDragElements.indexOf($Wg5j$var$dragEl);
    },
    setupClone: function setupClone(_ref2) {
      var sortable = _ref2.sortable,
          cancel = _ref2.cancel;
      if (!this.isMultiDrag) return;

      for (var i = 0; i < $Wg5j$var$multiDragElements.length; i++) {
        $Wg5j$var$multiDragClones.push($O3AG$export$clone($Wg5j$var$multiDragElements[i]));
        $Wg5j$var$multiDragClones[i].sortableIndex = $Wg5j$var$multiDragElements[i].sortableIndex;
        $Wg5j$var$multiDragClones[i].draggable = false;
        $Wg5j$var$multiDragClones[i].style['will-change'] = '';
        $O3AG$export$toggleClass($Wg5j$var$multiDragClones[i], this.options.selectedClass, false);
        $Wg5j$var$multiDragElements[i] === $Wg5j$var$dragEl && $O3AG$export$toggleClass($Wg5j$var$multiDragClones[i], this.options.chosenClass, false);
      }

      sortable._hideClone();

      cancel();
    },
    clone: function clone(_ref3) {
      var sortable = _ref3.sortable,
          rootEl = _ref3.rootEl,
          dispatchSortableEvent = _ref3.dispatchSortableEvent,
          cancel = _ref3.cancel;
      if (!this.isMultiDrag) return;

      if (!this.options.removeCloneOnHide) {
        if ($Wg5j$var$multiDragElements.length && $Wg5j$var$multiDragSortable === sortable) {
          $Wg5j$var$insertMultiDragClones(true, rootEl);
          dispatchSortableEvent('clone');
          cancel();
        }
      }
    },
    showClone: function showClone(_ref4) {
      var cloneNowShown = _ref4.cloneNowShown,
          rootEl = _ref4.rootEl,
          cancel = _ref4.cancel;
      if (!this.isMultiDrag) return;
      $Wg5j$var$insertMultiDragClones(false, rootEl);
      $Wg5j$var$multiDragClones.forEach(function (clone) {
        $O3AG$export$css(clone, 'display', '');
      });
      cloneNowShown();
      $Wg5j$var$clonesHidden = false;
      cancel();
    },
    hideClone: function hideClone(_ref5) {
      var _this = this;

      var sortable = _ref5.sortable,
          cloneNowHidden = _ref5.cloneNowHidden,
          cancel = _ref5.cancel;
      if (!this.isMultiDrag) return;
      $Wg5j$var$multiDragClones.forEach(function (clone) {
        $O3AG$export$css(clone, 'display', 'none');

        if (_this.options.removeCloneOnHide && clone.parentNode) {
          clone.parentNode.removeChild(clone);
        }
      });
      cloneNowHidden();
      $Wg5j$var$clonesHidden = true;
      cancel();
    },
    dragStartGlobal: function dragStartGlobal(_ref6) {
      var sortable = _ref6.sortable;

      if (!this.isMultiDrag && $Wg5j$var$multiDragSortable) {
        $Wg5j$var$multiDragSortable.multiDrag._deselectMultiDrag();
      }

      $Wg5j$var$multiDragElements.forEach(function (multiDragElement) {
        multiDragElement.sortableIndex = $O3AG$export$index(multiDragElement);
      }); // Sort multi-drag elements

      $Wg5j$var$multiDragElements = $Wg5j$var$multiDragElements.sort(function (a, b) {
        return a.sortableIndex - b.sortableIndex;
      });
      $Wg5j$var$dragStarted = true;
    },
    dragStarted: function dragStarted(_ref7) {
      var _this2 = this;

      var sortable = _ref7.sortable;
      if (!this.isMultiDrag) return;

      if (this.options.sort) {
        // Capture rects,
        // hide multi drag elements (by positioning them absolute),
        // set multi drag elements rects to dragRect,
        // show multi drag elements,
        // animate to rects,
        // unset rects & remove from DOM
        sortable.captureAnimationState();

        if (this.options.animation) {
          $Wg5j$var$multiDragElements.forEach(function (multiDragElement) {
            if (multiDragElement === $Wg5j$var$dragEl) return;
            $O3AG$export$css(multiDragElement, 'position', 'absolute');
          });
          var dragRect = $O3AG$export$getRect($Wg5j$var$dragEl, false, true, true);
          $Wg5j$var$multiDragElements.forEach(function (multiDragElement) {
            if (multiDragElement === $Wg5j$var$dragEl) return;
            $O3AG$export$setRect(multiDragElement, dragRect);
          });
          $Wg5j$var$folding = true;
          $Wg5j$var$initialFolding = true;
        }
      }

      sortable.animateAll(function () {
        $Wg5j$var$folding = false;
        $Wg5j$var$initialFolding = false;

        if (_this2.options.animation) {
          $Wg5j$var$multiDragElements.forEach(function (multiDragElement) {
            $O3AG$export$unsetRect(multiDragElement);
          });
        } // Remove all auxiliary multidrag items from el, if sorting enabled


        if (_this2.options.sort) {
          $Wg5j$var$removeMultiDragElements();
        }
      });
    },
    dragOver: function dragOver(_ref8) {
      var target = _ref8.target,
          completed = _ref8.completed,
          cancel = _ref8.cancel;

      if ($Wg5j$var$folding && ~$Wg5j$var$multiDragElements.indexOf(target)) {
        completed(false);
        cancel();
      }
    },
    revert: function revert(_ref9) {
      var fromSortable = _ref9.fromSortable,
          rootEl = _ref9.rootEl,
          sortable = _ref9.sortable,
          dragRect = _ref9.dragRect;

      if ($Wg5j$var$multiDragElements.length > 1) {
        // Setup unfold animation
        $Wg5j$var$multiDragElements.forEach(function (multiDragElement) {
          sortable.addAnimationState({
            target: multiDragElement,
            rect: $Wg5j$var$folding ? $O3AG$export$getRect(multiDragElement) : dragRect
          });
          $O3AG$export$unsetRect(multiDragElement);
          multiDragElement.fromRect = dragRect;
          fromSortable.removeAnimationState(multiDragElement);
        });
        $Wg5j$var$folding = false;
        $Wg5j$var$insertMultiDragElements(!this.options.removeCloneOnHide, rootEl);
      }
    },
    dragOverCompleted: function dragOverCompleted(_ref10) {
      var sortable = _ref10.sortable,
          isOwner = _ref10.isOwner,
          insertion = _ref10.insertion,
          activeSortable = _ref10.activeSortable,
          parentEl = _ref10.parentEl,
          putSortable = _ref10.putSortable;
      var options = this.options;

      if (insertion) {
        // Clones must be hidden before folding animation to capture dragRectAbsolute properly
        if (isOwner) {
          activeSortable._hideClone();
        }

        $Wg5j$var$initialFolding = false; // If leaving sort:false root, or already folding - Fold to new location

        if (options.animation && $Wg5j$var$multiDragElements.length > 1 && ($Wg5j$var$folding || !isOwner && !activeSortable.options.sort && !putSortable)) {
          // Fold: Set all multi drag elements's rects to dragEl's rect when multi-drag elements are invisible
          var dragRectAbsolute = $O3AG$export$getRect($Wg5j$var$dragEl, false, true, true);
          $Wg5j$var$multiDragElements.forEach(function (multiDragElement) {
            if (multiDragElement === $Wg5j$var$dragEl) return;
            $O3AG$export$setRect(multiDragElement, dragRectAbsolute); // Move element(s) to end of parentEl so that it does not interfere with multi-drag clones insertion if they are inserted
            // while folding, and so that we can capture them again because old sortable will no longer be fromSortable

            parentEl.appendChild(multiDragElement);
          });
          $Wg5j$var$folding = true;
        } // Clones must be shown (and check to remove multi drags) after folding when interfering multiDragElements are moved out


        if (!isOwner) {
          // Only remove if not folding (folding will remove them anyways)
          if (!$Wg5j$var$folding) {
            $Wg5j$var$removeMultiDragElements();
          }

          if ($Wg5j$var$multiDragElements.length > 1) {
            var clonesHiddenBefore = $Wg5j$var$clonesHidden;

            activeSortable._showClone(sortable); // Unfold animation for clones if showing from hidden


            if (activeSortable.options.animation && !$Wg5j$var$clonesHidden && clonesHiddenBefore) {
              $Wg5j$var$multiDragClones.forEach(function (clone) {
                activeSortable.addAnimationState({
                  target: clone,
                  rect: $Wg5j$var$clonesFromRect
                });
                clone.fromRect = $Wg5j$var$clonesFromRect;
                clone.thisAnimationDuration = null;
              });
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
      $Wg5j$var$multiDragElements.forEach(function (multiDragElement) {
        multiDragElement.thisAnimationDuration = null;
      });

      if (activeSortable.options.animation && !isOwner && activeSortable.multiDrag.isMultiDrag) {
        $Wg5j$var$clonesFromRect = Object.assign({}, dragRect);
        var dragMatrix = $O3AG$export$matrix($Wg5j$var$dragEl, true);
        $Wg5j$var$clonesFromRect.top -= dragMatrix.f;
        $Wg5j$var$clonesFromRect.left -= dragMatrix.e;
      }
    },
    dragOverAnimationComplete: function dragOverAnimationComplete() {
      if ($Wg5j$var$folding) {
        $Wg5j$var$folding = false;
        $Wg5j$var$removeMultiDragElements();
      }
    },
    drop: function drop(_ref12) {
      var evt = _ref12.originalEvent,
          rootEl = _ref12.rootEl,
          parentEl = _ref12.parentEl,
          sortable = _ref12.sortable,
          dispatchSortableEvent = _ref12.dispatchSortableEvent,
          oldIndex = _ref12.oldIndex,
          putSortable = _ref12.putSortable;
      var toSortable = putSortable || this.sortable;
      if (!evt) return;
      var options = this.options,
          children = parentEl.children; // Multi-drag selection

      if (!$Wg5j$var$dragStarted) {
        if (options.multiDragKey && !this.multiDragKeyDown) {
          this._deselectMultiDrag();
        }

        $O3AG$export$toggleClass($Wg5j$var$dragEl, options.selectedClass, !~$Wg5j$var$multiDragElements.indexOf($Wg5j$var$dragEl));

        if (!~$Wg5j$var$multiDragElements.indexOf($Wg5j$var$dragEl)) {
          $Wg5j$var$multiDragElements.push($Wg5j$var$dragEl);
          $kuw9$export$default({
            sortable: sortable,
            rootEl: rootEl,
            name: 'select',
            targetEl: $Wg5j$var$dragEl,
            originalEvt: evt
          }); // Modifier activated, select from last to dragEl

          if (evt.shiftKey && $Wg5j$var$lastMultiDragSelect && sortable.el.contains($Wg5j$var$lastMultiDragSelect)) {
            var lastIndex = $O3AG$export$index($Wg5j$var$lastMultiDragSelect),
                currentIndex = $O3AG$export$index($Wg5j$var$dragEl);

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
                if (~$Wg5j$var$multiDragElements.indexOf(children[i])) continue;
                $O3AG$export$toggleClass(children[i], options.selectedClass, true);
                $Wg5j$var$multiDragElements.push(children[i]);
                $kuw9$export$default({
                  sortable: sortable,
                  rootEl: rootEl,
                  name: 'select',
                  targetEl: children[i],
                  originalEvt: evt
                });
              }
            }
          } else {
            $Wg5j$var$lastMultiDragSelect = $Wg5j$var$dragEl;
          }

          $Wg5j$var$multiDragSortable = toSortable;
        } else {
          $Wg5j$var$multiDragElements.splice($Wg5j$var$multiDragElements.indexOf($Wg5j$var$dragEl), 1);
          $Wg5j$var$lastMultiDragSelect = null;
          $kuw9$export$default({
            sortable: sortable,
            rootEl: rootEl,
            name: 'deselect',
            targetEl: $Wg5j$var$dragEl,
            originalEvt: evt
          });
        }
      } // Multi-drag drop


      if ($Wg5j$var$dragStarted && this.isMultiDrag) {
        // Do not "unfold" after around dragEl if reverted
        if ((parentEl[$O3AG$export$expando].options.sort || parentEl !== rootEl) && $Wg5j$var$multiDragElements.length > 1) {
          var dragRect = $O3AG$export$getRect($Wg5j$var$dragEl),
              multiDragIndex = $O3AG$export$index($Wg5j$var$dragEl, ':not(.' + this.options.selectedClass + ')');
          if (!$Wg5j$var$initialFolding && options.animation) $Wg5j$var$dragEl.thisAnimationDuration = null;
          toSortable.captureAnimationState();

          if (!$Wg5j$var$initialFolding) {
            if (options.animation) {
              $Wg5j$var$dragEl.fromRect = dragRect;
              $Wg5j$var$multiDragElements.forEach(function (multiDragElement) {
                multiDragElement.thisAnimationDuration = null;

                if (multiDragElement !== $Wg5j$var$dragEl) {
                  var rect = $Wg5j$var$folding ? $O3AG$export$getRect(multiDragElement) : dragRect;
                  multiDragElement.fromRect = rect; // Prepare unfold animation

                  toSortable.addAnimationState({
                    target: multiDragElement,
                    rect: rect
                  });
                }
              });
            } // Multi drag elements are not necessarily removed from the DOM on drop, so to reinsert
            // properly they must all be removed


            $Wg5j$var$removeMultiDragElements();
            $Wg5j$var$multiDragElements.forEach(function (multiDragElement) {
              if (children[multiDragIndex]) {
                parentEl.insertBefore(multiDragElement, children[multiDragIndex]);
              } else {
                parentEl.appendChild(multiDragElement);
              }

              multiDragIndex++;
            }); // If initial folding is done, the elements may have changed position because they are now
            // unfolding around dragEl, even though dragEl may not have his index changed, so update event
            // must be fired here as Sortable will not.

            if (oldIndex === $O3AG$export$index($Wg5j$var$dragEl)) {
              var update = false;
              $Wg5j$var$multiDragElements.forEach(function (multiDragElement) {
                if (multiDragElement.sortableIndex !== $O3AG$export$index(multiDragElement)) {
                  update = true;
                  return;
                }
              });

              if (update) {
                dispatchSortableEvent('update');
              }
            }
          } // Must be done after capturing individual rects (scroll bar)


          $Wg5j$var$multiDragElements.forEach(function (multiDragElement) {
            $O3AG$export$unsetRect(multiDragElement);
          });
          toSortable.animateAll();
        }

        $Wg5j$var$multiDragSortable = toSortable;
      } // Remove clones if necessary


      if (rootEl === parentEl || putSortable && putSortable.lastPutMode !== 'clone') {
        $Wg5j$var$multiDragClones.forEach(function (clone) {
          clone.parentNode && clone.parentNode.removeChild(clone);
        });
      }
    },
    nullingGlobal: function nullingGlobal() {
      this.isMultiDrag = $Wg5j$var$dragStarted = false;
      $Wg5j$var$multiDragClones.length = 0;
    },
    destroyGlobal: function destroyGlobal() {
      this._deselectMultiDrag();

      $O3AG$export$off(document, 'pointerup', this._deselectMultiDrag);
      $O3AG$export$off(document, 'mouseup', this._deselectMultiDrag);
      $O3AG$export$off(document, 'touchend', this._deselectMultiDrag);
      $O3AG$export$off(document, 'keydown', this._checkKeyDown);
      $O3AG$export$off(document, 'keyup', this._checkKeyUp);
    },
    _deselectMultiDrag: function _deselectMultiDrag(evt) {
      if (typeof $Wg5j$var$dragStarted !== "undefined" && $Wg5j$var$dragStarted) return; // Only deselect if selection is in this sortable

      if ($Wg5j$var$multiDragSortable !== this.sortable) return; // Only deselect if target is not item in this sortable

      if (evt && $O3AG$export$closest(evt.target, this.options.draggable, this.sortable.el, false)) return; // Only deselect if left click

      if (evt && evt.button !== 0) return;

      while ($Wg5j$var$multiDragElements.length) {
        var el = $Wg5j$var$multiDragElements[0];
        $O3AG$export$toggleClass(el, this.options.selectedClass, false);
        $Wg5j$var$multiDragElements.shift();
        $kuw9$export$default({
          sortable: this.sortable,
          rootEl: this.sortable.el,
          name: 'deselect',
          targetEl: el,
          originalEvt: evt
        });
      }
    },
    _checkKeyDown: function _checkKeyDown(evt) {
      if (evt.key === this.options.multiDragKey) {
        this.multiDragKeyDown = true;
      }
    },
    _checkKeyUp: function _checkKeyUp(evt) {
      if (evt.key === this.options.multiDragKey) {
        this.multiDragKeyDown = false;
      }
    }
  };
  return Object.assign(MultiDrag, {
    // Static methods & properties
    pluginName: 'multiDrag',
    utils: {
      /**
       * Selects the provided multi-drag item
       * @param  {HTMLElement} el    The element to be selected
       */
      select: function select(el) {
        var sortable = el.parentNode[$O3AG$export$expando];
        if (!sortable || !sortable.options.multiDrag || ~$Wg5j$var$multiDragElements.indexOf(el)) return;

        if ($Wg5j$var$multiDragSortable && $Wg5j$var$multiDragSortable !== sortable) {
          $Wg5j$var$multiDragSortable.multiDrag._deselectMultiDrag();

          $Wg5j$var$multiDragSortable = sortable;
        }

        $O3AG$export$toggleClass(el, sortable.options.selectedClass, true);
        $Wg5j$var$multiDragElements.push(el);
      },

      /**
       * Deselects the provided multi-drag item
       * @param  {HTMLElement} el    The element to be deselected
       */
      deselect: function deselect(el) {
        var sortable = el.parentNode[$O3AG$export$expando],
            index = $Wg5j$var$multiDragElements.indexOf(el);
        if (!sortable || !sortable.options.multiDrag || !~index) return;
        $O3AG$export$toggleClass(el, sortable.options.selectedClass, false);
        $Wg5j$var$multiDragElements.splice(index, 1);
      }
    },
    eventProperties: function eventProperties() {
      var _this3 = this;

      var oldIndicies = [],
          newIndicies = [];
      $Wg5j$var$multiDragElements.forEach(function (multiDragElement) {
        oldIndicies.push({
          multiDragElement: multiDragElement,
          index: multiDragElement.sortableIndex
        });
        var newIndex;

        if ($Wg5j$var$folding && multiDragElement !== $Wg5j$var$dragEl) {
          newIndex = -1;
        } else if ($Wg5j$var$folding) {
          newIndex = $O3AG$export$index(multiDragElement, ':not(.' + _this3.options.selectedClass + ')');
        } else {
          newIndex = $O3AG$export$index(multiDragElement);
        }

        newIndicies.push({
          multiDragElement: multiDragElement,
          index: newIndex
        });
      });
      return {
        items: $Wg5j$var$_toConsumableArray($Wg5j$var$multiDragElements),
        clones: [].concat($Wg5j$var$multiDragClones),
        oldIndicies: oldIndicies,
        newIndicies: newIndicies
      };
    },
    optionListeners: {
      multiDragKey: function multiDragKey(key) {
        key = key.toLowerCase();

        if (key === 'ctrl') {
          key = 'Control';
        } else if (key.length > 1) {
          key = key.charAt(0).toUpperCase() + key.substr(1);
        }

        return key;
      }
    }
  });
}

function $Wg5j$var$insertMultiDragElements(clonesInserted, rootEl) {
  $Wg5j$var$multiDragElements.forEach(function (multiDragElement, i) {
    var target = rootEl.children[multiDragElement.sortableIndex + (clonesInserted ? Number(i) : 0)];

    if (target) {
      rootEl.insertBefore(multiDragElement, target);
    } else {
      rootEl.appendChild(multiDragElement);
    }
  });
}
/**
 * Insert multi-drag clones
 * @param  {[Boolean]} elementsInserted  Whether the multi-drag elements are inserted
 * @param  {HTMLElement} rootEl
 */


function $Wg5j$var$insertMultiDragClones(elementsInserted, rootEl) {
  $Wg5j$var$multiDragClones.forEach(function (clone, i) {
    var target = rootEl.children[clone.sortableIndex + (elementsInserted ? Number(i) : 0)];

    if (target) {
      rootEl.insertBefore(clone, target);
    } else {
      rootEl.appendChild(clone);
    }
  });
}

function $Wg5j$var$removeMultiDragElements() {
  $Wg5j$var$multiDragElements.forEach(function (multiDragElement) {
    if (multiDragElement === $Wg5j$var$dragEl) return;
    multiDragElement.parentNode && multiDragElement.parentNode.removeChild(multiDragElement);
  });
}

$pYnI$export$default.mount(new $blm2$export$default());
$pYnI$export$default.mount($nFhH$export$RemoveOnSpill, $nFhH$export$RevertOnSpill);

if (window && !window.Sortable) {
  window.Sortable = $pYnI$export$default;
}

$oPI2$exports.default = $pYnI$export$default;
$oPI2$exports.MultiDrag = $Wg5j$export$default;
$oPI2$exports.Swap = $XnBf$export$default;
$oPI2$exports.Sortable = $pYnI$export$default;

if (typeof exports === "object" && typeof module !== "undefined") {
  // CommonJS
  module.exports = $oPI2$exports;
} else if (typeof define === "function" && define.amd) {
  // RequireJS
  define(function () {
    return $oPI2$exports;
  });
}
})();