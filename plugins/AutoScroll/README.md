## AutoScroll
This plugin allows for the page to automatically scroll during dragging near a scrollable element's edge on mobile devices and IE9 (or whenever fallback is enabled), and also enhances most browser's native drag-and-drop autoscrolling.
Demo:
 - `window`: https://jsbin.com/dosilir/edit?js,output
 - `overflow: hidden`: https://jsbin.com/xecihez/edit?html,js,output

**This plugin is a default plugin, and is included in the default UMD and ESM builds of Sortable**


---


### Mounting
```js
import { Sortable, AutoScroll } from 'sortablejs';

Sortable.mount(new AutoScroll());
```


---


### Options

```js
new Sortable(el, {
	scroll: true, // Enable the plugin. Can be HTMLElement.
	forceAutoscrollFallback: false, // force autoscroll plugin to enable even when native browser autoscroll is available
	scrollFn: function(offsetX, offsetY, originalEvent, touchEvt, hoverTargetEl) { ... }, // if you have custom scrollbar scrollFn may be used for autoscrolling
	scrollSensitivity: 30, // px, how near the mouse must be to an edge to start scrolling.
	scrollSpeed: 10, // px, speed of the scrolling
	bubbleScroll: true // apply autoscroll to all parent elements, allowing for easier movement
});
```


---


#### `scroll` option
Enables the plugin. Defaults to `true`. May also be set to an HTMLElement which will be where autoscrolling is rooted.

**Note: Just because this plugin is enabled does not mean that it will always be used for autoscrolling. Some browsers have native drag and drop autoscroll, in which case this autoscroll plugin won't be invoked. If you wish to have this always be invoked for autoscrolling, set the option `forceAutoScrollFallback` to `true`.**

Demo:
 - `window`: https://jsbin.com/dosilir/edit?js,output
 - `overflow: hidden`: https://jsbin.com/xecihez/edit?html,js,output


---


#### `forceAutoScrollFallback` option
Enables sortable's autoscroll even when the browser can handle it (with native drag and drop). Defaults to `false`. This will not disable the native autoscrolling. Note that setting `forceFallback: true` in the sortable options will also enable this.


---


#### `scrollFn` option
Useful when you have custom scrollbar with dedicated scroll function.
Defines a function that will be used for autoscrolling. Sortable uses el.scrollTop/el.scrollLeft by default. Set this option if you wish to handle it differently.
This function should return `'continue'` if it wishes to allow Sortable's native autoscrolling, otherwise Sortable will not scroll anything if this option is set.

**Note that this option will only work if Sortable's autoscroll function is invoked.**

It is invoked if any of the following are true:
 - The `forceFallback: true` option is set
 - It is a mobile device
 - The browser is either Safari, Internet Explorer, or Edge


---


#### `scrollSensitivity` option
Defines how near the mouse must be to an edge to start scrolling.

**Note that this option will only work if Sortable's autoscroll function is invoked.**

It is invoked if any of the following are true:
 - The `forceFallback: true` option is set
 - It is a mobile device
 - The browser is either Safari, Internet Explorer, or Edge


---


#### `scrollSpeed` option
The speed at which the window should scroll once the mouse pointer gets within the `scrollSensitivity` distance.

**Note that this option will only work if Sortable's autoscroll function is invoked.**

It is invoked if any of the following are true:
 - The `forceFallback: true` option is set
 - It is a mobile device
 - The browser is either Safari, Internet Explorer, or Edge

---


#### `bubbleScroll` option
If set to `true`, the normal `autoscroll` function will also be applied to all parent elements of the element the user is dragging over.

Demo: https://jsbin.com/kesewor/edit?html,js,output


---
