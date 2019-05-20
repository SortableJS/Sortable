## MultiDrag Plugin
This plugin allows users to select multiple items within a sortable at once, and drag them as one item.
Once placed, the items will unfold into their original order, but all beside eachother at the new position.
[Read More](https://github.com/SortableJS/Sortable/wiki/Dragging-Multiple-Items-in-Sortable)

Demo: https://jsbin.com/wopavom/edit?js,output


---


### Options

```js
new Sortable(el, {
	multiDrag: false, // Enable the plugin
	selectedClass: "sortable-selected", // Class name for selected item

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
 - items:`HTMLElement[]` - Array of selected items, or empty
 - clones:`HTMLElement[]` - Array of clones, or empty


---


### Sortable.utils
* select(el`:HTMLElement`) — select the given multi-drag item
* deselect(el`:HTMLElement`) — deselect the given multi-drag item
