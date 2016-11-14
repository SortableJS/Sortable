# Sortable
Sortable is a minimalist JavaScript library for reorderable drag-and-drop lists.

Demo: http://rubaxa.github.io/Sortable/


## Features

 * Supports touch devices and [modern](http://caniuse.com/#search=drag) browsers (including IE9)
 * Can drag from one list to another or within the same list
 * CSS animation when moving items
 * Supports drag handles *and selectable text* (better than voidberg's html5sortable)
 * Smart auto-scrolling
 * Built using native HTML5 drag and drop API
 * Supports
  * [Meteor](https://github.com/SortableJS/meteor-sortablejs)
  * AngularJS
    * [2.0+](https://github.com/SortableJS/angular-sortablejs)
    * [1.*](https://github.com/SortableJS/angular-legacy-sortablejs)
  * React
    * [ES2015+](https://github.com/SortableJS/react-sortablejs)
    * [Mixin](https://github.com/SortableJS/react-mixin-sortablejs)
  * [Knockout](https://github.com/SortableJS/knockout-sortablejs)
  * [Polymer](https://github.com/SortableJS/polymer-sortablejs)
 * Supports any CSS library, e.g. [Bootstrap](#bs)
 * Simple API
 * [CDN](#cdn)
 * No jQuery (but there is [support](#jq))


<br/>


### Articles

 * [Sortable v1.0 — New capabilities](https://github.com/RubaXa/Sortable/wiki/Sortable-v1.0-—-New-capabilities/) (December 22, 2014)
 * [Sorting with the help of HTML5 Drag'n'Drop API](https://github.com/RubaXa/Sortable/wiki/Sorting-with-the-help-of-HTML5-Drag'n'Drop-API/) (December 23, 2013)


<br/>

### Install

Via npm

```bash
$ npm install sortablejs --save
```

Via bower:

```bash
$ bower install --save sortablejs
```

<br/>

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
	group: "name",  // or { name: "...", pull: [true, false, clone], put: [true, false, array] }
	sort: true,  // sorting inside list
	delay: 0, // time in milliseconds to define when the sorting should start
	disabled: false, // Disables the sortable if set to true.
	store: null,  // @see Store
	animation: 150,  // ms, animation speed moving items when sorting, `0` — without animation
	handle: ".my-handle",  // Drag handle selector within list items
	filter: ".ignore-elements",  // Selectors that do not lead to dragging (String or Function)
	draggable: ".item",  // Specifies which items inside the element should be draggable
	ghostClass: "sortable-ghost",  // Class name for the drop placeholder
	chosenClass: "sortable-chosen",  // Class name for the chosen item
	dragClass: "sortable-drag",  // Class name for the dragging item
	dataIdAttr: 'data-id',

	forceFallback: false,  // ignore the HTML5 DnD behaviour and force the fallback to kick in

	fallbackClass: "sortable-fallback",  // Class name for the cloned DOM Element when using forceFallback
	fallbackOnBody: false,  // Appends the cloned DOM Element into the Document's Body
	fallbackTolerance: 0 // Specify in pixels how far the mouse should move before it's considered as a drag.        
	
	scroll: true, // or HTMLElement
	scrollFn: function(offsetX, offsetY, originalEvent) { ... }, // if you have custom scrollbar scrollFn may be used for autoscrolling
	scrollSensitivity: 30, // px, how near the mouse must be to an edge to start scrolling.
	scrollSpeed: 10, // px

	setData: function (/** DataTransfer */dataTransfer, /** HTMLElement*/dragEl) {
		dataTransfer.setData('Text', dragEl.textContent); // `dataTransfer` object of HTML5 DragEvent
	},

	// Element is chosen
	onChoose: function (/**Event*/evt) {
		evt.oldIndex;  // element index within parent
	},

	// Element dragging started
	onStart: function (/**Event*/evt) {
		evt.oldIndex;  // element index within parent
	},

	// Element dragging ended
	onEnd: function (/**Event*/evt) {
		evt.oldIndex;  // element's old index within parent
		evt.newIndex;  // element's new index within parent
	},

	// Element is dropped into the list from another list
	onAdd: function (/**Event*/evt) {
		var itemEl = evt.item;  // dragged HTMLElement
		evt.from;  // previous list
		// + indexes from onEnd
	},

	// Changed sorting within list
	onUpdate: function (/**Event*/evt) {
		var itemEl = evt.item;  // dragged HTMLElement
		// + indexes from onEnd
	},

	// Called by any change to the list (add / update / remove)
	onSort: function (/**Event*/evt) {
		// same properties as onUpdate
	},

	// Element is removed from the list into another list
	onRemove: function (/**Event*/evt) {
		// same properties as onUpdate
	},

	// Attempt to drag a filtered element
	onFilter: function (/**Event*/evt) {
		var itemEl = evt.item;  // HTMLElement receiving the `mousedown|tapstart` event.
	},

	// Event when you move an item in the list or between lists
	onMove: function (/**Event*/evt, /**Event*/originalEvent) {
		// Example: http://jsbin.com/tuyafe/1/edit?js,output
		evt.dragged; // dragged HTMLElement
		evt.draggedRect; // TextRectangle {left, top, right и bottom}
		evt.related; // HTMLElement on which have guided
		evt.relatedRect; // TextRectangle
		originalEvent.clientY; // mouse position
		// return false; — for cancel
	},
	
	// Called when creating a clone of element
	onClone: function (/**Event*/evt) {
		var origEl = evt.item;
		var cloneEl = evt.clone;
	}
});
```


---


#### `group` option
To drag elements from one list into another, both lists must have the same `group` value.
You can also define whether lists can give away, give and keep a copy (`clone`), and receive elements.

 * name: `String` — group name
 * pull: `true|false|'clone'|function` — ability to move from the list. `clone` — copy the item, rather than move.
 * put: `true|false|["foo", "bar"]|function` — whether elements can be added from other lists, or an array of group names from which elements can be taken.

Demo:
 - http://jsbin.com/naduvo/edit?js,output
 - http://jsbin.com/rusuvot/edit?js,output — use of complex logic in the `pull` and` put`


---


#### `sort` option
Sorting inside list.

Demo: http://jsbin.com/xizeh/2/edit?html,js,output


---


#### `delay` option
Time in milliseconds to define when the sorting should start.

Demo: http://jsbin.com/xizeh/4/edit?html,js,output


---


#### `disabled` options
Disables the sortable if set to `true`.

Demo: http://jsbin.com/xiloqu/1/edit?html,js,output

```js
var sortable = Sortable.create(list);

document.getElementById("switcher").onclick = function () {
	var state = sortable.option("disabled"); // get

	sortable.option("disabled", !state); // set
};
```


---


#### `handle` option
To make list items draggable, Sortable disables text selection by the user.
That's not always desirable. To allow text selection, define a drag handler,
which is an area of every list element that allows it to be dragged around.

Demo: http://jsbin.com/newize/1/edit?html,js,output

```js
Sortable.create(el, {
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
	cursor: move;
	cursor: -webkit-grabbing;
}
```


---


#### `filter` option


```js
Sortable.create(list, {
	filter: ".js-remove, .js-edit",
	onFilter: function (evt) {
		var item = evt.item,
			ctrl = evt.target;

		if (Sortable.utils.is(ctrl, ".js-remove")) {  // Click on remove button
			item.parentNode.removeChild(item); // remove sortable item
		}
		else if (Sortable.utils.is(ctrl, ".js-edit")) {  // Click on edit link
			// ...
		}
	}
})
```


---


#### `ghostClass` option
Class name for the drop placeholder (default `sortable-ghost`).

Demo: http://jsbin.com/hunifu/1/edit?css,js,output

```css
.ghost {
  opacity: 0.4;
}
```

```js
Sortable.create(list, {
  ghostClass: "ghost"
});
```


---


#### `chosenClass` option
Class name for the chosen item  (default `sortable-chosen`).

Demo: http://jsbin.com/hunifu/edit?html,css,js,output

```css
.chosen {
  color: #fff;
  background-color: #c00;
}
```

```js
Sortable.create(list, {
  delay: 500,
  chosenClass: "chosen"
});
```


---


#### `forceFallback` option
If set to `true`, the Fallback for non HTML5 Browser will be used, even if we are using an HTML5 Browser.
This gives us the possibility to test the behaviour for older Browsers even in newer Browser, or make the Drag 'n Drop feel more consistent between Desktop , Mobile and old Browsers.

On top of that, the Fallback always generates a copy of that DOM Element and appends the class `fallbackClass` defined in the options. This behaviour controls the look of this 'dragged' Element.

Demo: http://jsbin.com/pucurizace/edit?html,css,js,output


---


#### `fallbackTolerance` option
Emulates the native drag threshold. Specify in pixels how far the mouse should move before it's considered as a drag.
Useful if the items are also clickable like in a list of links.

When the user clicks inside a sortable element, it's not uncommon for your hand to move a little between the time you press and the time you release.  
Dragging only starts if you move the pointer past a certain tolerance, so that you don't accidentally start dragging every time you click.

3 to 5 are probably good values.


---


#### `scroll` option
If set to `true`, the page (or sortable-area) scrolls when coming to an edge.

Demo:
 - `window`: http://jsbin.com/boqugumiqi/1/edit?html,js,output
 - `overflow: hidden`: http://jsbin.com/kohamakiwi/1/edit?html,js,output


---


#### `scrollFn` option
Defines function that will be used for autoscrolling. el.scrollTop/el.scrollLeft is used by default.
Useful when you have custom scrollbar with dedicated scroll function.


---


#### `scrollSensitivity` option
Defines how near the mouse must be to an edge to start scrolling.


---


#### `scrollSpeed` option
The speed at which the window should scroll once the mouse pointer gets within the `scrollSensitivity` distance.


---


### Event object ([demo](http://jsbin.com/xedusu/edit?js,output))

 - to:`HTMLElement` — list, in which moved element.
 - from:`HTMLElement` — previous list
 - item:`HTMLElement` — dragged element
 - clone:`HTMLElement`
 - oldIndex:`Number|undefined` — old index within parent
 - newIndex:`Number|undefined` — new index within parent


#### `move` event object
 - to:`HTMLElement`
 - from:`HTMLElement`
 - dragged:`HTMLElement`
 - draggedRect:` TextRectangle`
 - related:`HTMLElement` — element on which have guided
 - relatedRect:` TextRectangle`


---


### Method


##### option(name:`String`[, value:`*`]):`*`
Get or set the option.



##### closest(el:`String`[, selector:`HTMLElement`]):`HTMLElement|null`
For each element in the set, get the first element that matches the selector by testing the element itself and traversing up through its ancestors in the DOM tree.


##### toArray():`String[]`
Serializes the sortable's item `data-id`'s (`dataIdAttr` option) into an array of string.


##### sort(order:`String[]`)
Sorts the elements according to the array.

```js
var order = sortable.toArray();
sortable.sort(order.reverse()); // apply
```


##### save()
Save the current sorting (see [store](#store))


##### destroy()
Removes the sortable functionality completely.


---


<a name="store"></a>
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
			var order = localStorage.getItem(sortable.options.group.name);
			return order ? order.split('|') : [];
		},

		/**
		 * Save the order of elements. Called onEnd (when the item is dropped).
		 * @param {Sortable}  sortable
		 */
		set: function (sortable) {
			var order = sortable.toArray();
			localStorage.setItem(sortable.options.group.name, order.join('|'));
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


### Static methods & properties



##### Sortable.create(el:`HTMLElement`[, options:`Object`]):`Sortable`
Create new instance.


---


##### Sortable.active:`Sortable`
Link to the active instance.


---


##### Sortable.utils
* on(el`:HTMLElement`, event`:String`, fn`:Function`) — attach an event handler function
* off(el`:HTMLElement`, event`:String`, fn`:Function`) — remove an event handler
* css(el`:HTMLElement`)`:Object` — get the values of all the CSS properties
* css(el`:HTMLElement`, prop`:String`)`:Mixed` — get the value of style properties
* css(el`:HTMLElement`, prop`:String`, value`:String`) — set one CSS properties
* css(el`:HTMLElement`, props`:Object`) — set more CSS properties
* find(ctx`:HTMLElement`, tagName`:String`[, iterator`:Function`])`:Array` — get elements by tag name
* bind(ctx`:Mixed`, fn`:Function`)`:Function` — Takes a function and returns a new one that will always have a particular context
* is(el`:HTMLElement`, selector`:String`)`:Boolean` — check the current matched set of elements against a selector
* closest(el`:HTMLElement`, selector`:String`[, ctx`:HTMLElement`])`:HTMLElement|Null` — for each element in the set, get the first element that matches the selector by testing the element itself and traversing up through its ancestors in the DOM tree
* clone(el`:HTMLElement`)`:HTMLElement` — create a deep copy of the set of matched elements
* toggleClass(el`:HTMLElement`, name`:String`, state`:Boolean`) — add or remove one classes from each element


---


<a name="cdn"></a>
### CDN

```html
<!-- CDNJS :: Sortable (https://cdnjs.com/) -->
<script src="//cdnjs.cloudflare.com/ajax/libs/Sortable/1.5.0-rc1/Sortable.min.js"></script>


<!-- jsDelivr :: Sortable (http://www.jsdelivr.com/) -->
<script src="//cdn.jsdelivr.net/sortable/1.5.0-rc1/Sortable.min.js"></script>


<!-- jsDelivr :: Sortable :: Latest (http://www.jsdelivr.com/) -->
<script src="//cdn.jsdelivr.net/sortable/latest/Sortable.min.js"></script>
```


---


<a name="jq"></a>
### jQuery compatibility
To assemble plugin for jQuery, perform the following steps:

```bash
  cd Sortable
  npm install
  grunt jquery
```

Now you can use `jquery.fn.sortable.js`:<br/>
(or `jquery.fn.sortable.min.js` if you run `grunt jquery:min`)

```js
  $("#list").sortable({ /* options */ }); // init

  $("#list").sortable("widget"); // get Sortable instance

  $("#list").sortable("destroy"); // destroy Sortable instance

  $("#list").sortable("{method-name}"); // call an instance method

  $("#list").sortable("{method-name}", "foo", "bar"); // call an instance method with parameters
```

And `grunt jquery:mySortableFunc` → `jquery.fn.mySortableFunc.js`

---


### Contributing (Issue/PR)

Please, [read this](CONTRIBUTING.md).


---


## MIT LICENSE
Copyright 2013-2016 Lebedev Konstantin <ibnRubaXa@gmail.com>
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

