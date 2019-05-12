# Creating Sortable Plugins
Sortable plugins are plugins that can be directly mounted to the Sortable class. They are a powerful way of modifying the default behaviour of Sortable beyond what simply using events alone allows. To mount your plugin to Sortable, it must pass a constructor function to the `Sortable.mount` function. This constructor function will be called (with the `new` keyword in front of it) whenever a Sortable instance with your plugin enabled is initialized. The constructor function will be called with the parameters `sortable` and `el`, which is the HTMLElement that the Sortable is being initialized on. This means that there will be a new instance of your plugin each time it is enabled in a Sortable.


## Constructor Parameters

`sortable: Sortable` — The sortable that the plugin is being initialized on

`el: HTMLElement` — The element that the sortable is being initialized on


## Static Properties
The constructor function passed to `Sortable.mount` may contain several static properties and methods. The following static properties may be defined:

`pluginName: String` (Required) — The name of the option that the user will use in their sortable's options to enable your plugin. Should start with a lower case and be camel-cased. For example: `'multiDrag'`.

`utils: Object` — Object containing functions that will be added to the `Sortable.utils` default object on the Sortable class.

`eventOptions(eventName: String, sortable: Sortable): Function` — A function that is called whenever Sortable fires an event. This function should return an object to be combined with the event object that Sortable will emit.


## Plugin Options
Your plugin may have custom options or override the defaults of certain options. In order to do this, there must be an `options` object on the initialized plugin. This can be set in the plugin's prototype, or during the initialization of the plugin (when the `el` is available). For example:

```js
function myPlugin(el) {
	this.options = {
		color: el.style.backgroundColor
	};
}

Sortable.mount(myPlugin);
```


## Plugin Events

### Event List
The following table contains details on the events that your plugin may handle in the prototype of the plugin's constructor function.

| Event Name                | Description                                                                                                      | Cancelable? | Cancel Behaviour                                   | Event Type | Custom Event Object Properties                                          |
|---------------------------|------------------------------------------------------------------------------------------------------------------|-------------|----------------------------------------------------|------------|-------------------------------------------------------------------------|
| delayStart                | If the sortable has the delay option set, fired when the delay starts                                            | Yes         | Cancels sorting                                    | Normal     | None                                                                    |
| delayEnded                | Fired when the delay ends, even if there is no delay                                                             | Yes         | Cancels sorting                                    | Normal     | None                                                                    |
| setupClone                | Fired when Sortable clones the dragged element                                                                   | Yes         | Cancels normal clone setup                         | Normal     | None                                                                    |
| dragStart                 | Fired when the dragging is first started                                                                         | Yes         | Cancels sorting                                    | Normal     | None                                                                    |
| clone                     | Fired when the clone is inserted into the DOM (if `removeCloneOnHide: false`). Tick after dragStart.             | Yes         | Cancels normal clone insertion & hiding            | Normal     | None                                                                    |
| dragStarted               | Fired tick after dragStart                                                                                       | No          | -                                                  | Normal     | None                                                                    |
| dragOver                  | Fired when the user drags over a sortable                                                                        | Yes         | Cancels normal dragover behaviour                  | DragOver   | None                                                                    |
| dragOverValid             | Fired when the user drags over a sortable that the dragged item can be inserted into                             | Yes         | Cancels normal valid dragover behaviour            | DragOver   | None                                                                    |
| revert                    | Fired when the dragged item is reverted to it's original position when entering it's `sort:false` root           | Yes         | Cancels normal reverting, but is still completed() | DragOver   | None                                                                    |
| dragOverCompleted         | Fired when dragOver is completed (ie. bubbling is disabled). To check if inserted, use `inserted` even property. | No          | -                                                  | DragOver   | `insertion: Boolean` — Whether or not the dragged element was inserted  |
| dragOverAnimationCapture  | Fired right before the animation state is captured in dragOver                                                   | No          | -                                                  | DragOver   | None                                                                    |
| dragOverAnimationComplete | Fired after the animation is completed after a dragOver insertion                                                | No          | -                                                  | DragOver   | None                                                                    |
| drop                      | Fired on drop                                                                                                    | Yes         | Cancels normal drop behavior                       | Normal     | None                                                                    |
| nulling                   | Fired when the plugin should preform cleanups, once all drop events have fired                                   | No          | -                                                  | Normal     | None                                                                    |


### Event Object
An object with the following properties is passed as an argument to each plugin event when it is fired.

Properties:

`dragEl: HTMLElement` — The element being dragged

`parentEl: HTMLElement` — The element that the dragged element is currently in

`ghostEl: HTMLElement|undefined` — If using fallback, the element dragged under the cursor (undefined until after `dragStarted` plugin event)

`rootEl: HTMLElement` — The element that the dragged element originated from

`nextEl: HTMLElement` — The original next sibling of dragEl before 

`cloneEl: HTMLElement|undefined` — The clone element (undefined until after `setupClone` plugin event)

`cloneHidden: Boolean` — Whether or not the clone is hidden

`dragStarted: Boolean` — Boolean indicating whether or not the dragStart event has fired

`putSortable: Sortable|undefined` — The element that dragEl is dragged into from it's root, otherwise undefined 

Methods:
`cloneNowHidden()` — Function to be called if your plugin has hidden the clone

`cloneNowShown()` — Function to be called if your plugin has shown the clone

`dispatchSortableEvent(eventName: String)` — Function that can be used to emit an event on the current sortable while sorting, with all usual event properties set


### DragOverEvent Object

Properties:

`isOwner: Boolean` — Whether or not the dragged over sortable currently contains the dragged element

`axis: String` — Direction of the dragged over sortable, `'vertical'` or `'horizontal'`

`revert: Boolean` — Whether or not the dragged element is being reverted to it's original position from another position

`dragRect: DOMRect` — DOMRect of the dragged element

`targetRect: DOMRect` — DOMRect of the target element

`canSort: Boolean` — Whether or not sorting is enabled in the dragged over sortable

`fromSortable: Sortable` — The sortable that the dragged element is coming from

`activeSortable: Sortable` — The active Sortable instance

`target: HTMLElement` — The sortable item that is being dragged over


Methods:

`onMove(target: HTMLElement, after: Boolean): Boolean|Number` — Calls the `onMove` function the user specified in the options

`changed()` — Fires the `onChange` event with event properties preconfigured

`completed(insertion: Boolean)` — Should be called when dragover has "completed", meaning bubbling should be stopped. If `insertion` is `true`, Sortable will treat it as if the dragged element was inserted into the sortable, and hide/show clone, set ghost class, animate, etc.
