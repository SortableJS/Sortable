import { IE11OrLess, Edge } from './BrowserInfo.js';
import { expando } from './utils.js';
import PluginManager from './PluginManager.js';

export default function dispatchEvent(
	{
		sortable, rootEl, name,
		targetEl, cloneEl, toEl, fromEl,
		oldIndex, newIndex,
		oldDraggableIndex, newDraggableIndex,
		originalEvt, putSortable
	}
) {
	sortable = (sortable || rootEl[expando]);
	let evt,
		options = sortable.options,
		onName = 'on' + name.charAt(0).toUpperCase() + name.substr(1);
	// Support for new CustomEvent feature
	if (window.CustomEvent && !IE11OrLess && !Edge) {
		evt = new CustomEvent(name, {
			bubbles: true,
			cancelable: true
		});
	} else {
		evt = document.createEvent('Event');
		evt.initEvent(name, true, true);
	}

	evt.to = toEl || rootEl;
	evt.from = fromEl || rootEl;
	evt.item = targetEl || rootEl;
	evt.clone = cloneEl;

	evt.oldIndex = oldIndex;
	evt.newIndex = newIndex;

	evt.oldDraggableIndex = oldDraggableIndex;
	evt.newDraggableIndex = newDraggableIndex;

	evt.originalEvent = originalEvt;
	evt.pullMode = putSortable ? putSortable.lastPutMode : undefined;

	let eventOptions = PluginManager.getEventOptions(name, sortable);
	for (let option in eventOptions) {
		evt[option] = eventOptions[option];
	}

	if (rootEl) {
		rootEl.dispatchEvent(evt);
	}

	if (options[onName]) {
		options[onName].call(sortable, evt);
	}
}
