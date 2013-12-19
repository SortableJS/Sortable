# Sortable


## Features
* Support touch devices
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

	onAdd: function (evt){
		var itemEl = ui.detail;
	},

	onUpdate: function (evt){
		var itemEl = ui.detail; // the current dragged HTMLElement
	},

	onRemove: function (evt){
		var itemEl = ui.detail;
	}
});
```
