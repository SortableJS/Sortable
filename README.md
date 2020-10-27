# Sortable &nbsp; [![Financial Contributors on Open Collective](https://opencollective.com/Sortable/all/badge.svg?label=financial+contributors)](https://opencollective.com/Sortable) [![CircleCI](https://circleci.com/gh/SortableJS/Sortable.svg?style=svg)](https://circleci.com/gh/SortableJS/Sortable) [![DeepScan grade](https://deepscan.io/api/teams/3901/projects/5666/branches/43977/badge/grade.svg)](https://deepscan.io/dashboard#view=project&tid=3901&pid=5666&bid=43977) [![](https://data.jsdelivr.com/v1/package/npm/sortablejs/badge)](https://www.jsdelivr.com/package/npm/sortablejs) [![npm](https://img.shields.io/npm/v/sortablejs.svg)](https://www.npmjs.com/package/sortablejs)

Sortable is a JavaScript library for reorderable drag-and-drop lists.

Demo: https://sortablejs.github.io/sortablejs/

[<img width="250px" src="https://raw.githubusercontent.com/SortableJS/Sortable/HEAD/st/saucelabs.svg?sanitize=true">](https://saucelabs.com/)

todo: add entrypoints table around here somewhere.

## Important Notices

### Github as CDN deprecation

It was never fully supported, but we've decided to consciously deprecate the use of fetching files directly from GitHub.

This came to our attention when a few tutorials out on the web (we thank you!) which instruct to import SortableJS directly from our GitHub source repository.
GitHub is used to develop Sortable, not host it.

The correct way to consume sortable in a HTML script is to use an officially supported CDN, such as jsdelivr or unpkg.

These files now trigger console.warn with a message to come here:

- modular/sortable.core.esm.js
- modular/sortable.complete.esm.js
- modular/sortable.esm.js
- Sortable.js
- Sortable.min.js

### Bower

Bower has been deprecated, which means we will no longer support it.
Please replace your usage of bower with npm, yarn or a JavaScript package manager of your choice.

## Features

- Supports touch devices and [modern](http://caniuse.com/#search=drag) browsers (including IE9)
- Can drag from one list to another or within the same list
- CSS animation when moving items
- Supports drag handles _and selectable text_ (better than voidberg's html5sortable)
- Smart auto-scrolling
- Advanced swap detection
- Smooth animations
- [Multi-drag](https://github.com/SortableJS/Sortable/tree/master/packages/plugins/multi-drag) support
- Support for CSS transforms
- Built using native HTML5 drag and drop API
- Supports
- Supports any CSS library, e.g. Bootstrap
- Simple API
- Support for [plugins](#plugins)
- [CDN](#cdn)
- No jQuery required (but there is [support]())
- TypeScript definitions via [@types/sortablejs](https://github.com/DefinitelyTyped/DefinitelyTyped/tree/master/types/sortablejs)

### Bindings and Components

There are many bindings for SortableJS to use with your favourite frameworks and libraries:

- [jQuery](https://github.com/SortableJS/jquery-sortablejs)
- [Meteor](https://github.com/SortableJS/meteor-sortablejs)
- Angular
  - [2.0+](https://github.com/SortableJS/angular-sortablejs)
  - [1.\*](https://github.com/SortableJS/angular-legacy-sortablejs)
- React
  - [ES2015+](https://github.com/SortableJS/react-sortablejs)
  - [Mixin](https://github.com/SortableJS/react-mixin-sortablejs)
- [Knockout](https://github.com/SortableJS/knockout-sortablejs)
- [Polymer](https://github.com/SortableJS/polymer-sortablejs)
- [Vue](https://github.com/SortableJS/Vue.Draggable)
- [Ember](https://github.com/SortableJS/ember-sortablejs)

### Articles

- [Dragging Multiple Items in Sortable](https://github.com/SortableJS/Sortable/wiki/Dragging-Multiple-Items-in-Sortable) (April 26, 2019)
- [Swap Thresholds and Direction](https://github.com/SortableJS/Sortable/wiki/Swap-Thresholds-and-Direction) (December 2, 2018)
- [Sortable v1.0 — New capabilities](https://github.com/SortableJS/Sortable/wiki/Sortable-v1.0-—-New-capabilities/) (December 22, 2014)
- [Sorting with the help of HTML5 Drag'n'Drop API](https://github.com/SortableJS/Sortable/wiki/Sorting-with-the-help-of-HTML5-Drag'n'Drop-API/) (December 23, 2013)

### Getting Started

Install via command line using `yarn` or `npm`.

```bash
# npm
npm install sortablejs --save

# yarn v1.x
yarn add sortablejs
```

Import into your project:

```ts
// Default SortableJS
import Sortable from "sortablejs";
import { Sortable, MultiDrag, Swap, OnSpill, AutoScroll } from "sortablejs";
```

Cherrypick plugins:

```ts
// Cherrypick extra plugins
import Sortable, { MultiDrag, Swap } from "sortablejs";

Sortable.mount(new MultiDrag(), new Swap());

// Cherrypick default plugins
import Sortable, { AutoScroll } from "sortablejs/modular/sortable.core.esm.js";

Sortable.mount(new AutoScroll());
```

---

### Usage

```html
<ul id="items">
  <li>item 1</li>
  <li>item 2</li>
  <li>item 3</li>
</ul>
```

```js
var el = document.getElementById("items");
var sortable = Sortable.create(el);
```

You can use any element for the list and its elements, not just `ul`/`li`. Here is an [example with `div`s](https://jsbin.com/visimub/edit?html,js,output).

---

### Options

Here we've summarised the options with their ~~default values~~ example values. More details available in the [docs/sortable-options](https://github.com/SortableJS/Sortable/blob/master/docs/sortable-options.md)

```ts
var sortable = new Sortable(el, {
  // variables

  group: "name", // or { name: "...", pull: [true, false, 'clone', array], put: [true, false, array] }
  sort: true, // sorting inside list
  delay: 0, // time in milliseconds to define when the sorting should start
  delayOnTouchOnly: false, // only delay if user is using touch
  touchStartThreshold: 0, // px, how many pixels the point should move before cancelling a delayed drag event
  disabled: false, // Disables the sortable if set to true.
  store: null, // @see Store
  animation: 150, // ms, animation speed moving items when sorting, `0` — without animation
  easing: "cubic-bezier(1, 0, 0, 1)", // Easing for animation. Defaults to null. See https://easings.net/ for examples.
  handle: ".my-handle", // Drag handle selector within list items
  filter: ".ignore-elements", // Selectors that do not lead to dragging (String or Function)
  preventOnFilter: true, // Call `event.preventDefault()` when triggered `filter`
  draggable: ".item", // Specifies which items inside the element should be draggable

  dataIdAttr: "data-id",

  ghostClass: "sortable-ghost", // Class name for the drop placeholder
  chosenClass: "sortable-chosen", // Class name for the chosen item
  dragClass: "sortable-drag", // Class name for the dragging item

  swapThreshold: 1, // Threshold of the swap zone
  invertSwap: false, // Will always use inverted swap zone if set to true
  invertedSwapThreshold: 1, // Threshold of the inverted swap zone (will be set to swapThreshold value by default)
  direction: "horizontal", // Direction of Sortable (will be detected automatically if not given)

  forceFallback: false, // ignore the HTML5 DnD behaviour and force the fallback to kick in

  fallbackClass: "sortable-fallback", // Class name for the cloned DOM Element when using forceFallback
  fallbackOnBody: false, // Appends the cloned DOM Element into the Document's Body
  fallbackTolerance: 0, // Specify in pixels how far the mouse should move before it's considered as a drag.

  dragoverBubble: false,
  removeCloneOnHide: true, // Remove the clone element when it is not showing, rather than just hiding it
  emptyInsertThreshold: 5, // px, distance mouse must be from empty sortable to insert drag element into it

  // handlers/hooks - listen to sortable events here.

  setData: function (
    /** DataTransfer */ dataTransfer,
    /** HTMLElement*/ dragEl
  ) {
    dataTransfer.setData("Text", dragEl.textContent); // `dataTransfer` object of HTML5 DragEvent
  },

  // Element is chosen
  onChoose: function (/**Event*/ evt) {
    evt.oldIndex; // element index within parent
  },

  // Element is unchosen
  onUnchoose: function (/**Event*/ evt) {
    // same properties as onEnd
  },

  // Element dragging started
  onStart: function (/**Event*/ evt) {
    evt.oldIndex; // element index within parent
  },

  // Element dragging ended
  onEnd: function (/**Event*/ evt) {
    var itemEl = evt.item; // dragged HTMLElement
    evt.to; // target list
    evt.from; // previous list
    evt.oldIndex; // element's old index within old parent
    evt.newIndex; // element's new index within new parent
    evt.oldDraggableIndex; // element's old index within old parent, only counting draggable elements
    evt.newDraggableIndex; // element's new index within new parent, only counting draggable elements
    evt.clone; // the clone element
    evt.pullMode; // when item is in another sortable: `"clone"` if cloning, `true` if moving
  },

  // Element is dropped into the list from another list
  onAdd: function (/**Event*/ evt) {
    // same properties as onEnd
  },

  // Changed sorting within list
  onUpdate: function (/**Event*/ evt) {
    // same properties as onEnd
  },

  // Called by any change to the list (add / update / remove)
  onSort: function (/**Event*/ evt) {
    // same properties as onEnd
  },

  // Element is removed from the list into another list
  onRemove: function (/**Event*/ evt) {
    // same properties as onEnd
  },

  // Attempt to drag a filtered element
  onFilter: function (/**Event*/ evt) {
    var itemEl = evt.item; // HTMLElement receiving the `mousedown|tapstart` event.
  },

  // Event when you move an item in the list or between lists
  onMove: function (/**Event*/ evt, /**Event*/ originalEvent) {
    // Example: https://jsbin.com/nawahef/edit?js,output
    evt.dragged; // dragged HTMLElement
    evt.draggedRect; // DOMRect {left, top, right, bottom}
    evt.related; // HTMLElement on which have guided
    evt.relatedRect; // DOMRect
    evt.willInsertAfter; // Boolean that is true if Sortable will insert drag element after target by default
    originalEvent.clientY; // mouse position
    // return false; — for cancel
    // return -1; — insert before target
    // return 1; — insert after target
    // return true; — keep default insertion point based on the direction
    // return void; — keep default insertion point based on the direction
  },

  // Called when creating a clone of element
  onClone: function (/**Event*/ evt) {
    var origEl = evt.item;
    var cloneEl = evt.clone;
  },

  // Called when dragging element changes position
  onChange: function (/**Event*/ evt) {
    evt.newIndex; // most likely why this event is used is to get the dragging element's current index
    // same properties as onEnd
  },
});
```

---

### Event object ([demo](https://jsbin.com/fogujiv/edit?js,output))

- to:`HTMLElement` — list, in which moved element
- from:`HTMLElement` — previous list
- item:`HTMLElement` — dragged element
- clone:`HTMLElement`
- oldIndex:`Number|undefined` — old index within parent
- newIndex:`Number|undefined` — new index within parent
- oldDraggableIndex: `Number|undefined` — old index within parent, only counting draggable elements
- newDraggableIndex: `Number|undefined` — new index within parent, only counting draggable elements
- pullMode:`String|Boolean|undefined` — Pull mode if dragging into another sortable (`"clone"`, `true`, or `false`), otherwise undefined

#### `move` event object

- to:`HTMLElement`
- from:`HTMLElement`
- dragged:`HTMLElement`
- draggedRect:`DOMRect`
- related:`HTMLElement` — element on which have guided
- relatedRect:`DOMRect`
- willInsertAfter:`Boolean` — `true` if will element be inserted after target (or `false` if before)

---

### Methods

These are available on each Sortable instance (the return value of `new Sortable({})`)

##### option(name:`String`[, value:`*`]):`*`

Get or set the option.

##### closest(el:`HTMLElement`[, selector:`String`]):`HTMLElement|null`

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
      return order ? order.split("|") : [];
    },

    /**
     * Save the order of elements. Called onEnd (when the item is dropped).
     * @param {Sortable}  sortable
     */
    set: function (sortable) {
      var order = sortable.toArray();
      localStorage.setItem(sortable.options.group.name, order.join("|"));
    },
  },
});
```

todo: overview of Sortable API Surface

### Static methods & properties

##### Sortable.create(el:`HTMLElement`[, options:`Object`]):`Sortable`

Create new instance.

---

##### Sortable.active:`Sortable`

The active Sortable instance.

---

##### Sortable.dragged:`HTMLElement`

The element being dragged.

---

##### Sortable.ghost:`HTMLElement`

The ghost element.

---

##### Sortable.clone:`HTMLElement`

The clone element.

---

##### Sortable.get(element:`HTMLElement`):`Sortable`

Get the Sortable instance on an element.

---

##### Sortable.mount(plugin:`...SortablePlugin|SortablePlugin[]`)

Mounts a plugin to Sortable.

---

##### Sortable.utils

- on(el`:HTMLElement`, event`:String`, fn`:Function`) — attach an event handler function
- off(el`:HTMLElement`, event`:String`, fn`:Function`) — remove an event handler
- css(el`:HTMLElement`)`:Object` — get the values of all the CSS properties
- css(el`:HTMLElement`, prop`:String`)`:Mixed` — get the value of style properties
- css(el`:HTMLElement`, prop`:String`, value`:String`) — set one CSS properties
- css(el`:HTMLElement`, props`:Object`) — set more CSS properties
- find(ctx`:HTMLElement`, tagName`:String`[, iterator`:Function`])`:Array` — get elements by tag name
- bind(ctx`:Mixed`, fn`:Function`)`:Function` — Takes a function and returns a new one that will always have a particular context
- is(el`:HTMLElement`, selector`:String`)`:Boolean` — check the current matched set of elements against a selector
- closest(el`:HTMLElement`, selector`:String`[, ctx`:HTMLElement`])`:HTMLElement|Null` — for each element in the set, get the first element that matches the selector by testing the element itself and traversing up through its ancestors in the DOM tree
- clone(el`:HTMLElement`)`:HTMLElement` — create a deep copy of the set of matched elements
- toggleClass(el`:HTMLElement`, name`:String`, state`:Boolean`) — add or remove one classes from each element
- detectDirection(el`:HTMLElement`)`:String` — automatically detect the [direction](https://github.com/SortableJS/Sortable/wiki/Swap-Thresholds-and-Direction#direction) of the element as either `'vertical'` or `'horizontal'`

---

### Plugins

#### Extra Plugins (included in complete versions)

- [MultiDrag](https://github.com/SortableJS/Sortable/tree/master/packages/plugins/multi-drag)
- [Swap](https://github.com/SortableJS/Sortable/tree/master/packages/plugins/swap)

#### Default Plugins (included in default versions)

- [AutoScroll](https://github.com/SortableJS/Sortable/tree/master/packages/plugins/auto-scroll)
- [OnSpill](https://github.com/SortableJS/Sortable/tree/master/packages/plugins/on-spill)

---

<a name="cdn"></a>

### CDN

```html
<!-- jsDelivr :: Sortable :: Latest (https://www.jsdelivr.com/package/npm/sortablejs) -->
<script src="https://cdn.jsdelivr.net/npm/sortablejs@latest/Sortable.min.js"></script>
```

---

### Contributing (Issue/PR)

Please, [read this](CONTRIBUTING.md).

---

## Contributors

### Code Contributors

This project exists thanks to all the people who contribute. [[Contribute](CONTRIBUTING.md)].
<a href="https://github.com/SortableJS/Sortable/graphs/contributors"><img src="https://opencollective.com/Sortable/contributors.svg?width=890&button=false" /></a>

### Financial Contributors

Become a financial contributor and help us sustain our community. [[Contribute](https://opencollective.com/Sortable/contribute)]

#### Individuals

<a href="https://opencollective.com/Sortable"><img src="https://opencollective.com/Sortable/individuals.svg?width=890"></a>

#### Organizations

Support this project with your organization. Your logo will show up here with a link to your website. [[Contribute](https://opencollective.com/Sortable/contribute)]

<a href="https://opencollective.com/Sortable/organization/0/website"><img src="https://opencollective.com/Sortable/organization/0/avatar.svg"></a>
<a href="https://opencollective.com/Sortable/organization/1/website"><img src="https://opencollective.com/Sortable/organization/1/avatar.svg"></a>
<a href="https://opencollective.com/Sortable/organization/2/website"><img src="https://opencollective.com/Sortable/organization/2/avatar.svg"></a>
<a href="https://opencollective.com/Sortable/organization/3/website"><img src="https://opencollective.com/Sortable/organization/3/avatar.svg"></a>
<a href="https://opencollective.com/Sortable/organization/4/website"><img src="https://opencollective.com/Sortable/organization/4/avatar.svg"></a>
<a href="https://opencollective.com/Sortable/organization/5/website"><img src="https://opencollective.com/Sortable/organization/5/avatar.svg"></a>
<a href="https://opencollective.com/Sortable/organization/6/website"><img src="https://opencollective.com/Sortable/organization/6/avatar.svg"></a>
<a href="https://opencollective.com/Sortable/organization/7/website"><img src="https://opencollective.com/Sortable/organization/7/avatar.svg"></a>
<a href="https://opencollective.com/Sortable/organization/8/website"><img src="https://opencollective.com/Sortable/organization/8/avatar.svg"></a>
<a href="https://opencollective.com/Sortable/organization/9/website"><img src="https://opencollective.com/Sortable/organization/9/avatar.svg"></a>
