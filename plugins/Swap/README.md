## Swap Plugin
This plugin modifies the behaviour of Sortable to allow for items to be swapped with eachother rather than sorted. Once dragging starts, the user can drag over other items and there will be no change in the elements. However, the item that the user drops on will be swapped with the originally dragged item.

Demo: https://jsbin.com/yejehog/edit?html,js,output


---


### Mounting
```js
import { Sortable, Swap } from 'sortablejs/modular/sortable.core.esm';

Sortable.mount(new Swap());
```


---


### Options

```js
new Sortable(el, {
	swap: true, // Enable swap mode
	swapClass: "sortable-swap-highlight" // Class name for swap item (if swap mode is enabled)
});
```


---


#### `swapClass` option
Class name for the item to be swapped with, if swap mode is enabled. Defaults to `sortable-swap-highlight`.

```css
.highlighted {
  background-color: #9AB6F1;
}
```

```js
Sortable.create(list, {
  swap: true,
  swapClass: "highlighted"
});
```


---


### Event Properties
 - swapItem:`HTMLElement|undefined` — The element that the dragged element was swapped with
