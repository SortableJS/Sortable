import { IE11OrLess, Edge } from './BrowserInfo.js';
import { expando } from './utils.js';
import PluginManager from './PluginManager.js';

export default function dispatchEvent(
	{
		sortable, rootEl, name,
		targetEl, cloneEl, toEl, toSortable, fromEl, fromSortable,
		oldIndex, newIndex,
		oldDraggableIndex, newDraggableIndex,
		originalEvent, putSortable, extraEventProperties,
		originalAllEventProperties
	}
) {
	sortable = (sortable || (rootEl && rootEl[expando]));
	if (!sortable) return;

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
	evt.toSortable = toSortable || undefined;
	evt.from = fromEl || rootEl;
	evt.fromSortable = fromSortable || undefined;
	evt.item = targetEl || rootEl;
	evt.clone = cloneEl;

	evt.oldIndex = oldIndex;
	evt.newIndex = newIndex;

	evt.oldDraggableIndex = oldDraggableIndex;
	evt.newDraggableIndex = newDraggableIndex;

	evt.originalEvent = originalEvent;
	evt.pullMode = putSortable ? putSortable.lastPutMode : undefined;

	let allEventProperties = { ...extraEventProperties, ...PluginManager.getEventProperties(name, sortable) };
	for (let option in allEventProperties) {
		evt[option] = originalAllEventProperties ? originalAllEventProperties[option] : allEventProperties[option];
	}

	if (rootEl) {
		rootEl.dispatchEvent(evt);
	}

	if (options[onName]) {
		options[onName].call(sortable, evt);
	}
}
