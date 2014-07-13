# Sortable


## Features
* Support touch devices and [modern](http://caniuse.com/#search=drag) browsers
* Built using native HTML5 drag and drop API
* Simple API
* Lightweight, 2KB gzipped
* No jQuery


### Usage
```html
<ul id="items">
	<li>item 1</li>
	<li>item 2</li>
	<li>item 3</li>
</ul>
```

```js
var el = document.getElementById('items');
new Sortable(el);
```


---


### Options
```js
new Sortable(el, {
	group: "name",
	store: null, // @see Store
	handle: ".my-handle", // Restricts sort start click/touch to the specified element
	draggable: ".item",   // Specifies which items inside the element should be sortable
	ghostClass: "sortable-ghost",
	
	onStart: function (/**Event*/evt) { // dragging
		var itemEl = evt.item;
	},

	onEnd: function (/**Event*/evt) { // dragging
		var itemEl = evt.item;
	},

	onAdd: function (/**Event*/evt){
		var itemEl = evt.item;
	},

	onUpdate: function (/**Event*/evt){
		var itemEl = evt.item; // the current dragged HTMLElement
	},

	onRemove: function (/**Event*/evt){
		var itemEl = evt.item;
	}
});
```

---


### Method

##### toArray():`String[]`
Serializes the sortable's item data-id's into an array of string.


##### sort(order:`Array`)
Sorts the elements according to the array.
```js
var order = sortable.toArray();
sortable.sort(order.reverse()); // apply
```


##### destroy()


---


### Store
Saving and restoring of the sort.

```js
new Sortable(el, {
	group: "localStorage-example",
	store: {
		/**
		 * Get the order of elements. Called once during initialization.
		 * @param   {Sortable}  sortable
		 * @retruns {Array}
		 */
		get: function (sortable) {
			var order = localStorage.getItem(sortable.options.group);
			return order ? order.split('|') : [];
		},

		/**
		 * Save the order of elements. Called every time at the drag end.
		 * @param {Sortable}  sortable
		 */
		set: function (sortable) {
			var order = sortable.toArray();
			localStorage.setItem(sortable.options.group, order.join('|'));
		}
	}
})
```



---



### Sortable.utils
* on(el`:HTMLElement`, event`:String`, fn`:Function`) — attach an event handler function
* off(el`:HTMLElement`, event`:String`, fn`:Function`) — remove an event handler
* css(el`:HTMLElement`)`:Object` — get the values of all the CSS properties
* css(el`:HTMLElement`, prop`:String`)`:Mixed` — get the value of style properties
* css(el`:HTMLElement`, prop`:String`, value`:String`) — set one CSS properties
* css(el`:HTMLElement`, props`:Object`) — set more CSS properties
* find(ctx`:HTMLElement`, tagName`:String`[, iterator`:Function`])`:Array` — get elements by tag name
* bind(ctx`:Mixed`, fn`:Function`)`:Function` — Takes a function and returns a new one that will always have a particular context
* closest(el`:HTMLElement`, selector`:String`[, ctx`:HTMLElement`])`:HTMLElement|Null` — for each element in the set, get the first element that matches the selector by testing the element itself and traversing up through its ancestors in the DOM tree
* toggleClass(el`:HTMLElement`, name`:String`, state`:Boolean`) — add or remove one classes from each element

