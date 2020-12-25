/**!
 * Sortable 1.11.0
 * @author	RubaXa   <trash@rubaxa.org>
 * @author	owenm    <owen23355@gmail.com>
 * @license MIT
 */
var version = "1.11.0";

function userAgent(pattern) {
  if (typeof window !== "undefined" && window.navigator) {
    return !!(/*@__PURE__*/ navigator.userAgent.match(pattern));
  }
}

const IE11OrLess = userAgent(
  /(?:Trident.*rv[ :]?11\.|msie|iemobile|Windows Phone)/i
);
const Edge = userAgent(/Edge/i);
const FireFox = userAgent(/firefox/i);
const Safari =
  userAgent(/safari/i) && !userAgent(/chrome/i) && !userAgent(/android/i);
const IOS = userAgent(/iP(ad|od|hone)/i);
const ChromeForAndroid = userAgent(/chrome/i) && userAgent(/android/i);

const captureMode = {
  capture: false,
  passive: false,
};

function on(el, event, fn) {
  el.addEventListener(event, fn, !IE11OrLess && captureMode);
}

function off(el, event, fn) {
  el.removeEventListener(event, fn, !IE11OrLess && captureMode);
}

function matches(/**HTMLElement*/ el, /**String*/ selector) {
  if (!selector) return;

  selector[0] === ">" && (selector = selector.substring(1));

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

function getParentOrHost(el) {
  return el.host && el !== document && el.host.nodeType
    ? el.host
    : el.parentNode;
}

function closest(
  /**HTMLElement*/ el,
  /**String*/ selector,
  /**HTMLElement*/ ctx,
  includeCTX
) {
  if (el) {
    ctx = ctx || document;

    do {
      if (
        (selector != null &&
          (selector[0] === ">"
            ? el.parentNode === ctx && matches(el, selector)
            : matches(el, selector))) ||
        (includeCTX && el === ctx)
      ) {
        return el;
      }

      if (el === ctx) break;
      /* jshint boss:true */
    } while ((el = getParentOrHost(el)));
  }

  return null;
}

const R_SPACE = /\s+/g;

function toggleClass(el, name, state) {
  if (el && name) {
    if (el.classList) {
      el.classList[state ? "add" : "remove"](name);
    } else {
      let className = (" " + el.className + " ")
        .replace(R_SPACE, " ")
        .replace(" " + name + " ", " ");
      el.className = (className + (state ? " " + name : "")).replace(
        R_SPACE,
        " "
      );
    }
  }
}

function css(el, prop, val) {
  let style = el && el.style;

  if (style) {
    if (val === void 0) {
      if (document.defaultView && document.defaultView.getComputedStyle) {
        val = document.defaultView.getComputedStyle(el, "");
      } else if (el.currentStyle) {
        val = el.currentStyle;
      }

      return prop === void 0 ? val : val[prop];
    } else {
      if (!(prop in style) && prop.indexOf("webkit") === -1) {
        prop = "-webkit-" + prop;
      }

      style[prop] = val + (typeof val === "string" ? "" : "px");
    }
  }
}

function matrix(el, selfOnly) {
  let appliedTransforms = "";
  if (typeof el === "string") {
    appliedTransforms = el;
  } else {
    do {
      //@ts-ignore
      let transform = css(el, "transform");

      if (transform && transform !== "none") {
        appliedTransforms = transform + " " + appliedTransforms;
      }
      /* jshint boss:true */
    } while (!selfOnly && (el = el.parentNode));
  }

  //@ts-ignore
  const matrixFn =
    window.DOMMatrix ||
    window.WebKitCSSMatrix ||
    window.CSSMatrix ||
    window.MSCSSMatrix;
  /*jshint -W056 */
  return matrixFn && new matrixFn(appliedTransforms);
}

function find(ctx, tagName, iterator) {
  if (ctx) {
    let list = ctx.getElementsByTagName(tagName),
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

function getWindowScrollingElement() {
  let scrollingElement = document.scrollingElement;

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
function getRect(
  el,
  relativeToContainingBlock,
  relativeToNonStaticParent,
  undoScale,
  container
) {
  if (!el.getBoundingClientRect && el !== window) return;

  let elRect, top, left, bottom, right, height, width;

  if (el !== window && el !== getWindowScrollingElement()) {
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

  if (
    (relativeToContainingBlock || relativeToNonStaticParent) &&
    el !== window
  ) {
    // Adjust for translate()
    container = container || el.parentNode;

    // solves #1123 (see: https://stackoverflow.com/a/37953806/6088312)
    // Not needed on <= IE11
    if (!IE11OrLess) {
      do {
        if (
          container &&
          container.getBoundingClientRect &&
          //@ts-ignore
          (css(container, "transform") !== "none" ||
            (relativeToNonStaticParent &&
              //@ts-ignore
              css(container, "position") !== "static"))
        ) {
          let containerRect = container.getBoundingClientRect();

          // Set relative to edges of padding box of container
          //@ts-ignore
          top -=
            containerRect.top + parseInt(css(container, "border-top-width"));
          //@ts-ignore
          left -=
            containerRect.left + parseInt(css(container, "border-left-width"));
          bottom = top + elRect.height;
          right = left + elRect.width;

          break;
        }
        /* jshint boss:true */
      } while ((container = container.parentNode));
    }
  }

  if (undoScale && el !== window) {
    // Adjust for scale()
    //@ts-ignore
    let elMatrix = matrix(container || el),
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
    height: height,
  };
}

/**
 * Checks if a side of an element is scrolled past a side of its parents
 * @param  {HTMLElement}  el           The element who's side being scrolled out of view is in question
 * @param  {String}       elSide       Side of the element in question ('top', 'left', 'right', 'bottom')
 * @param  {String}       parentSide   Side of the parent in question ('top', 'left', 'right', 'bottom')
 * @return {HTMLElement}               The parent scroll element that the el's side is scrolled past, or null if there is no such element
 */
function isScrolledPast(el, elSide, parentSide) {
  let parent = getParentAutoScrollElement(el, true),
    //@ts-ignore
    elSideVal = getRect(el)[elSide];

  /* jshint boss:true */
  while (parent) {
    //@ts-ignore
    let parentSideVal = getRect(parent)[parentSide],
      visible;

    if (parentSide === "top" || parentSide === "left") {
      visible = elSideVal >= parentSideVal;
    } else {
      visible = elSideVal <= parentSideVal;
    }

    if (!visible) return parent;

    if (parent === getWindowScrollingElement()) break;

    parent = getParentAutoScrollElement(parent, false);
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
function getChild(el, childNum, options) {
  let currentChild = 0,
    i = 0,
    children = el.children;

  while (i < children.length) {
    if (
      children[i].style.display !== "none" &&
      //@ts-ignore
      children[i] !== Sortable.ghost &&
      //@ts-ignore
      children[i] !== Sortable.dragged &&
      closest(children[i], options.draggable, el, false)
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
 * @param  {selector} selector    Any other elements that should be ignored
 * @return {HTMLElement}          The last child, ignoring ghostEl
 */
function lastChild(el, selector) {
  let last = el.lastElementChild;

  while (
    last &&
    //@ts-ignore
    (last === Sortable.ghost ||
      //@ts-ignore
      css(last, "display") === "none" ||
      (selector && !matches(last, selector)))
  ) {
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
function index(el, selector) {
  let index = 0;

  if (!el || !el.parentNode) {
    return -1;
  }

  /* jshint boss:true */
  while ((el = el.previousElementSibling)) {
    //@ts-ignore
    if (
      el.nodeName.toUpperCase() !== "TEMPLATE" &&
      el !== Sortable.clone &&
      (!selector || matches(el, selector))
    ) {
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
function getRelativeScrollOffset(el) {
  let offsetLeft = 0,
    offsetTop = 0,
    winScroller = getWindowScrollingElement();

  if (el) {
    do {
      //@ts-ignore
      let elMatrix = matrix(el),
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
function indexOfObject(arr, obj) {
  for (let i in arr) {
    if (!arr.hasOwnProperty(i)) continue;
    for (let key in obj) {
      if (obj.hasOwnProperty(key) && obj[key] === arr[i][key]) return Number(i);
    }
  }
  return -1;
}

function getParentAutoScrollElement(el, includeSelf) {
  // skip to window
  if (!el || !el.getBoundingClientRect) return getWindowScrollingElement();

  let elem = el;
  let gotSelf = false;
  do {
    // we don't need to get elem css if it isn't even overflowing in the first place (performance)
    if (
      elem.clientWidth < elem.scrollWidth ||
      elem.clientHeight < elem.scrollHeight
    ) {
      //@ts-ignore
      let elemCSS = css(elem);
      if (
        (elem.clientWidth < elem.scrollWidth &&
          (elemCSS.overflowX == "auto" || elemCSS.overflowX == "scroll")) ||
        (elem.clientHeight < elem.scrollHeight &&
          (elemCSS.overflowY == "auto" || elemCSS.overflowY == "scroll"))
      ) {
        if (!elem.getBoundingClientRect || elem === document.body)
          return getWindowScrollingElement();

        if (gotSelf || includeSelf) return elem;
        gotSelf = true;
      }
    }
    /* jshint boss:true */
  } while ((elem = elem.parentNode));

  return getWindowScrollingElement();
}

function extend(dst, src) {
  if (dst && src) {
    for (let key in src) {
      if (src.hasOwnProperty(key)) {
        dst[key] = src[key];
      }
    }
  }

  return dst;
}

function isRectEqual(rect1, rect2) {
  return (
    Math.round(rect1.top) === Math.round(rect2.top) &&
    Math.round(rect1.left) === Math.round(rect2.left) &&
    Math.round(rect1.height) === Math.round(rect2.height) &&
    Math.round(rect1.width) === Math.round(rect2.width)
  );
}

let _throttleTimeout;
function throttle(callback, ms) {
  return function () {
    if (!_throttleTimeout) {
      let args = arguments,
        _this = this;

      if (args.length === 1) {
        callback.call(_this, args[0]);
      } else {
        callback.apply(_this, args);
      }

      _throttleTimeout = setTimeout(function () {
        _throttleTimeout = void 0;
      }, ms);
    }
  };
}

function cancelThrottle() {
  clearTimeout(_throttleTimeout);
  _throttleTimeout = void 0;
}

function scrollBy(el, x, y) {
  el.scrollLeft += x;
  el.scrollTop += y;
}

function clone(el) {
  //@ts-ignore
  let Polymer = window.Polymer;
  //@ts-ignore
  let $ = window.jQuery || window.Zepto;

  if (Polymer && Polymer.dom) {
    return Polymer.dom(el).cloneNode(true);
  } else if ($) {
    return $(el).clone(true)[0];
  } else {
    return el.cloneNode(true);
  }
}

function setRect(el, rect) {
  css(el, "position", "absolute");
  css(el, "top", rect.top);
  css(el, "left", rect.left);
  css(el, "width", rect.width);
  css(el, "height", rect.height);
}

function unsetRect(el) {
  css(el, "position", "");
  css(el, "top", "");
  css(el, "left", "");
  css(el, "width", "");
  css(el, "height", "");
}

const expando = "Sortable" + new Date().getTime();

function AnimationStateManager() {
  let animationStates = [],
    animationCallbackId;

  return {
    captureAnimationState() {
      animationStates = [];
      if (!this.options.animation) return;
      let children = [].slice.call(this.el.children);

      children.forEach((child) => {
        if (css(child, "display") === "none" || child === Sortable.ghost)
          return;
        animationStates.push({
          target: child,
          rect: getRect(child),
        });
        let fromRect = { ...animationStates[animationStates.length - 1].rect };

        // If animating: compensate for current animation
        if (child.thisAnimationDuration) {
          let childMatrix = matrix(child, true);
          if (childMatrix) {
            fromRect.top -= childMatrix.f;
            fromRect.left -= childMatrix.e;
          }
        }

        child.fromRect = fromRect;
      });
    },

    addAnimationState(state) {
      animationStates.push(state);
    },

    removeAnimationState(target) {
      animationStates.splice(indexOfObject(animationStates, { target }), 1);
    },

    animateAll(callback) {
      if (!this.options.animation) {
        clearTimeout(animationCallbackId);
        if (typeof callback === "function") callback();
        return;
      }

      let animating = false,
        animationTime = 0;

      animationStates.forEach((state) => {
        let time = 0,
          target = state.target,
          fromRect = target.fromRect,
          toRect = getRect(target),
          prevFromRect = target.prevFromRect,
          prevToRect = target.prevToRect,
          animatingRect = state.rect,
          targetMatrix = matrix(target, true);

        if (targetMatrix) {
          // Compensate for current animation
          toRect.top -= targetMatrix.f;
          toRect.left -= targetMatrix.e;
        }

        target.toRect = toRect;

        if (target.thisAnimationDuration) {
          // Could also check if animatingRect is between fromRect and toRect
          if (
            isRectEqual(prevFromRect, toRect) &&
            !isRectEqual(fromRect, toRect) &&
            // Make sure animatingRect is on line between toRect & fromRect
            (animatingRect.top - toRect.top) /
              (animatingRect.left - toRect.left) ===
              (fromRect.top - toRect.top) / (fromRect.left - toRect.left)
          ) {
            // If returning to same place as started from animation and on same axis
            time = calculateRealTime(
              animatingRect,
              prevFromRect,
              prevToRect,
              this.options
            );
          }
        }

        // if fromRect != toRect: animate
        if (!isRectEqual(toRect, fromRect)) {
          target.prevFromRect = fromRect;
          target.prevToRect = toRect;

          if (!time) {
            time = this.options.animation;
          }
          this.animate(target, animatingRect, toRect, time);
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
        if (typeof callback === "function") callback();
      } else {
        animationCallbackId = setTimeout(function () {
          if (typeof callback === "function") callback();
        }, animationTime);
      }
      animationStates = [];
    },

    animate(target, currentRect, toRect, duration) {
      if (duration) {
        css(target, "transition", "");
        css(target, "transform", "");
        let elMatrix = matrix(this.el),
          scaleX = elMatrix && elMatrix.a,
          scaleY = elMatrix && elMatrix.d,
          translateX = (currentRect.left - toRect.left) / (scaleX || 1),
          translateY = (currentRect.top - toRect.top) / (scaleY || 1);

        target.animatingX = !!translateX;
        target.animatingY = !!translateY;

        css(
          target,
          "transform",
          "translate3d(" + translateX + "px," + translateY + "px,0)"
        );

        this.forRepaintDummy = repaint(target); // repaint

        css(
          target,
          "transition",
          "transform " +
            duration +
            "ms" +
            (this.options.easing ? " " + this.options.easing : "")
        );
        css(target, "transform", "translate3d(0,0,0)");
        typeof target.animated === "number" && clearTimeout(target.animated);
        target.animated = setTimeout(function () {
          css(target, "transition", "");
          css(target, "transform", "");
          target.animated = false;

          target.animatingX = false;
          target.animatingY = false;
        }, duration);
      }
    },
  };
}

function repaint(target) {
  return target.offsetWidth;
}

function calculateRealTime(animatingRect, fromRect, toRect, options) {
  return (
    (Math.sqrt(
      Math.pow(fromRect.top - animatingRect.top, 2) +
        Math.pow(fromRect.left - animatingRect.left, 2)
    ) /
      Math.sqrt(
        Math.pow(fromRect.top - toRect.top, 2) +
          Math.pow(fromRect.left - toRect.left, 2)
      )) *
    options.animation
  );
}

let plugins = [];

const defaults = {
  initializeByDefault: true,
};

var PluginManager = {
  mount(plugin) {
    // Set default static properties
    for (let option in defaults) {
      if (defaults.hasOwnProperty(option) && !(option in plugin)) {
        plugin[option] = defaults[option];
      }
    }
    plugins.push(plugin);
  },
  pluginEvent(eventName, sortable, evt) {
    this.eventCanceled = false;
    evt.cancel = () => {
      this.eventCanceled = true;
    };
    const eventNameGlobal = eventName + "Global";
    plugins.forEach((plugin) => {
      if (!sortable[plugin.pluginName]) return;
      // Fire global events if it exists in this sortable
      if (sortable[plugin.pluginName][eventNameGlobal]) {
        sortable[plugin.pluginName][eventNameGlobal]({ sortable, ...evt });
      }

      // Only fire plugin event if plugin is enabled in this sortable,
      // and plugin has event defined
      if (
        sortable.options[plugin.pluginName] &&
        sortable[plugin.pluginName][eventName]
      ) {
        sortable[plugin.pluginName][eventName]({ sortable, ...evt });
      }
    });
  },
  initializePlugins(sortable, el, defaults, options) {
    plugins.forEach((plugin) => {
      const pluginName = plugin.pluginName;
      if (!sortable.options[pluginName] && !plugin.initializeByDefault) return;

      let initialized = new plugin(sortable, el, sortable.options);
      initialized.sortable = sortable;
      initialized.options = sortable.options;
      sortable[pluginName] = initialized;

      // Add default options from plugin
      Object.assign(defaults, initialized.defaults);
    });

    for (let option in sortable.options) {
      if (!sortable.options.hasOwnProperty(option)) continue;
      let modified = this.modifyOption(
        sortable,
        option,
        sortable.options[option]
      );
      if (typeof modified !== "undefined") {
        sortable.options[option] = modified;
      }
    }
  },
  getEventProperties(name, sortable) {
    let eventProperties = {};
    plugins.forEach((plugin) => {
      if (typeof plugin.eventProperties !== "function") return;
      Object.assign(
        eventProperties,
        plugin.eventProperties.call(sortable[plugin.pluginName], name)
      );
    });

    return eventProperties;
  },
  modifyOption(sortable, name, value) {
    let modifiedValue;
    plugins.forEach((plugin) => {
      // Plugin must exist on the Sortable
      if (!sortable[plugin.pluginName]) return;

      // If static option listener exists for this option, call in the context of the Sortable's instance of this plugin
      if (
        plugin.optionListeners &&
        typeof plugin.optionListeners[name] === "function"
      ) {
        modifiedValue = plugin.optionListeners[name].call(
          sortable[plugin.pluginName],
          value
        );
      }
    });

    return modifiedValue;
  },
};

function dispatchEvent({
  sortable,
  rootEl,
  name,
  targetEl,
  cloneEl,
  toEl,
  fromEl,
  oldIndex,
  newIndex,
  oldDraggableIndex,
  newDraggableIndex,
  originalEvent,
  putSortable,
  extraEventProperties,
}) {
  sortable = sortable || (rootEl && rootEl[expando]);
  if (!sortable) return;

  let evt,
    options = sortable.options,
    onName = "on" + name.charAt(0).toUpperCase() + name.substr(1);
  // Support for new CustomEvent feature
  if (window.CustomEvent && !IE11OrLess && !Edge) {
    evt = new CustomEvent(name, {
      bubbles: true,
      cancelable: true,
    });
  } else {
    evt = document.createEvent("Event");
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

  let allEventProperties = {
    ...extraEventProperties,
    ...PluginManager.getEventProperties(name, sortable),
  };
  for (let option in allEventProperties) {
    evt[option] = allEventProperties[option];
  }

  if (rootEl) {
    rootEl.dispatchEvent(evt);
  }

  if (options[onName]) {
    options[onName].call(sortable, evt);
  }
}

/**!
 * Sortable
 * @author	RubaXa   <trash@rubaxa.org>
 * @author	owenm    <owen23355@gmail.com>
 * @license MIT
 */

let pluginEvent = function (
  eventName,
  sortable,
  { evt: originalEvent, ...data } = {}
) {
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

    ...data,
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
    ...info,
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
const documentExists = typeof document !== "undefined",
  PositionGhostAbsolutely = IOS,
  CSSFloatProperty = Edge || IE11OrLess ? "cssFloat" : "float",
  // This will not pass for IE9, because IE9 DnD only works on anchors
  supportDraggable =
    documentExists &&
    !ChromeForAndroid &&
    !IOS &&
    "draggable" in document.createElement("div"),
  supportCssPointerEvents = (function () {
    if (!documentExists) return;
    // false when <= IE11
    if (IE11OrLess) {
      return false;
    }
    let el = document.createElement("x");
    el.style.cssText = "pointer-events:auto";
    return el.style.pointerEvents === "auto";
  })(),
  _detectDirection = function (el, options) {
    let elCSS = css(el),
      elWidth =
        parseInt(elCSS.width) -
        parseInt(elCSS.paddingLeft) -
        parseInt(elCSS.paddingRight) -
        parseInt(elCSS.borderLeftWidth) -
        parseInt(elCSS.borderRightWidth),
      child1 = getChild(el, 0, options),
      child2 = getChild(el, 1, options),
      firstChildCSS = child1 && css(child1),
      secondChildCSS = child2 && css(child2),
      firstChildWidth =
        firstChildCSS &&
        parseInt(firstChildCSS.marginLeft) +
          parseInt(firstChildCSS.marginRight) +
          getRect(child1).width,
      secondChildWidth =
        secondChildCSS &&
        parseInt(secondChildCSS.marginLeft) +
          parseInt(secondChildCSS.marginRight) +
          getRect(child2).width;

    if (elCSS.display === "flex") {
      return elCSS.flexDirection === "column" ||
        elCSS.flexDirection === "column-reverse"
        ? "vertical"
        : "horizontal";
    }

    if (elCSS.display === "grid") {
      return elCSS.gridTemplateColumns.split(" ").length <= 1
        ? "vertical"
        : "horizontal";
    }

    if (child1 && firstChildCSS.float && firstChildCSS.float !== "none") {
      let touchingSideChild2 =
        firstChildCSS.float === "left" ? "left" : "right";

      return child2 &&
        (secondChildCSS.clear === "both" ||
          secondChildCSS.clear === touchingSideChild2)
        ? "vertical"
        : "horizontal";
    }

    return child1 &&
      (firstChildCSS.display === "block" ||
        firstChildCSS.display === "flex" ||
        firstChildCSS.display === "table" ||
        firstChildCSS.display === "grid" ||
        (firstChildWidth >= elWidth && elCSS[CSSFloatProperty] === "none") ||
        (child2 &&
          elCSS[CSSFloatProperty] === "none" &&
          firstChildWidth + secondChildWidth > elWidth))
      ? "vertical"
      : "horizontal";
  },
  _dragElInRowColumn = function (dragRect, targetRect, vertical) {
    let dragElS1Opp = vertical ? dragRect.left : dragRect.top,
      dragElS2Opp = vertical ? dragRect.right : dragRect.bottom,
      dragElOppLength = vertical ? dragRect.width : dragRect.height,
      targetS1Opp = vertical ? targetRect.left : targetRect.top,
      targetS2Opp = vertical ? targetRect.right : targetRect.bottom,
      targetOppLength = vertical ? targetRect.width : targetRect.height;

    return (
      dragElS1Opp === targetS1Opp ||
      dragElS2Opp === targetS2Opp ||
      dragElS1Opp + dragElOppLength / 2 === targetS1Opp + targetOppLength / 2
    );
  },
  /**
   * Detects first nearest empty sortable to X and Y position using emptyInsertThreshold.
   * @param  {Number} x      X position
   * @param  {Number} y      Y position
   * @return {HTMLElement}   Element of the first found nearest Sortable
   */
  _detectNearestEmptySortable = function (x, y) {
    let ret;
    sortables.some((sortable) => {
      if (lastChild(sortable)) return;

      let rect = getRect(sortable),
        threshold = sortable[expando].options.emptyInsertThreshold,
        insideHorizontally =
          x >= rect.left - threshold && x <= rect.right + threshold,
        insideVertically =
          y >= rect.top - threshold && y <= rect.bottom + threshold;

      if (threshold && insideHorizontally && insideVertically) {
        return (ret = sortable);
      }
    });
    return ret;
  },
  _prepareGroup = function (options) {
    function toFn(value, pull) {
      return function (to, from, dragEl, evt) {
        let sameGroup =
          to.options.group.name &&
          from.options.group.name &&
          to.options.group.name === from.options.group.name;

        if (value == null && (pull || sameGroup)) {
          // Default pull value
          // Default pull and put value if same group
          return true;
        } else if (value == null || value === false) {
          return false;
        } else if (pull && value === "clone") {
          return value;
        } else if (typeof value === "function") {
          return toFn(value(to, from, dragEl, evt), pull)(
            to,
            from,
            dragEl,
            evt
          );
        } else {
          let otherGroup = (pull ? to : from).options.group.name;

          return (
            value === true ||
            (typeof value === "string" && value === otherGroup) ||
            (value.join && value.indexOf(otherGroup) > -1)
          );
        }
      };
    }

    let group = {};
    let originalGroup = options.group;

    if (!originalGroup || typeof originalGroup != "object") {
      originalGroup = { name: originalGroup };
    }

    group.name = originalGroup.name;
    group.checkPull = toFn(originalGroup.pull, true);
    group.checkPut = toFn(originalGroup.put);
    group.revertClone = originalGroup.revertClone;

    options.group = group;
  },
  _hideGhostForTarget = function () {
    if (!supportCssPointerEvents && ghostEl) {
      css(ghostEl, "display", "none");
    }
  },
  _unhideGhostForTarget = function () {
    if (!supportCssPointerEvents && ghostEl) {
      css(ghostEl, "display", "");
    }
  };

// #1184 fix - Prevent click event on fallback if dragged but item not changed position
if (documentExists) {
  document.addEventListener(
    "click",
    function (evt) {
      if (ignoreNextClick) {
        evt.preventDefault();
        evt.stopPropagation && evt.stopPropagation();
        evt.stopImmediatePropagation && evt.stopImmediatePropagation();
        ignoreNextClick = false;
        return false;
      }
    },
    true
  );
}

let nearestEmptyInsertDetectEvent = function (evt) {
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

let _checkOutsideTargetEl = function (evt) {
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
    throw `Sortable: \`el\` must be an HTMLElement, not ${{}.toString.call(
      el
    )}`;
  }

  const __warn =
    "" +
    "Importing Sortable directly from GitHub is deprecated.\n" +
    "This file will not receive any more updates.\n" +
    "Please follow the usage instructions to continue getting support: https://github.com/SortableJS/Sortable";

  console.warn(__warn);

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
    draggable: /^[uo]l$/i.test(el.nodeName) ? ">li" : ">*",
    swapThreshold: 1, // percentage; 0 <= x <= 1
    invertSwap: false, // invert always
    invertedSwapThreshold: null, // will be set to same as swapThreshold if default
    removeCloneOnHide: true,
    direction: function () {
      return _detectDirection(el, this.options);
    },
    ghostClass: "sortable-ghost",
    chosenClass: "sortable-chosen",
    dragClass: "sortable-drag",
    ignore: "a, img",
    filter: null,
    preventOnFilter: true,
    animation: 0,
    easing: null,
    setData: function (dataTransfer, dragEl) {
      dataTransfer.setData("Text", dragEl.textContent);
    },
    dropBubble: false,
    dragoverBubble: false,
    dataIdAttr: "data-id",
    delay: 0,
    delayOnTouchOnly: false,
    touchStartThreshold:
      (Number.parseInt ? Number : window).parseInt(
        window.devicePixelRatio,
        10
      ) || 1,
    forceFallback: false,
    fallbackClass: "sortable-fallback",
    fallbackOnBody: false,
    fallbackTolerance: 0,
    fallbackOffset: { x: 0, y: 0 },
    supportPointer:
      Sortable.supportPointer !== false && "PointerEvent" in window,
    emptyInsertThreshold: 5,
  };

  PluginManager.initializePlugins(this, el, defaults);

  // Set default options
  for (let name in defaults) {
    !(name in options) && (options[name] = defaults[name]);
  }

  _prepareGroup(options);

  // Bind all private methods
  for (let fn in this) {
    if (fn.charAt(0) === "_" && typeof this[fn] === "function") {
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
    on(el, "pointerdown", this._onTapStart);
  } else {
    on(el, "mousedown", this._onTapStart);
    on(el, "touchstart", this._onTapStart);
  }

  if (this.nativeDraggable) {
    on(el, "dragover", this);
    on(el, "dragenter", this);
  }

  sortables.push(this.el);

  // Restore sorting
  options.store &&
    options.store.get &&
    this.sort(options.store.get(this) || []);

  // Add animation state manager
  Object.assign(this, AnimationStateManager());
}

Sortable.prototype = /** @lends Sortable.prototype */ {
  constructor: Sortable,

  _isOutsideThisEl: function (target) {
    if (!this.el.contains(target) && target !== this.el) {
      lastTarget = null;
    }
  },

  _getDirection: function (evt, target) {
    return typeof this.options.direction === "function"
      ? this.options.direction.call(this, evt, target, dragEl)
      : this.options.direction;
  },

  _onTapStart: function (/** Event|TouchEvent */ evt) {
    if (!evt.cancelable) return;
    let _this = this,
      el = this.el,
      options = this.options,
      preventOnFilter = options.preventOnFilter,
      type = evt.type,
      touch =
        (evt.touches && evt.touches[0]) ||
        (evt.pointerType && evt.pointerType === "touch" && evt),
      target = (touch || evt).target,
      originalTarget =
        (evt.target.shadowRoot &&
          ((evt.path && evt.path[0]) ||
            (evt.composedPath && evt.composedPath()[0]))) ||
        target,
      filter = options.filter;

    _saveInputCheckedState(el);

    // Don't trigger start event when an element is been dragged, otherwise the evt.oldindex always wrong when set option.group.
    if (dragEl) {
      return;
    }

    if (
      (/mousedown|pointerdown/.test(type) && evt.button !== 0) ||
      options.disabled
    ) {
      return; // only left button and enabled
    }

    // cancel dnd if original target is content editable
    if (originalTarget.isContentEditable) {
      return;
    }

    // Safari ignores further event handling after mousedown
    if (
      !this.nativeDraggable &&
      Safari &&
      target &&
      target.tagName.toUpperCase() === "SELECT"
    ) {
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
    if (typeof filter === "function") {
      if (filter.call(this, evt, target, this)) {
        _dispatchEvent({
          sortable: _this,
          rootEl: originalTarget,
          name: "filter",
          targetEl: target,
          toEl: el,
          fromEl: el,
        });
        pluginEvent("filter", _this, { evt });
        preventOnFilter && evt.cancelable && evt.preventDefault();
        return; // cancel dnd
      }
    } else if (filter) {
      filter = filter.split(",").some(function (criteria) {
        criteria = closest(originalTarget, criteria.trim(), el, false);

        if (criteria) {
          _dispatchEvent({
            sortable: _this,
            rootEl: criteria,
            name: "filter",
            targetEl: target,
            fromEl: el,
            toEl: el,
          });
          pluginEvent("filter", _this, { evt });
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

  _prepareDragStart: function (
    /** Event */ evt,
    /** Touch */ touch,
    /** HTMLElement */ target
  ) {
    let _this = this,
      el = _this.el,
      options = _this.options,
      ownerDocument = el.ownerDocument,
      dragStartFn;

    if (target && !dragEl && target.parentNode === el) {
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
        clientY: (touch || evt).clientY,
      };

      tapDistanceLeft = tapEvt.clientX - dragRect.left;
      tapDistanceTop = tapEvt.clientY - dragRect.top;

      this._lastX = (touch || evt).clientX;
      this._lastY = (touch || evt).clientY;

      dragEl.style["will-change"] = "all";

      dragStartFn = function () {
        pluginEvent("delayEnded", _this, { evt });
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
          name: "choose",
          originalEvent: evt,
        });

        // Chosen item
        toggleClass(dragEl, options.chosenClass, true);
      };

      // Disable "draggable"
      options.ignore.split(",").forEach(function (criteria) {
        find(dragEl, criteria.trim(), _disableDraggable);
      });

      on(ownerDocument, "dragover", nearestEmptyInsertDetectEvent);
      on(ownerDocument, "mousemove", nearestEmptyInsertDetectEvent);
      on(ownerDocument, "touchmove", nearestEmptyInsertDetectEvent);

      on(ownerDocument, "mouseup", _this._onDrop);
      on(ownerDocument, "touchend", _this._onDrop);
      on(ownerDocument, "touchcancel", _this._onDrop);

      // Make dragEl draggable (must be before delay for FireFox)
      if (FireFox && this.nativeDraggable) {
        this.options.touchStartThreshold = 4;
        dragEl.draggable = true;
      }

      pluginEvent("delayStart", this, { evt });

      // Delay is impossible for native DnD in Edge or IE
      if (
        options.delay &&
        (!options.delayOnTouchOnly || touch) &&
        (!this.nativeDraggable || !(Edge || IE11OrLess))
      ) {
        if (Sortable.eventCanceled) {
          this._onDrop();
          return;
        }
        // If the user moves the pointer or let go the click or touch
        // before the delay has been reached:
        // disable the delayed drag
        on(ownerDocument, "mouseup", _this._disableDelayedDrag);
        on(ownerDocument, "touchend", _this._disableDelayedDrag);
        on(ownerDocument, "touchcancel", _this._disableDelayedDrag);
        on(ownerDocument, "mousemove", _this._delayedDragTouchMoveHandler);
        on(ownerDocument, "touchmove", _this._delayedDragTouchMoveHandler);
        options.supportPointer &&
          on(ownerDocument, "pointermove", _this._delayedDragTouchMoveHandler);

        _this._dragStartTimer = setTimeout(dragStartFn, options.delay);
      } else {
        dragStartFn();
      }
    }
  },

  _delayedDragTouchMoveHandler: function (/** TouchEvent|PointerEvent **/ e) {
    let touch = e.touches ? e.touches[0] : e;
    if (
      Math.max(
        Math.abs(touch.clientX - this._lastX),
        Math.abs(touch.clientY - this._lastY)
      ) >=
      Math.floor(
        this.options.touchStartThreshold /
          ((this.nativeDraggable && window.devicePixelRatio) || 1)
      )
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
    off(ownerDocument, "mouseup", this._disableDelayedDrag);
    off(ownerDocument, "touchend", this._disableDelayedDrag);
    off(ownerDocument, "touchcancel", this._disableDelayedDrag);
    off(ownerDocument, "mousemove", this._delayedDragTouchMoveHandler);
    off(ownerDocument, "touchmove", this._delayedDragTouchMoveHandler);
    off(ownerDocument, "pointermove", this._delayedDragTouchMoveHandler);
  },

  _triggerDragStart: function (/** Event */ evt, /** Touch */ touch) {
    touch = touch || (evt.pointerType == "touch" && evt);

    if (!this.nativeDraggable || touch) {
      if (this.options.supportPointer) {
        on(document, "pointermove", this._onTouchMove);
      } else if (touch) {
        on(document, "touchmove", this._onTouchMove);
      } else {
        on(document, "mousemove", this._onTouchMove);
      }
    } else {
      on(dragEl, "dragend", this);
      on(rootEl, "dragstart", this._onDragStart);
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

  _dragStarted: function (fallback, evt) {
    awaitingDragStarted = false;
    if (rootEl && dragEl) {
      pluginEvent("dragStarted", this, { evt });

      if (this.nativeDraggable) {
        on(document, "dragover", _checkOutsideTargetEl);
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
        name: "start",
        originalEvent: evt,
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

      let target = document.elementFromPoint(
        touchEvt.clientX,
        touchEvt.clientY
      );
      let parent = target;

      while (target && target.shadowRoot) {
        target = target.shadowRoot.elementFromPoint(
          touchEvt.clientX,
          touchEvt.clientY
        );
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
              rootEl: parent,
            });

            if (inserted && !this.options.dragoverBubble) {
              break;
            }
          }

          target = parent; // store last element
        } while (
          /* jshint boss:true */
          (parent = parent.parentNode)
        );
      }

      _unhideGhostForTarget();
    }
  },

  _onTouchMove: function (/**TouchEvent*/ evt) {
    if (tapEvt) {
      let options = this.options,
        fallbackTolerance = options.fallbackTolerance,
        fallbackOffset = options.fallbackOffset,
        touch = evt.touches ? evt.touches[0] : evt,
        ghostMatrix = ghostEl && matrix(ghostEl, true),
        scaleX = ghostEl && ghostMatrix && ghostMatrix.a,
        scaleY = ghostEl && ghostMatrix && ghostMatrix.d,
        relativeScrollOffset =
          PositionGhostAbsolutely &&
          ghostRelativeParent &&
          getRelativeScrollOffset(ghostRelativeParent),
        dx =
          (touch.clientX - tapEvt.clientX + fallbackOffset.x) / (scaleX || 1) +
          (relativeScrollOffset
            ? relativeScrollOffset[0] - ghostRelativeParentInitialScroll[0]
            : 0) /
            (scaleX || 1),
        dy =
          (touch.clientY - tapEvt.clientY + fallbackOffset.y) / (scaleY || 1) +
          (relativeScrollOffset
            ? relativeScrollOffset[1] - ghostRelativeParentInitialScroll[1]
            : 0) /
            (scaleY || 1);

      // only set the status to dragging, when we are actually dragging
      if (!Sortable.active && !awaitingDragStarted) {
        if (
          fallbackTolerance &&
          Math.max(
            Math.abs(touch.clientX - this._lastX),
            Math.abs(touch.clientY - this._lastY)
          ) < fallbackTolerance
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
            f: dy,
          };
        }

        let cssMatrix = `matrix(${ghostMatrix.a},${ghostMatrix.b},${ghostMatrix.c},${ghostMatrix.d},${ghostMatrix.e},${ghostMatrix.f})`;

        css(ghostEl, "webkitTransform", cssMatrix);
        css(ghostEl, "mozTransform", cssMatrix);
        css(ghostEl, "msTransform", cssMatrix);
        css(ghostEl, "transform", cssMatrix);

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
          css(ghostRelativeParent, "position") === "static" &&
          css(ghostRelativeParent, "transform") === "none" &&
          ghostRelativeParent !== document
        ) {
          ghostRelativeParent = ghostRelativeParent.parentNode;
        }

        if (
          ghostRelativeParent !== document.body &&
          ghostRelativeParent !== document.documentElement
        ) {
          if (ghostRelativeParent === document)
            ghostRelativeParent = getWindowScrollingElement();

          rect.top += ghostRelativeParent.scrollTop;
          rect.left += ghostRelativeParent.scrollLeft;
        } else {
          ghostRelativeParent = getWindowScrollingElement();
        }
        ghostRelativeParentInitialScroll = getRelativeScrollOffset(
          ghostRelativeParent
        );
      }

      ghostEl = dragEl.cloneNode(true);

      toggleClass(ghostEl, options.ghostClass, false);
      toggleClass(ghostEl, options.fallbackClass, true);
      toggleClass(ghostEl, options.dragClass, true);

      css(ghostEl, "transition", "");
      css(ghostEl, "transform", "");

      css(ghostEl, "box-sizing", "border-box");
      css(ghostEl, "margin", 0);
      css(ghostEl, "top", rect.top);
      css(ghostEl, "left", rect.left);
      css(ghostEl, "width", rect.width);
      css(ghostEl, "height", rect.height);
      css(ghostEl, "opacity", "0.8");
      css(ghostEl, "position", PositionGhostAbsolutely ? "absolute" : "fixed");
      css(ghostEl, "zIndex", "100000");
      css(ghostEl, "pointerEvents", "none");

      Sortable.ghost = ghostEl;

      container.appendChild(ghostEl);

      // Set transform-origin
      css(
        ghostEl,
        "transform-origin",
        (tapDistanceLeft / parseInt(ghostEl.style.width)) * 100 +
          "% " +
          (tapDistanceTop / parseInt(ghostEl.style.height)) * 100 +
          "%"
      );
    }
  },

  _onDragStart: function (/**Event*/ evt, /**boolean*/ fallback) {
    let _this = this;
    let dataTransfer = evt.dataTransfer;
    let options = _this.options;

    pluginEvent("dragStart", this, { evt });
    if (Sortable.eventCanceled) {
      this._onDrop();
      return;
    }

    pluginEvent("setupClone", this);
    if (!Sortable.eventCanceled) {
      cloneEl = clone(dragEl);

      cloneEl.draggable = false;
      cloneEl.style["will-change"] = "";

      this._hideClone();

      toggleClass(cloneEl, this.options.chosenClass, false);
      Sortable.clone = cloneEl;
    }

    // #1143: IFrame support workaround
    _this.cloneId = _nextTick(function () {
      pluginEvent("clone", _this);
      if (Sortable.eventCanceled) return;

      if (!_this.options.removeCloneOnHide) {
        rootEl.insertBefore(cloneEl, dragEl);
      }
      _this._hideClone();

      _dispatchEvent({
        sortable: _this,
        name: "clone",
      });
    });

    !fallback && toggleClass(dragEl, options.dragClass, true);

    // Set proper drop events
    if (fallback) {
      ignoreNextClick = true;
      _this._loopId = setInterval(_this._emulateDragOver, 50);
    } else {
      // Undo what was set in _prepareDragStart before drag started
      off(document, "mouseup", _this._onDrop);
      off(document, "touchend", _this._onDrop);
      off(document, "touchcancel", _this._onDrop);

      if (dataTransfer) {
        dataTransfer.effectAllowed = "move";
        options.setData && options.setData.call(_this, dataTransfer, dragEl);
      }

      on(document, "drop", _this);

      // #1276 fix:
      css(dragEl, "transform", "translateZ(0)");
    }

    awaitingDragStarted = true;

    _this._dragStartId = _nextTick(
      _this._dragStarted.bind(_this, fallback, evt)
    );
    on(document, "selectstart", _this);

    moved = true;

    if (Safari) {
      css(document.body, "user-select", "none");
    }
  },

  // Returns true - if no further action is needed (either inserted or another condition)
  _onDragOver: function (/**Event*/ evt) {
    let el = this.el,
      target = evt.target,
      dragRect,
      targetRect,
      revert,
      options = this.options,
      group = options.group,
      activeSortable = Sortable.active,
      isOwner = activeGroup === group,
      canSort = options.sort,
      fromSortable = putSortable || activeSortable,
      vertical,
      _this = this,
      completedFired = false;

    if (_silent) return;

    function dragOverEvent(name, extra) {
      pluginEvent(name, _this, {
        evt,
        isOwner,
        axis: vertical ? "vertical" : "horizontal",
        revert,
        dragRect,
        targetRect,
        canSort,
        fromSortable,
        target,
        completed,
        onMove(target, after) {
          return onMove(
            rootEl,
            el,
            dragEl,
            dragRect,
            target,
            getRect(target),
            evt,
            after
          );
        },
        changed,
        ...extra,
      });
    }

    // Capture animation state
    function capture() {
      dragOverEvent("dragOverAnimationCapture");

      _this.captureAnimationState();
      if (_this !== fromSortable) {
        fromSortable.captureAnimationState();
      }
    }

    // Return invocation when dragEl is inserted (or completed)
    function completed(insertion) {
      dragOverEvent("dragOverCompleted", { insertion });

      if (insertion) {
        // Clones must be hidden before folding animation to capture dragRectAbsolute properly
        if (isOwner) {
          activeSortable._hideClone();
        } else {
          activeSortable._showClone(_this);
        }

        if (_this !== fromSortable) {
          // Set ghost class to new sortable's ghost class
          toggleClass(
            dragEl,
            putSortable
              ? putSortable.options.ghostClass
              : activeSortable.options.ghostClass,
            false
          );
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
        _this.animateAll(function () {
          dragOverEvent("dragOverAnimationComplete");
          _this._ignoreWhileAnimating = null;
        });
        if (_this !== fromSortable) {
          fromSortable.animateAll();
          fromSortable._ignoreWhileAnimating = null;
        }
      }

      // Null lastTarget if it is not inside a previously swapped element
      if (
        (target === dragEl && !dragEl.animated) ||
        (target === el && !target.animated)
      ) {
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
        name: "change",
        toEl: el,
        newIndex,
        newDraggableIndex,
        originalEvent: evt,
      });
    }

    if (evt.preventDefault !== void 0) {
      evt.cancelable && evt.preventDefault();
    }

    target = closest(target, options.draggable, el, true);

    dragOverEvent("dragOver");
    if (Sortable.eventCanceled) return completedFired;

    if (
      dragEl.contains(evt.target) ||
      (target.animated && target.animatingX && target.animatingY) ||
      _this._ignoreWhileAnimating === target
    ) {
      return completed(false);
    }

    ignoreNextClick = false;

    if (
      activeSortable &&
      !options.disabled &&
      (isOwner
        ? canSort || (revert = !rootEl.contains(dragEl)) // Reverting item into the original list
        : putSortable === this ||
          ((this.lastPutMode = activeGroup.checkPull(
            this,
            activeSortable,
            dragEl,
            evt
          )) &&
            group.checkPut(this, activeSortable, dragEl, evt)))
    ) {
      vertical = this._getDirection(evt, target) === "vertical";

      dragRect = getRect(dragEl);

      dragOverEvent("dragOverValid");
      if (Sortable.eventCanceled) return completedFired;

      if (revert) {
        parentEl = rootEl; // actualization
        capture();

        this._hideClone();

        dragOverEvent("revert");

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

      if (
        !elLastChild ||
        (_ghostIsLast(evt, vertical, this) && !elLastChild.animated)
      ) {
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

        if (
          onMove(
            rootEl,
            el,
            dragEl,
            dragRect,
            target,
            targetRect,
            evt,
            !!target
          ) !== false
        ) {
          capture();
          el.appendChild(dragEl);
          parentEl = el; // actualization

          changed();
          return completed(true);
        }
      } else if (target.parentNode === el) {
        targetRect = getRect(target);
        let direction = 0,
          targetBeforeFirstSwap,
          differentLevel = dragEl.parentNode !== el,
          differentRowCol = !_dragElInRowColumn(
            (dragEl.animated && dragEl.toRect) || dragRect,
            (target.animated && target.toRect) || targetRect,
            vertical
          ),
          side1 = vertical ? "top" : "left",
          scrolledPastTop =
            isScrolledPast(target, "top", "top") ||
            isScrolledPast(dragEl, "top", "top"),
          scrollBefore = scrolledPastTop ? scrolledPastTop.scrollTop : void 0;

        if (lastTarget !== target) {
          targetBeforeFirstSwap = targetRect[side1];
          pastFirstInvertThresh = false;
          isCircumstantialInvert =
            (!differentRowCol && options.invertSwap) || differentLevel;
        }

        direction = _getSwapDirection(
          evt,
          target,
          targetRect,
          vertical,
          differentRowCol ? 1 : options.swapThreshold,
          options.invertedSwapThreshold == null
            ? options.swapThreshold
            : options.invertedSwapThreshold,
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
          } while (
            sibling &&
            (css(sibling, "display") === "none" || sibling === ghostEl)
          );
        }
        // If dragEl is already beside target: Do not insert
        if (direction === 0 || sibling === target) {
          return completed(false);
        }

        lastTarget = target;

        lastDirection = direction;

        let nextSibling = target.nextElementSibling,
          after = false;

        after = direction === 1;

        let moveVector = onMove(
          rootEl,
          el,
          dragEl,
          dragRect,
          target,
          targetRect,
          evt,
          after
        );

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
            target.parentNode.insertBefore(
              dragEl,
              after ? nextSibling : target
            );
          }

          // Undo chrome's scroll adjustment (has no effect on other browsers)
          if (scrolledPastTop) {
            scrollBy(
              scrolledPastTop,
              0,
              scrollBefore - scrolledPastTop.scrollTop
            );
          }

          parentEl = dragEl.parentNode; // actualization

          // must be done before animation
          if (targetBeforeFirstSwap !== undefined && !isCircumstantialInvert) {
            targetMoveDistance = Math.abs(
              targetBeforeFirstSwap - getRect(target)[side1]
            );
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

  _offMoveEvents: function () {
    off(document, "mousemove", this._onTouchMove);
    off(document, "touchmove", this._onTouchMove);
    off(document, "pointermove", this._onTouchMove);
    off(document, "dragover", nearestEmptyInsertDetectEvent);
    off(document, "mousemove", nearestEmptyInsertDetectEvent);
    off(document, "touchmove", nearestEmptyInsertDetectEvent);
  },

  _offUpEvents: function () {
    let ownerDocument = this.el.ownerDocument;

    off(ownerDocument, "mouseup", this._onDrop);
    off(ownerDocument, "touchend", this._onDrop);
    off(ownerDocument, "pointerup", this._onDrop);
    off(ownerDocument, "touchcancel", this._onDrop);
    off(document, "selectstart", this);
  },

  _onDrop: function (/**Event*/ evt) {
    let el = this.el,
      options = this.options;

    // Get the index of the dragged element within its parent
    newIndex = index(dragEl);
    newDraggableIndex = index(dragEl, options.draggable);

    pluginEvent("drop", this, {
      evt,
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
      off(document, "drop", this);
      off(el, "dragstart", this._onDragStart);
    }
    this._offMoveEvents();
    this._offUpEvents();

    if (Safari) {
      css(document.body, "user-select", "");
    }

    css(dragEl, "transform", "");

    if (evt) {
      if (moved) {
        evt.cancelable && evt.preventDefault();
        !options.dropBubble && evt.stopPropagation();
      }

      ghostEl && ghostEl.parentNode && ghostEl.parentNode.removeChild(ghostEl);

      if (
        rootEl === parentEl ||
        (putSortable && putSortable.lastPutMode !== "clone")
      ) {
        // Remove clone(s)
        cloneEl &&
          cloneEl.parentNode &&
          cloneEl.parentNode.removeChild(cloneEl);
      }

      if (dragEl) {
        if (this.nativeDraggable) {
          off(dragEl, "dragend", this);
        }

        _disableDraggable(dragEl);
        dragEl.style["will-change"] = "";

        // Remove classes
        // ghostClass is added in dragStarted
        if (moved && !awaitingDragStarted) {
          toggleClass(
            dragEl,
            putSortable
              ? putSortable.options.ghostClass
              : this.options.ghostClass,
            false
          );
        }
        toggleClass(dragEl, this.options.chosenClass, false);

        // Drag stop event
        _dispatchEvent({
          sortable: this,
          name: "unchoose",
          toEl: parentEl,
          newIndex: null,
          newDraggableIndex: null,
          originalEvent: evt,
        });

        if (rootEl !== parentEl) {
          if (newIndex >= 0) {
            // Add event
            _dispatchEvent({
              rootEl: parentEl,
              name: "add",
              toEl: parentEl,
              fromEl: rootEl,
              originalEvent: evt,
            });

            // Remove event
            _dispatchEvent({
              sortable: this,
              name: "remove",
              toEl: parentEl,
              originalEvent: evt,
            });

            // drag from one list and drop into another
            _dispatchEvent({
              rootEl: parentEl,
              name: "sort",
              toEl: parentEl,
              fromEl: rootEl,
              originalEvent: evt,
            });

            _dispatchEvent({
              sortable: this,
              name: "sort",
              toEl: parentEl,
              originalEvent: evt,
            });
          }

          putSortable && putSortable.save();
        } else {
          if (newIndex !== oldIndex) {
            if (newIndex >= 0) {
              // drag & drop within the same list
              _dispatchEvent({
                sortable: this,
                name: "update",
                toEl: parentEl,
                originalEvent: evt,
              });

              _dispatchEvent({
                sortable: this,
                name: "sort",
                toEl: parentEl,
                originalEvent: evt,
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
            name: "end",
            toEl: parentEl,
            originalEvent: evt,
          });

          // Save sorting
          this.save();
        }
      }
    }
    this._nulling();
  },

  _nulling: function () {
    pluginEvent("nulling", this);

    rootEl = dragEl = parentEl = ghostEl = nextEl = cloneEl = lastDownEl = cloneHidden = tapEvt = touchEvt = moved = newIndex = newDraggableIndex = oldIndex = oldDraggableIndex = lastTarget = lastDirection = putSortable = activeGroup = Sortable.dragged = Sortable.ghost = Sortable.clone = Sortable.active = null;

    savedInputChecked.forEach(function (el) {
      el.checked = true;
    });

    savedInputChecked.length = lastDx = lastDy = 0;
  },

  handleEvent: function (/**Event*/ evt) {
    switch (evt.type) {
      case "drop":
      case "dragend":
        this._onDrop(evt);
        break;

      case "dragenter":
      case "dragover":
        if (dragEl) {
          this._onDragOver(evt);
          _globalDragOver(evt);
        }
        break;

      case "selectstart":
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
    let items = {},
      rootEl = this.el;

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
      if (typeof modifiedValue !== "undefined") {
        options[name] = modifiedValue;
      } else {
        options[name] = value;
      }

      if (name === "group") {
        _prepareGroup(options);
      }
    }
  },

  /**
   * Destroy
   */
  destroy: function () {
    pluginEvent("destroy", this);
    let el = this.el;

    el[expando] = null;

    off(el, "mousedown", this._onTapStart);
    off(el, "touchstart", this._onTapStart);
    off(el, "pointerdown", this._onTapStart);

    if (this.nativeDraggable) {
      off(el, "dragover", this);
      off(el, "dragenter", this);
    }
    // Remove draggable attributes
    Array.prototype.forEach.call(el.querySelectorAll("[draggable]"), function (
      el
    ) {
      el.removeAttribute("draggable");
    });

    this._onDrop();

    this._disableDelayedDragEvents();

    sortables.splice(sortables.indexOf(this.el), 1);

    this.el = el = null;
  },

  _hideClone: function () {
    if (!cloneHidden) {
      pluginEvent("hideClone", this);
      if (Sortable.eventCanceled) return;

      css(cloneEl, "display", "none");
      if (this.options.removeCloneOnHide && cloneEl.parentNode) {
        cloneEl.parentNode.removeChild(cloneEl);
      }
      cloneHidden = true;
    }
  },

  _showClone: function (putSortable) {
    if (putSortable.lastPutMode !== "clone") {
      this._hideClone();
      return;
    }

    if (cloneHidden) {
      pluginEvent("showClone", this);
      if (Sortable.eventCanceled) return;

      // show clone at dragEl or original position
      if (dragEl.parentNode == rootEl && !this.options.group.revertClone) {
        rootEl.insertBefore(cloneEl, dragEl);
      } else if (nextEl) {
        rootEl.insertBefore(cloneEl, nextEl);
      } else {
        rootEl.appendChild(cloneEl);
      }

      if (this.options.group.revertClone) {
        this.animate(dragEl, cloneEl);
      }

      css(cloneEl, "display", "");
      cloneHidden = false;
    }
  },
};

function _globalDragOver(/**Event*/ evt) {
  if (evt.dataTransfer) {
    evt.dataTransfer.dropEffect = "move";
  }
  evt.cancelable && evt.preventDefault();
}

function onMove(
  fromEl,
  toEl,
  dragEl,
  dragRect,
  targetEl,
  targetRect,
  originalEvent,
  willInsertAfter
) {
  let evt,
    sortable = fromEl[expando],
    onMoveFn = sortable.options.onMove,
    retVal;
  // Support for new CustomEvent feature
  if (window.CustomEvent && !IE11OrLess && !Edge) {
    evt = new CustomEvent("move", {
      bubbles: true,
      cancelable: true,
    });
  } else {
    evt = document.createEvent("Event");
    evt.initEvent("move", true, true);
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

  return vertical
    ? evt.clientX > rect.right + spacer ||
        (evt.clientX <= rect.right &&
          evt.clientY > rect.bottom &&
          evt.clientX >= rect.left)
    : (evt.clientX > rect.right && evt.clientY > rect.top) ||
        (evt.clientX <= rect.right && evt.clientY > rect.bottom + spacer);
}

function _getSwapDirection(
  evt,
  target,
  targetRect,
  vertical,
  swapThreshold,
  invertedSwapThreshold,
  invertSwap,
  isLastTarget
) {
  let mouseOnAxis = vertical ? evt.clientY : evt.clientX,
    targetLength = vertical ? targetRect.height : targetRect.width,
    targetS1 = vertical ? targetRect.top : targetRect.left,
    targetS2 = vertical ? targetRect.bottom : targetRect.right,
    invert = false;

  if (!invertSwap) {
    // Never invert or create dragEl shadow when target movemenet causes mouse to move past the end of regular swapThreshold
    if (isLastTarget && targetMoveDistance < targetLength * swapThreshold) {
      // multiplied only by swapThreshold because mouse will already be inside target by (1 - threshold) * targetLength / 2
      // check if past first invert threshold on side opposite of lastDirection
      if (
        !pastFirstInvertThresh &&
        (lastDirection === 1
          ? mouseOnAxis > targetS1 + (targetLength * invertedSwapThreshold) / 2
          : mouseOnAxis < targetS2 - (targetLength * invertedSwapThreshold) / 2)
      ) {
        // past first invert threshold, do not restrict inverted threshold to dragEl shadow
        pastFirstInvertThresh = true;
      }

      if (!pastFirstInvertThresh) {
        // dragEl shadow (target move distance shadow)
        if (
          lastDirection === 1
            ? mouseOnAxis < targetS1 + targetMoveDistance // over dragEl shadow
            : mouseOnAxis > targetS2 - targetMoveDistance
        ) {
          return -lastDirection;
        }
      } else {
        invert = true;
      }
    } else {
      // Regular
      if (
        mouseOnAxis > targetS1 + (targetLength * (1 - swapThreshold)) / 2 &&
        mouseOnAxis < targetS2 - (targetLength * (1 - swapThreshold)) / 2
      ) {
        return _getInsertDirection(target);
      }
    }
  }

  invert = invert || invertSwap;

  if (invert) {
    // Invert of regular
    if (
      mouseOnAxis < targetS1 + (targetLength * invertedSwapThreshold) / 2 ||
      mouseOnAxis > targetS2 - (targetLength * invertedSwapThreshold) / 2
    ) {
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

  let inputs = root.getElementsByTagName("input");
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
  on(document, "touchmove", function (evt) {
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
  getChild: getChild,
};

/**
 * Get the Sortable instance of an element
 * @param  {HTMLElement} element The element
 * @return {Sortable|undefined}         The instance of Sortable
 */
Sortable.get = function (element) {
  return element[expando];
};

/**
 * Mount a plugin to Sortable
 * @param  {...SortablePlugin|SortablePlugin[]} plugins       Plugins being mounted
 */
Sortable.mount = function (...plugins) {
  if (plugins[0].constructor === Array) plugins = plugins[0];

  plugins.forEach((plugin) => {
    if (!plugin.prototype || !plugin.prototype.constructor) {
      throw `Sortable: Mounted plugin must be a constructor function, not ${{}.toString.call(
        plugin
      )}`;
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

let autoScrolls = [],
  scrollEl,
  scrollRootEl,
  scrolling = false,
  lastAutoScrollX,
  lastAutoScrollY,
  touchEvt$1,
  pointerElemChangedInterval;

function AutoScrollPlugin() {
  function AutoScroll() {
    this.defaults = {
      scroll: true,
      scrollSensitivity: 30,
      scrollSpeed: 10,
      bubbleScroll: true,
    };

    // Bind all private methods
    for (let fn in this) {
      if (fn.charAt(0) === "_" && typeof this[fn] === "function") {
        this[fn] = this[fn].bind(this);
      }
    }
  }

  AutoScroll.prototype = {
    dragStarted({ originalEvent }) {
      if (this.sortable.nativeDraggable) {
        on(document, "dragover", this._handleAutoScroll);
      } else {
        if (this.options.supportPointer) {
          on(document, "pointermove", this._handleFallbackAutoScroll);
        } else if (originalEvent.touches) {
          on(document, "touchmove", this._handleFallbackAutoScroll);
        } else {
          on(document, "mousemove", this._handleFallbackAutoScroll);
        }
      }
    },

    dragOverCompleted({ originalEvent }) {
      // For when bubbling is canceled and using fallback (fallback 'touchmove' always reached)
      if (!this.options.dragOverBubble && !originalEvent.rootEl) {
        this._handleAutoScroll(originalEvent);
      }
    },

    drop() {
      if (this.sortable.nativeDraggable) {
        off(document, "dragover", this._handleAutoScroll);
      } else {
        off(document, "pointermove", this._handleFallbackAutoScroll);
        off(document, "touchmove", this._handleFallbackAutoScroll);
        off(document, "mousemove", this._handleFallbackAutoScroll);
      }

      clearPointerElemChangedInterval();
      clearAutoScrolls();
      cancelThrottle();
    },

    nulling() {
      touchEvt$1 = scrollRootEl = scrollEl = scrolling = pointerElemChangedInterval = lastAutoScrollX = lastAutoScrollY = null;

      autoScrolls.length = 0;
    },

    _handleFallbackAutoScroll(evt) {
      this._handleAutoScroll(evt, true);
    },

    _handleAutoScroll(evt, fallback) {
      const x = (evt.touches ? evt.touches[0] : evt).clientX,
        y = (evt.touches ? evt.touches[0] : evt).clientY,
        elem = document.elementFromPoint(x, y);

      touchEvt$1 = evt;

      // IE does not seem to have native autoscroll,
      // Edge's autoscroll seems too conditional,
      // MACOS Safari does not have autoscroll,
      // Firefox and Chrome are good
      if (fallback || Edge || IE11OrLess || Safari) {
        autoScroll(evt, this.options, elem, fallback);

        // Listener for pointer element change
        let ogElemScroller = getParentAutoScrollElement(elem, true);
        if (
          scrolling &&
          (!pointerElemChangedInterval ||
            x !== lastAutoScrollX ||
            y !== lastAutoScrollY)
        ) {
          pointerElemChangedInterval && clearPointerElemChangedInterval();
          // Detect for pointer elem change, emulating native DnD behaviour
          pointerElemChangedInterval = setInterval(() => {
            let newElem = getParentAutoScrollElement(
              document.elementFromPoint(x, y),
              true
            );
            if (newElem !== ogElemScroller) {
              ogElemScroller = newElem;
              clearAutoScrolls();
            }
            autoScroll(evt, this.options, newElem, fallback);
          }, 10);
          lastAutoScrollX = x;
          lastAutoScrollY = y;
        }
      } else {
        // if DnD is enabled (and browser has good autoscrolling), first autoscroll will already scroll, so get parent autoscroll of first autoscroll
        if (
          !this.options.bubbleScroll ||
          getParentAutoScrollElement(elem, true) === getWindowScrollingElement()
        ) {
          clearAutoScrolls();
          return;
        }
        autoScroll(
          evt,
          this.options,
          getParentAutoScrollElement(elem, false),
          false
        );
      }
    },
  };

  return Object.assign(AutoScroll, {
    pluginName: "scroll",
    initializeByDefault: true,
  });
}

function clearAutoScrolls() {
  autoScrolls.forEach(function (autoScroll) {
    clearInterval(autoScroll.pid);
  });
  autoScrolls = [];
}

function clearPointerElemChangedInterval() {
  clearInterval(pointerElemChangedInterval);
}

const autoScroll = throttle(function (evt, options, rootEl, isFallback) {
  // Bug: https://bugzilla.mozilla.org/show_bug.cgi?id=505521
  if (!options.scroll) return;
  const x = (evt.touches ? evt.touches[0] : evt).clientX,
    y = (evt.touches ? evt.touches[0] : evt).clientY,
    sens = options.scrollSensitivity,
    speed = options.scrollSpeed,
    winScroller = getWindowScrollingElement();

  let scrollThisInstance = false,
    scrollCustomFn;

  // New scroll root, set scrollEl
  if (scrollRootEl !== rootEl) {
    scrollRootEl = rootEl;

    clearAutoScrolls();

    scrollEl = options.scroll;
    scrollCustomFn = options.scrollFn;

    if (scrollEl === true) {
      scrollEl = getParentAutoScrollElement(rootEl, true);
    }
  }

  let layersOut = 0;
  let currentParent = scrollEl;
  do {
    let el = currentParent,
      rect = getRect(el),
      top = rect.top,
      bottom = rect.bottom,
      left = rect.left,
      right = rect.right,
      width = rect.width,
      height = rect.height,
      canScrollX,
      canScrollY,
      scrollWidth = el.scrollWidth,
      scrollHeight = el.scrollHeight,
      elCSS = css(el),
      scrollPosX = el.scrollLeft,
      scrollPosY = el.scrollTop;

    if (el === winScroller) {
      canScrollX =
        width < scrollWidth &&
        (elCSS.overflowX === "auto" ||
          elCSS.overflowX === "scroll" ||
          elCSS.overflowX === "visible");
      canScrollY =
        height < scrollHeight &&
        (elCSS.overflowY === "auto" ||
          elCSS.overflowY === "scroll" ||
          elCSS.overflowY === "visible");
    } else {
      canScrollX =
        width < scrollWidth &&
        (elCSS.overflowX === "auto" || elCSS.overflowX === "scroll");
      canScrollY =
        height < scrollHeight &&
        (elCSS.overflowY === "auto" || elCSS.overflowY === "scroll");
    }

    let vx =
      canScrollX &&
      (Math.abs(right - x) <= sens && scrollPosX + width < scrollWidth) -
        (Math.abs(left - x) <= sens && !!scrollPosX);
    let vy =
      canScrollY &&
      (Math.abs(bottom - y) <= sens && scrollPosY + height < scrollHeight) -
        (Math.abs(top - y) <= sens && !!scrollPosY);

    if (!autoScrolls[layersOut]) {
      for (let i = 0; i <= layersOut; i++) {
        if (!autoScrolls[i]) {
          autoScrolls[i] = {};
        }
      }
    }

    if (
      autoScrolls[layersOut].vx != vx ||
      autoScrolls[layersOut].vy != vy ||
      autoScrolls[layersOut].el !== el
    ) {
      autoScrolls[layersOut].el = el;
      autoScrolls[layersOut].vx = vx;
      autoScrolls[layersOut].vy = vy;

      clearInterval(autoScrolls[layersOut].pid);

      if (vx != 0 || vy != 0) {
        scrollThisInstance = true;
        /* jshint loopfunc:true */
        autoScrolls[layersOut].pid = setInterval(
          function () {
            // emulate drag over during autoscroll (fallback), emulating native DnD behaviour
            if (isFallback && this.layer === 0) {
              Sortable.active._onTouchMove(touchEvt$1); // To move ghost if it is positioned absolutely
            }
            let scrollOffsetY = autoScrolls[this.layer].vy
              ? autoScrolls[this.layer].vy * speed
              : 0;
            let scrollOffsetX = autoScrolls[this.layer].vx
              ? autoScrolls[this.layer].vx * speed
              : 0;

            if (typeof scrollCustomFn === "function") {
              if (
                scrollCustomFn.call(
                  Sortable.dragged.parentNode[expando],
                  scrollOffsetX,
                  scrollOffsetY,
                  evt,
                  touchEvt$1,
                  autoScrolls[this.layer].el
                ) !== "continue"
              ) {
                return;
              }
            }

            scrollBy(autoScrolls[this.layer].el, scrollOffsetX, scrollOffsetY);
          }.bind({ layer: layersOut }),
          24
        );
      }
    }
    layersOut++;
  } while (options.bubbleScroll && currentParent !== winScroller && (currentParent = getParentAutoScrollElement(currentParent, false)));
  scrolling = scrollThisInstance; // in case another function catches scrolling as false in between when it is not
}, 30);

const drop = function ({
  originalEvent,
  putSortable,
  dragEl,
  activeSortable,
  dispatchSortableEvent,
  hideGhostForTarget,
  unhideGhostForTarget,
}) {
  if (!originalEvent) return;
  let toSortable = putSortable || activeSortable;
  hideGhostForTarget();
  let touch =
    originalEvent.changedTouches && originalEvent.changedTouches.length
      ? originalEvent.changedTouches[0]
      : originalEvent;
  let target = document.elementFromPoint(touch.clientX, touch.clientY);
  unhideGhostForTarget();
  if (toSortable && !toSortable.el.contains(target)) {
    dispatchSortableEvent("spill");
    this.onSpill({ dragEl, putSortable });
  }
};

function Revert() {}

Revert.prototype = {
  startIndex: null,
  dragStart({ oldDraggableIndex }) {
    this.startIndex = oldDraggableIndex;
  },
  onSpill({ dragEl, putSortable }) {
    this.sortable.captureAnimationState();
    if (putSortable) {
      putSortable.captureAnimationState();
    }
    let nextSibling = getChild(this.sortable.el, this.startIndex, this.options);

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
  drop,
};

Object.assign(Revert, {
  pluginName: "revertOnSpill",
});

function Remove() {}

Remove.prototype = {
  onSpill({ dragEl, putSortable }) {
    const parentSortable = putSortable || this.sortable;
    parentSortable.captureAnimationState();
    dragEl.parentNode && dragEl.parentNode.removeChild(dragEl);
    parentSortable.animateAll();
  },
  drop,
};

Object.assign(Remove, {
  pluginName: "removeOnSpill",
});

let lastSwapEl;

function SwapPlugin() {
  function Swap() {
    this.defaults = {
      swapClass: "sortable-swap-highlight",
    };
  }

  Swap.prototype = {
    dragStart({ dragEl }) {
      lastSwapEl = dragEl;
    },
    dragOverValid({
      completed,
      target,
      onMove,
      activeSortable,
      changed,
      cancel,
    }) {
      if (!activeSortable.options.swap) return;
      let el = this.sortable.el,
        options = this.options;
      if (target && target !== el) {
        let prevSwapEl = lastSwapEl;
        if (onMove(target) !== false) {
          toggleClass(target, options.swapClass, true);
          lastSwapEl = target;
        } else {
          lastSwapEl = null;
        }

        if (prevSwapEl && prevSwapEl !== lastSwapEl) {
          toggleClass(prevSwapEl, options.swapClass, false);
        }
      }
      changed();

      completed(true);
      cancel();
    },
    drop({ activeSortable, putSortable, dragEl }) {
      let toSortable = putSortable || this.sortable;
      let options = this.options;
      lastSwapEl && toggleClass(lastSwapEl, options.swapClass, false);
      if (
        lastSwapEl &&
        (options.swap || (putSortable && putSortable.options.swap))
      ) {
        if (dragEl !== lastSwapEl) {
          toSortable.captureAnimationState();
          if (toSortable !== activeSortable)
            activeSortable.captureAnimationState();
          swapNodes(dragEl, lastSwapEl);

          toSortable.animateAll();
          if (toSortable !== activeSortable) activeSortable.animateAll();
        }
      }
    },
    nulling() {
      lastSwapEl = null;
    },
  };

  return Object.assign(Swap, {
    pluginName: "swap",
    eventProperties() {
      return {
        swapItem: lastSwapEl,
      };
    },
  });
}

function swapNodes(n1, n2) {
  let p1 = n1.parentNode,
    p2 = n2.parentNode,
    i1,
    i2;

  if (!p1 || !p2 || p1.isEqualNode(n2) || p2.isEqualNode(n1)) return;

  i1 = index(n1);
  i2 = index(n2);

  if (p1.isEqualNode(p2) && i1 < i2) {
    i2++;
  }
  p1.insertBefore(n2, p1.children[i1]);
  p2.insertBefore(n1, p2.children[i2]);
}

let multiDragElements = [],
  multiDragClones = [],
  lastMultiDragSelect, // for selection with modifier key down (SHIFT)
  multiDragSortable,
  initialFolding = false, // Initial multi-drag fold when drag started
  folding = false, // Folding any other time
  dragStarted = false,
  dragEl$1,
  clonesFromRect,
  clonesHidden;

function MultiDragPlugin() {
  function MultiDrag(sortable) {
    // Bind all private methods
    for (let fn in this) {
      if (fn.charAt(0) === "_" && typeof this[fn] === "function") {
        this[fn] = this[fn].bind(this);
      }
    }

    if (sortable.options.supportPointer) {
      on(document, "pointerup", this._deselectMultiDrag);
    } else {
      on(document, "mouseup", this._deselectMultiDrag);
      on(document, "touchend", this._deselectMultiDrag);
    }

    on(document, "keydown", this._checkKeyDown);
    on(document, "keyup", this._checkKeyUp);

    this.defaults = {
      selectedClass: "sortable-selected",
      multiDragKey: null,
      setData(dataTransfer, dragEl) {
        let data = "";
        if (multiDragElements.length && multiDragSortable === sortable) {
          multiDragElements.forEach((multiDragElement, i) => {
            data += (!i ? "" : ", ") + multiDragElement.textContent;
          });
        } else {
          data = dragEl.textContent;
        }
        dataTransfer.setData("Text", data);
      },
    };
  }

  MultiDrag.prototype = {
    multiDragKeyDown: false,
    isMultiDrag: false,

    delayStartGlobal({ dragEl: dragged }) {
      dragEl$1 = dragged;
    },

    delayEnded() {
      this.isMultiDrag = ~multiDragElements.indexOf(dragEl$1);
    },

    setupClone({ sortable, cancel }) {
      if (!this.isMultiDrag) return;
      for (let i = 0; i < multiDragElements.length; i++) {
        multiDragClones.push(clone(multiDragElements[i]));

        multiDragClones[i].sortableIndex = multiDragElements[i].sortableIndex;

        multiDragClones[i].draggable = false;
        multiDragClones[i].style["will-change"] = "";

        toggleClass(multiDragClones[i], this.options.selectedClass, false);
        multiDragElements[i] === dragEl$1 &&
          toggleClass(multiDragClones[i], this.options.chosenClass, false);
      }

      sortable._hideClone();
      cancel();
    },

    clone({ sortable, rootEl, dispatchSortableEvent, cancel }) {
      if (!this.isMultiDrag) return;
      if (!this.options.removeCloneOnHide) {
        if (multiDragElements.length && multiDragSortable === sortable) {
          insertMultiDragClones(true, rootEl);
          dispatchSortableEvent("clone");

          cancel();
        }
      }
    },

    showClone({ cloneNowShown, rootEl, cancel }) {
      if (!this.isMultiDrag) return;
      insertMultiDragClones(false, rootEl);
      multiDragClones.forEach((clone) => {
        css(clone, "display", "");
      });

      cloneNowShown();
      clonesHidden = false;
      cancel();
    },

    hideClone({ sortable, cloneNowHidden, cancel }) {
      if (!this.isMultiDrag) return;
      multiDragClones.forEach((clone) => {
        css(clone, "display", "none");
        if (this.options.removeCloneOnHide && clone.parentNode) {
          clone.parentNode.removeChild(clone);
        }
      });

      cloneNowHidden();
      clonesHidden = true;
      cancel();
    },

    dragStartGlobal({ sortable }) {
      if (!this.isMultiDrag && multiDragSortable) {
        multiDragSortable.multiDrag._deselectMultiDrag();
      }

      multiDragElements.forEach((multiDragElement) => {
        multiDragElement.sortableIndex = index(multiDragElement);
      });

      // Sort multi-drag elements
      multiDragElements = multiDragElements.sort(function (a, b) {
        return a.sortableIndex - b.sortableIndex;
      });
      dragStarted = true;
    },

    dragStarted({ sortable }) {
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
          multiDragElements.forEach((multiDragElement) => {
            if (multiDragElement === dragEl$1) return;
            css(multiDragElement, "position", "absolute");
          });

          let dragRect = getRect(dragEl$1, false, true, true);

          multiDragElements.forEach((multiDragElement) => {
            if (multiDragElement === dragEl$1) return;
            setRect(multiDragElement, dragRect);
          });

          folding = true;
          initialFolding = true;
        }
      }

      sortable.animateAll(() => {
        folding = false;
        initialFolding = false;

        if (this.options.animation) {
          multiDragElements.forEach((multiDragElement) => {
            unsetRect(multiDragElement);
          });
        }

        // Remove all auxiliary multidrag items from el, if sorting enabled
        if (this.options.sort) {
          removeMultiDragElements();
        }
      });
    },

    dragOver({ target, completed, cancel }) {
      if (folding && ~multiDragElements.indexOf(target)) {
        completed(false);
        cancel();
      }
    },

    revert({ fromSortable, rootEl, sortable, dragRect }) {
      if (multiDragElements.length > 1) {
        // Setup unfold animation
        multiDragElements.forEach((multiDragElement) => {
          sortable.addAnimationState({
            target: multiDragElement,
            rect: folding ? getRect(multiDragElement) : dragRect,
          });

          unsetRect(multiDragElement);

          multiDragElement.fromRect = dragRect;

          fromSortable.removeAnimationState(multiDragElement);
        });
        folding = false;
        insertMultiDragElements(!this.options.removeCloneOnHide, rootEl);
      }
    },

    dragOverCompleted({
      sortable,
      isOwner,
      insertion,
      activeSortable,
      parentEl,
      putSortable,
    }) {
      let options = this.options;
      if (insertion) {
        // Clones must be hidden before folding animation to capture dragRectAbsolute properly
        if (isOwner) {
          activeSortable._hideClone();
        }

        initialFolding = false;
        // If leaving sort:false root, or already folding - Fold to new location
        if (
          options.animation &&
          multiDragElements.length > 1 &&
          (folding ||
            (!isOwner && !activeSortable.options.sort && !putSortable))
        ) {
          // Fold: Set all multi drag elements's rects to dragEl's rect when multi-drag elements are invisible
          let dragRectAbsolute = getRect(dragEl$1, false, true, true);

          multiDragElements.forEach((multiDragElement) => {
            if (multiDragElement === dragEl$1) return;
            setRect(multiDragElement, dragRectAbsolute);

            // Move element(s) to end of parentEl so that it does not interfere with multi-drag clones insertion if they are inserted
            // while folding, and so that we can capture them again because old sortable will no longer be fromSortable
            parentEl.appendChild(multiDragElement);
          });

          folding = true;
        }

        // Clones must be shown (and check to remove multi drags) after folding when interfering multiDragElements are moved out
        if (!isOwner) {
          // Only remove if not folding (folding will remove them anyways)
          if (!folding) {
            removeMultiDragElements();
          }

          if (multiDragElements.length > 1) {
            let clonesHiddenBefore = clonesHidden;
            activeSortable._showClone(sortable);

            // Unfold animation for clones if showing from hidden
            if (
              activeSortable.options.animation &&
              !clonesHidden &&
              clonesHiddenBefore
            ) {
              multiDragClones.forEach((clone) => {
                activeSortable.addAnimationState({
                  target: clone,
                  rect: clonesFromRect,
                });

                clone.fromRect = clonesFromRect;
                clone.thisAnimationDuration = null;
              });
            }
          } else {
            activeSortable._showClone(sortable);
          }
        }
      }
    },

    dragOverAnimationCapture({ dragRect, isOwner, activeSortable }) {
      multiDragElements.forEach((multiDragElement) => {
        multiDragElement.thisAnimationDuration = null;
      });

      if (
        activeSortable.options.animation &&
        !isOwner &&
        activeSortable.multiDrag.isMultiDrag
      ) {
        clonesFromRect = Object.assign({}, dragRect);
        let dragMatrix = matrix(dragEl$1, true);
        clonesFromRect.top -= dragMatrix.f;
        clonesFromRect.left -= dragMatrix.e;
      }
    },

    dragOverAnimationComplete() {
      if (folding) {
        folding = false;
        removeMultiDragElements();
      }
    },

    drop({
      originalEvent: evt,
      rootEl,
      parentEl,
      sortable,
      dispatchSortableEvent,
      oldIndex,
      putSortable,
    }) {
      let toSortable = putSortable || this.sortable;

      if (!evt) return;

      let options = this.options,
        children = parentEl.children;

      // Multi-drag selection
      if (!dragStarted) {
        if (options.multiDragKey && !this.multiDragKeyDown) {
          this._deselectMultiDrag();
        }
        toggleClass(
          dragEl$1,
          options.selectedClass,
          !~multiDragElements.indexOf(dragEl$1)
        );

        if (!~multiDragElements.indexOf(dragEl$1)) {
          multiDragElements.push(dragEl$1);
          dispatchEvent({
            sortable,
            rootEl,
            name: "select",
            targetEl: dragEl$1,
            originalEvt: evt,
          });

          // Modifier activated, select from last to dragEl
          if (
            evt.shiftKey &&
            lastMultiDragSelect &&
            sortable.el.contains(lastMultiDragSelect)
          ) {
            let lastIndex = index(lastMultiDragSelect),
              currentIndex = index(dragEl$1);

            if (~lastIndex && ~currentIndex && lastIndex !== currentIndex) {
              // Must include lastMultiDragSelect (select it), in case modified selection from no selection
              // (but previous selection existed)
              let n, i;
              if (currentIndex > lastIndex) {
                i = lastIndex;
                n = currentIndex;
              } else {
                i = currentIndex;
                n = lastIndex + 1;
              }

              for (; i < n; i++) {
                if (~multiDragElements.indexOf(children[i])) continue;
                toggleClass(children[i], options.selectedClass, true);
                multiDragElements.push(children[i]);

                dispatchEvent({
                  sortable,
                  rootEl,
                  name: "select",
                  targetEl: children[i],
                  originalEvt: evt,
                });
              }
            }
          } else {
            lastMultiDragSelect = dragEl$1;
          }

          multiDragSortable = toSortable;
        } else {
          multiDragElements.splice(multiDragElements.indexOf(dragEl$1), 1);
          lastMultiDragSelect = null;
          dispatchEvent({
            sortable,
            rootEl,
            name: "deselect",
            targetEl: dragEl$1,
            originalEvt: evt,
          });
        }
      }

      // Multi-drag drop
      if (dragStarted && this.isMultiDrag) {
        // Do not "unfold" after around dragEl if reverted
        if (
          (parentEl[expando].options.sort || parentEl !== rootEl) &&
          multiDragElements.length > 1
        ) {
          let dragRect = getRect(dragEl$1),
            multiDragIndex = index(
              dragEl$1,
              ":not(." + this.options.selectedClass + ")"
            );

          if (!initialFolding && options.animation)
            dragEl$1.thisAnimationDuration = null;

          toSortable.captureAnimationState();

          if (!initialFolding) {
            if (options.animation) {
              dragEl$1.fromRect = dragRect;
              multiDragElements.forEach((multiDragElement) => {
                multiDragElement.thisAnimationDuration = null;
                if (multiDragElement !== dragEl$1) {
                  let rect = folding ? getRect(multiDragElement) : dragRect;
                  multiDragElement.fromRect = rect;

                  // Prepare unfold animation
                  toSortable.addAnimationState({
                    target: multiDragElement,
                    rect: rect,
                  });
                }
              });
            }

            // Multi drag elements are not necessarily removed from the DOM on drop, so to reinsert
            // properly they must all be removed
            removeMultiDragElements();

            multiDragElements.forEach((multiDragElement) => {
              if (children[multiDragIndex]) {
                parentEl.insertBefore(
                  multiDragElement,
                  children[multiDragIndex]
                );
              } else {
                parentEl.appendChild(multiDragElement);
              }
              multiDragIndex++;
            });

            // If initial folding is done, the elements may have changed position because they are now
            // unfolding around dragEl, even though dragEl may not have his index changed, so update event
            // must be fired here as Sortable will not.
            if (oldIndex === index(dragEl$1)) {
              let update = false;
              multiDragElements.forEach((multiDragElement) => {
                if (
                  multiDragElement.sortableIndex !== index(multiDragElement)
                ) {
                  update = true;
                  return;
                }
              });

              if (update) {
                dispatchSortableEvent("update");
              }
            }
          }

          // Must be done after capturing individual rects (scroll bar)
          multiDragElements.forEach((multiDragElement) => {
            unsetRect(multiDragElement);
          });

          toSortable.animateAll();
        }

        multiDragSortable = toSortable;
      }

      // Remove clones if necessary
      if (
        rootEl === parentEl ||
        (putSortable && putSortable.lastPutMode !== "clone")
      ) {
        multiDragClones.forEach((clone) => {
          clone.parentNode && clone.parentNode.removeChild(clone);
        });
      }
    },

    nullingGlobal() {
      this.isMultiDrag = dragStarted = false;
      multiDragClones.length = 0;
    },

    destroyGlobal() {
      this._deselectMultiDrag();
      off(document, "pointerup", this._deselectMultiDrag);
      off(document, "mouseup", this._deselectMultiDrag);
      off(document, "touchend", this._deselectMultiDrag);

      off(document, "keydown", this._checkKeyDown);
      off(document, "keyup", this._checkKeyUp);
    },

    _deselectMultiDrag(evt) {
      if (typeof dragStarted !== "undefined" && dragStarted) return;

      // Only deselect if selection is in this sortable
      if (multiDragSortable !== this.sortable) return;

      // Only deselect if target is not item in this sortable
      if (
        evt &&
        closest(evt.target, this.options.draggable, this.sortable.el, false)
      )
        return;

      // Only deselect if left click
      if (evt && evt.button !== 0) return;

      while (multiDragElements.length) {
        let el = multiDragElements[0];
        toggleClass(el, this.options.selectedClass, false);
        multiDragElements.shift();
        dispatchEvent({
          sortable: this.sortable,
          rootEl: this.sortable.el,
          name: "deselect",
          targetEl: el,
          originalEvt: evt,
        });
      }
    },

    _checkKeyDown(evt) {
      if (evt.key === this.options.multiDragKey) {
        this.multiDragKeyDown = true;
      }
    },

    _checkKeyUp(evt) {
      if (evt.key === this.options.multiDragKey) {
        this.multiDragKeyDown = false;
      }
    },
  };

  return Object.assign(MultiDrag, {
    // Static methods & properties
    pluginName: "multiDrag",
    utils: {
      /**
       * Selects the provided multi-drag item
       * @param  {HTMLElement} el    The element to be selected
       */
      select(el) {
        let sortable = el.parentNode[expando];
        if (
          !sortable ||
          !sortable.options.multiDrag ||
          ~multiDragElements.indexOf(el)
        )
          return;
        if (multiDragSortable && multiDragSortable !== sortable) {
          multiDragSortable.multiDrag._deselectMultiDrag();
          multiDragSortable = sortable;
        }
        toggleClass(el, sortable.options.selectedClass, true);
        multiDragElements.push(el);
      },
      /**
       * Deselects the provided multi-drag item
       * @param  {HTMLElement} el    The element to be deselected
       */
      deselect(el) {
        let sortable = el.parentNode[expando],
          index = multiDragElements.indexOf(el);
        if (!sortable || !sortable.options.multiDrag || !~index) return;
        toggleClass(el, sortable.options.selectedClass, false);
        multiDragElements.splice(index, 1);
      },
    },
    eventProperties() {
      const oldIndicies = [],
        newIndicies = [];

      multiDragElements.forEach((multiDragElement) => {
        oldIndicies.push({
          multiDragElement,
          index: multiDragElement.sortableIndex,
        });

        // multiDragElements will already be sorted if folding
        let newIndex;
        if (folding && multiDragElement !== dragEl$1) {
          newIndex = -1;
        } else if (folding) {
          newIndex = index(
            multiDragElement,
            ":not(." + this.options.selectedClass + ")"
          );
        } else {
          newIndex = index(multiDragElement);
        }
        newIndicies.push({
          multiDragElement,
          index: newIndex,
        });
      });
      return {
        items: [...multiDragElements],
        clones: [...multiDragClones],
        oldIndicies,
        newIndicies,
      };
    },
    optionListeners: {
      multiDragKey(key) {
        key = key.toLowerCase();
        if (key === "ctrl") {
          key = "Control";
        } else if (key.length > 1) {
          key = key.charAt(0).toUpperCase() + key.substr(1);
        }
        return key;
      },
    },
  });
}

function insertMultiDragElements(clonesInserted, rootEl) {
  multiDragElements.forEach((multiDragElement, i) => {
    let target =
      rootEl.children[
        multiDragElement.sortableIndex + (clonesInserted ? Number(i) : 0)
      ];
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
function insertMultiDragClones(elementsInserted, rootEl) {
  multiDragClones.forEach((clone, i) => {
    let target =
      rootEl.children[clone.sortableIndex + (elementsInserted ? Number(i) : 0)];
    if (target) {
      rootEl.insertBefore(clone, target);
    } else {
      rootEl.appendChild(clone);
    }
  });
}

function removeMultiDragElements() {
  multiDragElements.forEach((multiDragElement) => {
    if (multiDragElement === dragEl$1) return;
    multiDragElement.parentNode &&
      multiDragElement.parentNode.removeChild(multiDragElement);
  });
}

Sortable.mount(new AutoScrollPlugin());
Sortable.mount(Remove, Revert);

Sortable.mount(new SwapPlugin());
Sortable.mount(new MultiDragPlugin());

export default Sortable;
