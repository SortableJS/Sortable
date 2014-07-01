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
new Sortable(items);
```


### Options
```js
new Sortable(elem, {
	group: "name",
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


[![Bitdeli Badge](https://d2weczhvl823v0.cloudfront.net/RubaXa/sortable/trend.png)](https://bitdeli.com/free "Bitdeli Badge")

