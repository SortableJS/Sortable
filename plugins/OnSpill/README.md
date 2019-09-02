# OnSpill Plugins
This file contains two seperate plugins, RemoveOnSpill and RevertOnSpill. They can be imported individually, or the default export (an array of both plugins) can be passed to `Sortable.mount` as well.

**These plugins are default plugins, and are included in the default UMD and ESM builds of Sortable**


---


### Mounting
```js
import { Sortable, OnSpill } from 'sortablejs/modular/sortable.core.esm';

Sortable.mount(OnSpill);
```


---


## RevertOnSpill Plugin
This plugin, when enabled, will cause the dragged item to be reverted to it's original position if it is spilled (ie. it is dropped outside of a valid Sortable drop target)




### Options

```js
new Sortable(el, {
	revertOnSpill: true, // Enable plugin
	// Called when item is spilled
	onSpill: function(/**Event*/evt) {
		evt.item // The spilled item
	}
});
```


---


## RemoveOnSpill Plugin
This plugin, when enabled, will cause the dragged item to be removed from the DOM if it is spilled (ie. it is dropped outside of a valid Sortable drop target)


---


### Options

```js
new Sortable(el, {
	removeOnSpill: true, // Enable plugin
	// Called when item is spilled
	onSpill: function(/**Event*/evt) {
		evt.item // The spilled item
	}
});
```
