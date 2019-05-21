# OnSpill Plugins
This file contains two seperate plugins, RemoveOnSpill and RevertOnSpill. They can be imported individually, or the default export (an array of both plugins) can be passed to `Sortable.mount` as well.


---


## RevertOnSpill Plugin
This plugin, when enabled, will cause the dragged item to be reverted to it's original position if it is spilled (ie. it is dropped outside of a valid Sortable drop target)


---


### Options

```js
new Sortable(el, {
	revertOnSpill: false // Enable plugin
});
```


---


## RemoveOnSpill Plugin
This plugin, when enabled, will cause the dragged item to be removed from the DOM if it is spilled (ie. it is dropped outside of a valid Sortable drop target)


---


### Options

```js
new Sortable(el, {
	removeOnSpill: false // Enable plugin
});
```
