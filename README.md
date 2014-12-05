# Sortable
Sortable is a minimalist JavaScript library for reorderable drag-and-drop lists.

Demo: http://rubaxa.github.io/Sortable/


## Features

 * Supports touch devices and [modern](http://caniuse.com/#search=drag) browsers
 * Can drag from one list to another or within the same list
 * CSS animation when moving items
 * Supports drag handles *and selectable text* (better than voidberg's html5sortable)
 * Built using native HTML5 drag and drop API
 * Supports [AngularJS](#ng) and and any CSS library, e.g. [Bootstrap](#bs)
 * Simple API
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
var sortable = Sortable.create(el);
```

You can use any element for the list and its elements, not just `ul`/`li`. Here is an [example with `div`s](http://jsbin.com/luxero/2/edit?html,js,output).


---


### Options
```js
var sortable = new Sortable(el, {
	group: "name",  // or { name: "..", pull: [true, false, clone], put: [true, false, array] }
	sort: true,  // sorting inside list
	store: null,  // @see Store
	animation: 150,  // ms, animation speed moving items when sorting, `0` — without animation
	handle: ".my-handle",  // Drag handle selector within list items
	filter: ".ignore-elements",  // Selectors that do not lead to dragging (String or Function)
	draggable: ".item",  // Specifies which items inside the element should be sortable
	ghostClass: "sortable-ghost",  // Class name for the drop placeholder - jsbin.com/luxero/3
	setData: function (dataTransfer, dragEl) {
		dataTransfer.setData('Text', dragEl.textContent);
	},

	onStart: function (/*Event*/evt) { /* dragging started*/ },
	onEnd: function (/*Event*/evt) { /* dragging ended */ },

	// Element is dropped into the list from another list
	onAdd: function (/*Event*/evt){
		var itemEl = evt.item; // dragged HTMLElement
		itemEl.from; // previous list
	},

	// Changed sorting within list
	onUpdate: function (/*Event*/evt){
		var itemEl = evt.item; // dragged HTMLElement
	},

	// Called by any change to the list (add / update / remove)
	onSort: function (/*Event*/evt){
		var itemEl = evt.item; // dragged HTMLElement
	},

	// Element is removed from the list into another list
	onRemove: function (/*Event*/evt){
		var itemEl = evt.item; // dragged HTMLElement
	},

	onFilter: function (/*Event*/evt){
		var itemEl = evt.item; // HTMLElement receiving the `mousedown|tapstart` event.
	}
});
```

---


#### `handle` option
To make list items draggable, Sortable disables text selection by the user.
That's not always desirable. To allow text selection, define a drag handler,
which is an area of every list element that allows it to be dragged around.

```js
var sortable = new Sortable(el, {
        handle: ".my-handle"
});
```

```html
<ul>
	<li><span class="my-handle">::</span> list item text one
	<li><span class="my-handle">::</span> list item text two
</ul>
```

```css
.my-handle {
	cursor: move
}
```


---


#### `group` option
To drag elements from one list into another, both lists must have the same `group` value.
You can also define whether lists can give away, give and keep a copy (`clone`), and receive elements.

 * name: `String` — group name
 * pull: `true|false|'clone'` — ability to move from the list. `clone` — copy the item, rather than move.
 * put: `true|false|["foo", "bar"]` — whether elements can be added from other lists, or an array of group names from which elements can be taken. Demo: http://jsbin.com/naduvo/2/edit?html,js,output


---


<a name="ng"></a>
### Support AngularJS
Include [ng-sortable.js](ng-sortable.js)

Demo: http://jsbin.com/naduvo/1/edit?html,js,output

```html
<div ng-app="myApp" ng-controller="demo">
	<ul ng-sortable>
		<li ng-repeat="item in items">{{item}}</li>
	</ul>

	<ul ng-sortable="{ group: 'foobar' }">
		<li ng-repeat="item in foo">{{item}}</li>
	</ul>

	<ul ng-sortable="barConfig">
		<li ng-repeat="item in bar">{{item}}</li>
	</ul>
</div>
```


```js
angular.module('myApp', ['ng-sortable'])
	.controller('demo', ['$scope', function ($scope) {
		$scope.items = ['item 1', 'item 2'];
		$scope.foo = ['foo 1', '..'];
		$scope.bar = ['bar 1', '..'];
		$scope.barConfig = { group: 'foobar', animation: 150 };
	}]);
```


---


### Method


##### option(name:`String`[, value:`*`]):`*`
Get or set the option.



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
Removes the sortable functionality completely.


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
Sortable.create(el, {
	group: "localStorage-example",
	store: {
		/**
		 * Get the order of elements. Called once during initialization.
		 * @param   {Sortable}  sortable
		 * @returns {Array}
		 */
		get: function (sortable) {
			var order = localStorage.getItem(sortable.options.group);
			return order ? order.split('|') : [];
		},

		/**
		 * Save the order of elements. Called onEnd (when the item is dropped).
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


<a name="bs"></a>
### Bootstrap
Demo: http://jsbin.com/luxero/2/edit?html,js,output

```html
<!-- Latest compiled and minified CSS -->
<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.1/css/bootstrap.min.css"/>


<!-- Latest Sortable -->
<script src="http://rubaxa.github.io/Sortable/Sortable.js"></script>


<!-- Simple List -->
<ul id="simpleList" class="list-group">
	<li class="list-group-item">This is <a href="http://rubaxa.github.io/Sortable/">Sortable</a></li>
	<li class="list-group-item">It works with Bootstrap...</li>
	<li class="list-group-item">...out of the box.</li>
	<li class="list-group-item">It has support for touch devices.</li>
	<li class="list-group-item">Just drag some elements around.</li>
</ul>

<script>
    // Simple list
    Sortable.create(simpleList, { /* options */ });
</script>
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
Copyright 2013-2014 Lebedev Konstantin <ibnRubaXa@gmail.com>
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

