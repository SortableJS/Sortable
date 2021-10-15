## MultiDrag Plugin
This plugin allows users to select multiple items within a sortable at once, and drag them as one item.
Once placed, the items will unfold into their original order, but all beside each other at the new position.
[Read More](https://github.com/SortableJS/Sortable/wiki/Dragging-Multiple-Items-in-Sortable)

Demo: https://jsbin.com/wopavom/edit?js,output


---


### Mounting
```js
import { Sortable, MultiDrag } from 'sortablejs';

Sortable.mount(new MultiDrag());
```


---


### Options

```js
new Sortable(el, {
	multiDrag: true, // Enable the plugin
	selectedClass: "sortable-selected", // Class name for selected item
	multiDragKey: null, // Key that must be down for items to be selected
	avoidImplicitDeselect: false, // true - if you don't want to deselect items on outside click
	
	// Called when an item is selected
	onSelect: function(/**Event*/evt) {
		evt.item // The selected item
	},

	// Called when an item is deselected
	onDeselect: function(/**Event*/evt) {
		evt.item // The deselected item
	}
});
```


---


#### `multiDragKey` option
The key that must be down for multiple items to be selected. The default is `null`, meaning no key must be down.
For special keys, such as the <kbd>CTRL</kbd> key, simply specify the option as `'CTRL'` (casing does not matter).


---


#### `selectedClass` option
Class name for the selected item(s) if multiDrag is enabled. Defaults to `sortable-selected`.

```css
.selected {
  background-color: #f9c7c8;
  border: solid red 1px;
}
```

```js
Sortable.create(list, {
  multiDrag: true,
  selectedClass: "selected"
});
```


---


### Event Properties
 - items:`HTMLElement[]` — Array of selected items, or empty
 - clones:`HTMLElement[]` — Array of clones, or empty
 - oldIndicies:`Index[]` — Array containing information on the old indicies of the selected elements.
 - newIndicies:`Index[]` — Array containing information on the new indicies of the selected elements.

#### Index Object
 - element:`HTMLElement` — The element whose index is being given
 - index:`Number` — The index of the element

#### Note on `newIndicies`
For any event that is fired during sorting, the index of any selected element that is not the main dragged element is given as `-1`.
This is because it has either been removed from the DOM, or because it is in a folding animation (folding to the dragged element) and will be removed after this animation is complete.


---


### Sortable.utils
* select(el:`HTMLElement`) — select the given multi-drag item
* deselect(el:`HTMLElement`) — deselect the given multi-drag item
