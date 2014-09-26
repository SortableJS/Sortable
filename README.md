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
	filter: ".ignor-elements", // Selectors that do not lead to dragging (String or Function)
	draggable: ".item",   // Specifies which items inside the element should be sortable
	ghostClass: "sortable-ghost",
	
	onStart: function (/**Event*/evt) { /* dragging */ },
	onEnd: function (/**Event*/evt) { /* dragging */ },

	onAdd: function (/**Event*/evt){
		var itemEl = evt.item; // dragged HTMLElement
	},

	onUpdate: function (/**Event*/evt){
		var itemEl = evt.item; // dragged HTMLElement
	},

	onRemove: function (/**Event*/evt){
		var itemEl = evt.item; // dragged HTMLElement
	},

	onFilter: function (/**Event*/evt){
		var itemEl = evt.item; // HTMLElement on which was `mousedown|tapstart` event.
	}
});
```

---


### Method

##### closest(el:`String`[, selector:`HTMLElement`]):`HTMLElement|null`
For each element in the set, get the first element that matches the selector by testing the element itself and traversing up through its ancestors in the DOM tree.

```js
var editableList = new Sortable(list, {
	filter: ".js-remove, .js-edit",
	onFilter: function (evt) {
		var el = editableList.closest(evt.item); // list item

		if (editableList.closest(evt.item, ".js-remove")) { // Click on remove button
			el.parentNode.removeChild(el); // remove sortable item
		}
		else if (editableList.closest(evt.item, ".js-edit")) { // Click on edit link
			// ...
		}
	}
})
```


##### toArray():`String[]`
Serializes the sortable's item `data-id`'s into an array of string.


##### sort(order:`String[]`)
Sorts the elements according to the array.
```js
var order = sortable.toArray();
sortable.sort(order.reverse()); // apply
```


##### destroy()


---


### Store
Saving and restoring of the sort.

```html
<ul>
	<li data-id="1">order</li>
	<li data-id="2">save</li>
	<li data-id="3">restore</li>
</ul>
```

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


---



## MIT LICENSE
Copyright 2013 Lebedev Konstantin <ibnRubaXa@gmail.com>
http://rubaxa.github.io/Sortable/

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
"Software"), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

