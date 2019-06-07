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
	scrollFn: function(offsetX, offsetY, originalEvent, touchEvt, hoverTargetEl) { ... }, // if you have custom scrollbar scrollFn may be used for autoscrolling
	scrollSensitivity: 30, // px, how near the mouse must be to an edge to start scrolling.
	scrollSpeed: 10, // px, speed of the scrolling
	bubbleScroll: true // apply autoscroll to all parent elements, allowing for easier movement
});
```


---


#### `scroll` option
Enables the plugin. Defaults to `true`. May also be set to an HTMLElement which will be where autoscrolling is rooted.

Demo:
 - `window`: https://jsbin.com/dosilir/edit?js,output
 - `overflow: hidden`: https://jsbin.com/xecihez/edit?html,js,output


---


#### `scrollFn` option
Defines function that will be used for autoscrolling. el.scrollTop/el.scrollLeft is used by default.
Useful when you have custom scrollbar with dedicated scroll function.
This function should return `'continue'` if it wishes to allow Sortable's native autoscrolling.


---


#### `scrollSensitivity` option
Defines how near the mouse must be to an edge to start scrolling.


---


#### `scrollSpeed` option
The speed at which the window should scroll once the mouse pointer gets within the `scrollSensitivity` distance.


---


#### `bubbleScroll` option
If set to `true`, the normal `autoscroll` function will also be applied to all parent elements of the element the user is dragging over.

Demo: https://jsbin.com/kesewor/edit?html,js,output


---
