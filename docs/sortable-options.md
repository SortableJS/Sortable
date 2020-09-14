# Sortable Options

todo: on[Event] options. Currently they're only in the summary.
todo: generate TOC

## Normal Options

### `group` option

To drag elements from one list into another, both lists must have the same `group` value.
You can also define whether lists can give away, give and keep a copy (`clone`), and receive elements.

- name: `String` — group name
- pull: `true|false|["foo", "bar"]|'clone'|function` — ability to move from the list. `clone` — copy the item, rather than move. Or an array of group names which the elements may be put in. Defaults to `true`.
- put: `true|false|["baz", "qux"]|function` — whether elements can be added from other lists, or an array of group names from which elements can be added.
- revertClone: `boolean` — revert cloned element to initial position after moving to a another list.

Demo:

- https://jsbin.com/hijetos/edit?js,output
- https://jsbin.com/nacoyah/edit?js,output — use of complex logic in the `pull` and` put`
- https://jsbin.com/bifuyab/edit?js,output — use `revertClone: true`

### `sort` option

Allow sorting inside list.

Demo: https://jsbin.com/jayedig/edit?js,output

### `delay` option

Time in milliseconds to define when the sorting should start.
Unfortunately, due to browser restrictions, delaying is not possible on IE or Edge with native drag & drop.

Demo: https://jsbin.com/zosiwah/edit?js,output

### `delayOnTouchOnly` option

Whether or not the delay should be applied only if the user is using touch (eg. on a mobile device). No delay will be applied in any other case. Defaults to `false`.

### `swapThreshold` option

Percentage of the target that the swap zone will take up, as a float between `0` and `1`.

[Read more](https://github.com/SortableJS/Sortable/wiki/Swap-Thresholds-and-Direction#swap-threshold)

Demo: http://sortablejs.github.io/Sortable#thresholds

### `invertSwap` option

Set to `true` to set the swap zone to the sides of the target, for the effect of sorting "in between" items.

[Read more](https://github.com/SortableJS/Sortable/wiki/Swap-Thresholds-and-Direction#forcing-inverted-swap-zone)

Demo: http://sortablejs.github.io/Sortable#thresholds

### `invertedSwapThreshold` option

Percentage of the target that the inverted swap zone will take up, as a float between `0` and `1`. If not given, will default to `swapThreshold`.

[Read more](https://github.com/SortableJS/Sortable/wiki/Swap-Thresholds-and-Direction#dealing-with-swap-glitching)

### `direction` option

Direction that the Sortable should sort in. Can be set to `'vertical'`, `'horizontal'`, or a function, which will be called whenever a target is dragged over. Must return `'vertical'` or `'horizontal'`.

[Read more](https://github.com/SortableJS/Sortable/wiki/Swap-Thresholds-and-Direction#direction)

Example of direction detection for vertical list that includes full column and half column elements:

```js
Sortable.create(el, {
  direction: function (evt, target, dragEl) {
    if (
      target !== null &&
      target.className.includes("half-column") &&
      dragEl.className.includes("half-column")
    ) {
      return "horizontal";
    }
    return "vertical";
  },
});
```

### `touchStartThreshold` option

This option is similar to `fallbackTolerance` option.

When the `delay` option is set, some phones with very sensitive touch displays like the Samsung Galaxy S8 will fire
unwanted touchmove events even when your finger is not moving, resulting in the sort not triggering.

This option sets the minimum pointer movement that must occur before the delayed sorting is cancelled.

Values between 3 to 5 are good.

### `disabled` options

Disables the sortable if set to `true`.

Demo: https://jsbin.com/sewokud/edit?js,output

```js
var sortable = Sortable.create(list);

document.getElementById("switcher").onclick = function () {
  var state = sortable.option("disabled"); // get

  sortable.option("disabled", !state); // set
};
```

### `handle` option

To make list items draggable, Sortable disables text selection by the user.
That's not always desirable. To allow text selection, define a drag handler,
which is an area of every list element that allows it to be dragged around.

Demo: https://jsbin.com/numakuh/edit?html,js,output

```js
Sortable.create(el, {
  handle: ".my-handle",
});
```

```html
<ul>
  <li><span class="my-handle">::</span> list item text one</li>
  <li><span class="my-handle">::</span> list item text two</li>
</ul>
```

```css
.my-handle {
  cursor: move;
  cursor: -webkit-grabbing;
}
```

### `filter` option

```js
Sortable.create(list, {
  filter: ".js-remove, .js-edit",
  onFilter: function (evt) {
    var item = evt.item,
      ctrl = evt.target;

    if (Sortable.utils.is(ctrl, ".js-remove")) {
      // Click on remove button
      item.parentNode.removeChild(item); // remove sortable item
    } else if (Sortable.utils.is(ctrl, ".js-edit")) {
      // Click on edit link
      // ...
    }
  },
});
```

### `ghostClass` option

Class name for the drop placeholder (default `sortable-ghost`).

Demo: https://jsbin.com/henuyiw/edit?css,js,output

```css
.ghost {
  opacity: 0.4;
}
```

```js
Sortable.create(list, {
  ghostClass: "ghost",
});
```

### `chosenClass` option

Class name for the chosen item (default `sortable-chosen`).

Demo: https://jsbin.com/hoqufox/edit?css,js,output

```css
.chosen {
  color: #fff;
  background-color: #c00;
}
```

```js
Sortable.create(list, {
  delay: 500,
  chosenClass: "chosen",
});
```

### `forceFallback` option

If set to `true`, the Fallback for non HTML5 Browser will be used, even if we are using an HTML5 Browser.
This gives us the possibility to test the behaviour for older Browsers even in newer Browser, or make the Drag 'n Drop feel more consistent between Desktop , Mobile and old Browsers.

On top of that, the Fallback always generates a copy of that DOM Element and appends the class `fallbackClass` defined in the options. This behaviour controls the look of this 'dragged' Element.

Demo: https://jsbin.com/sibiput/edit?html,css,js,output

### `fallbackTolerance` option

Emulates the native drag threshold. Specify in pixels how far the mouse should move before it's considered as a drag.
Useful if the items are also clickable like in a list of links.

When the user clicks inside a sortable element, it's not uncommon for your hand to move a little between the time you press and the time you release.
Dragging only starts if you move the pointer past a certain tolerance, so that you don't accidentally start dragging every time you click.

3 to 5 are probably good values.

### `dragoverBubble` option

If set to `true`, the dragover event will bubble to parent sortables. Works on both fallback and native dragover event.
By default, it is false, but Sortable will only stop bubbling the event once the element has been inserted into a parent Sortable, or _can_ be inserted into a parent Sortable, but isn't at that specific time (due to animation, etc).

Since 1.8.0, you will probably want to leave this option as false. Before 1.8.0, it may need to be `true` for nested sortables to work.

### `removeCloneOnHide` option

If set to `false`, the clone is hidden by having it's CSS `display` property set to `none`.
By default, this option is `true`, meaning Sortable will remove the cloned element from the DOM when it is supposed to be hidden.

### `emptyInsertThreshold` option

The distance (in pixels) the mouse must be from an empty sortable while dragging for the drag element to be inserted into that sortable. Defaults to `5`. Set to `0` to disable this feature.

Demo: https://jsbin.com/becavoj/edit?js,output
