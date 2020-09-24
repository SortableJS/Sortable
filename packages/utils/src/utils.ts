import { IE11OrLess } from "./browser-info";
import Sortable from "../../sortable/src/Sortable";

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

  const matrixFn =
    window.DOMMatrix ||
    window.WebKitCSSMatrix ||
    //@ts-ignore
    window.CSSMatrix ||
    //@ts-ignore
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

  // Fix IE11 "SCRIPT16389: Unspecified error." when dragging element #1904
  // submitted by laukstein
  if (el !== window && el.parentNode && el !== getWindowScrollingElement()) {
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
          top -=
            //@ts-ignore
            containerRect.top + parseInt(css(container, "border-top-width"));
          left -=
            //@ts-ignore
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
    if (
      el.nodeName.toUpperCase() !== "TEMPLATE" &&
      //@ts-ignore
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

export {
  on,
  off,
  matches,
  getParentOrHost,
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
  indexOfObject,
  getParentAutoScrollElement,
  extend,
  isRectEqual,
  throttle,
  cancelThrottle,
  scrollBy,
  clone,
  setRect,
  unsetRect,
  expando,
};
