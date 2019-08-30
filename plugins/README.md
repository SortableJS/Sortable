# Creating Sortable Plugins
Sortable plugins are plugins that can be directly mounted to the Sortable class. They are a powerful way of modifying the default behaviour of Sortable beyond what simply using events alone allows. To mount your plugin to Sortable, it must pass a constructor function to the `Sortable.mount` function. This constructor function will be called (with the `new` keyword in front of it) whenever a Sortable instance with your plugin enabled is initialized. The constructor function will be called with the parameters `sortable` and `el`, which is the HTMLElement that the Sortable is being initialized on. This means that there will be a new instance of your plugin each time it is enabled in a Sortable.


## Constructor Parameters

`sortable: Sortable` — The sortable that the plugin is being initialized on

`el: HTMLElement` — The element that the sortable is being initialized on

`options: Object` — The options object that the user has passed into Sortable (not merged with defaults yet)


## Static Properties
The constructor function passed to `Sortable.mount` may contain several static properties and methods. The following static properties may be defined:

`pluginName: String` (Required)
The name of the option that the user will use in their sortable's options to enable the plugin. Should start with a lower case and be camel-cased. For example: `'multiDrag'`. This is also the property name that the plugin's instance will be under in a sortable instance (ex. `sortableInstance.multiDrag`).

`utils: Object`
Object containing functions that will be added to the `Sortable.utils` static object on the Sortable class.

`eventOptions(eventName: String): Function`
A function that is called whenever Sortable fires an event. This function should return an object to be combined with the event object that Sortable will emit. The function will be called in the context of the instance of the plugin on the Sortable that is firing the event (ie. the `this` keyword will be the plugin instance).

`initializeByDefault: Boolean`
Determines whether or not the plugin will always be initialized on every new Sortable instance. If this option is enabled, it does not mean that by default the plugin will be enabled on the Sortable - this must still be done in the options via the plugin's `pluginName`, or it can be enabled by default if your plugin specifies it's pluginName as a default option that is truthy. Since the plugin will already be initialized on every Sortable instance, it can also be enabled dynamically via `sortableInstance.option('pluginName', true)`.
It is a good idea to have this option set to `false` if the plugin modifies the behaviour of Sortable in such a way that enabling or disabling the plugin dynamically could cause it to break. Likewise, this option should be disabled if the plugin should only be instantiated on Sortables in which that plugin is enabled.
This option defaults to `true`.

`optionListeners: Object`
An object that may contain event listeners that are fired when a specific option is updated.
These listeners are useful because the user's provided options are not necessarily unchanging once the plugin is initialized, and could be changed dynamically via the `option()` method.
The listener will be fired in the context of the instance of the plugin that it is being changed in (ie. the `this` keyword will be the instance of your plugin).
The name of the method should match the name of the option it listens for. The new value of the option will be passed in as an argument, and any returned value will be what the option is stored as. If no value is returned, the option will be stored as the value the user provided.

Example:

```js
Plugin.name = 'generateTitle';
Plugin.optionModifiers = {
	// Listen for option 'generateTitle'
	generateTitle: function(title) {
		// Store the option in all caps
		return title.toUpperCase();

		// OR save it to this instance of your plugin as a private field.
		// This way it can be accessed in events, but will not modify the user's options.
		this.titleAllCaps = title.toUpperCase();
	}
};

``` 

## Plugin Options
Plugins may have custom default options or may override the defaults of other options. In order to do this, there must be a `defaults` object on the initialized plugin. This can be set in the plugin's prototype, or during the initialization of the plugin (when the `el` is available). For example:

```js
function myPlugin(sortable, el, options) {
	this.defaults = {
		color: el.style.backgroundColor
	};
}

Sortable.mount(myPlugin);
```


## Plugin Events

### Context
The events will be fired in the context of their own parent object (ie. context is not changed), however the plugin instance's Sortable instance is available under `this.sortable`. Likewise, the options are available under `this.options`.

### Event List
The following table contains details on the events that a plugin may handle in the prototype of the plugin's constructor function.

| Event Name                | Description                                                                                                      | Cancelable? | Cancel Behaviour                                   | Event Type | Custom Event Object Properties                                          |
|---------------------------|------------------------------------------------------------------------------------------------------------------|-------------|----------------------------------------------------|------------|-------------------------------------------------------------------------|
| filter                    | Fired when the element is filtered, and dragging is therefore canceled                                           | No          | -                                                  | Normal     | None                                                                    |
| delayStart                | Fired when the delay starts, even if there is no delay                                                           | Yes         | Cancels sorting                                    | Normal     | None                                                                    |
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
| destroy                   | Fired when Sortable is destroyed                                                                                 | No          | -                                                  | Normal     | None                                                                    |

### Global Events
Normally, an event will only be fired in a plugin if the plugin is enabled on the Sortable from which the event is being fired. However, it sometimes may be desirable for a plugin to listen in on an event from Sortables in which it is not enabled on. This is possible with global events. For an event to be global, simply add the suffix 'Global' to the event's name (casing matters) (eg. `dragStartGlobal`).
Please note that your plugin must be initialized on any Sortable from which it expects to recieve events, and that includes global events. In other words, you will want to keep the `initializeByDefault` option as it's default `true` value if your plugin needs to recieve events from Sortables it is not enabled on.
Please also note that if both normal and global event handlers are set, the global event handler will always be fired before the regular one.

### Event Object
An object with the following properties is passed as an argument to each plugin event when it is fired.

#### Properties:

`dragEl: HTMLElement` — The element being dragged

`parentEl: HTMLElement` — The element that the dragged element is currently in

`ghostEl: HTMLElement|undefined` — If using fallback, the element dragged under the cursor (undefined until after `dragStarted` plugin event)

`rootEl: HTMLElement` — The element that the dragged element originated from

`nextEl: HTMLElement` — The original next sibling of dragEl

`cloneEl: HTMLElement|undefined` — The clone element (undefined until after `setupClone` plugin event)

`cloneHidden: Boolean` — Whether or not the clone is hidden

`dragStarted: Boolean` — Boolean indicating whether or not the dragStart event has fired

`putSortable: Sortable|undefined` — The element that dragEl is dragged into from it's root, otherwise undefined 

`activeSortable: Sortable` — The active Sortable instance

`originalEvent: Event` — The original HTML event corresponding to the Sortable event

`oldIndex: Number` — The old index of dragEl

`oldDraggableIndex: Number` — The old index of dragEl, only counting draggable elements

`newIndex: Number` — The new index of dragEl

`newDraggableIndex: Number` — The new index of dragEl, only counting draggable elements


#### Methods:

`cloneNowHidden()` — Function to be called if the plugin has hidden the clone

`cloneNowShown()` — Function to be called if the plugin has shown the clone

`hideGhostForTarget()` — Hides the fallback ghost element if CSS pointer-events are not available. Call this before using document.elementFromPoint at the mouse position.

`unhideGhostForTarget()` — Unhides the ghost element. To be called after `hideGhostForTarget()`.

`dispatchSortableEvent(eventName: String)` — Function that can be used to emit an event on the current sortable while sorting, with all usual event properties set (eg. indexes, rootEl, cloneEl, originalEvent, etc.).


### DragOverEvent Object
This event is passed to dragover events, and extends the normal event object.

#### Properties:

`isOwner: Boolean` — Whether or not the dragged over sortable currently contains the dragged element

`axis: String` — Direction of the dragged over sortable, `'vertical'` or `'horizontal'`

`revert: Boolean` — Whether or not the dragged element is being reverted to it's original position from another position

`dragRect: DOMRect` — DOMRect of the dragged element

`targetRect: DOMRect` — DOMRect of the target element

`canSort: Boolean` — Whether or not sorting is enabled in the dragged over sortable

`fromSortable: Sortable` — The sortable that the dragged element is coming from

`target: HTMLElement` — The sortable item that is being dragged over


#### Methods:

`onMove(target: HTMLElement, after: Boolean): Boolean|Number` — Calls the `onMove` function the user specified in the options

`changed()` — Fires the `onChange` event with event properties preconfigured

`completed(insertion: Boolean)` — Should be called when dragover has "completed", meaning bubbling should be stopped. If `insertion` is `true`, Sortable will treat it as if the dragged element was inserted into the sortable, and hide/show clone, set ghost class, animate, etc.
