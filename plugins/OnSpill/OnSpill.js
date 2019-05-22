import { getChild } from '../../src/utils.js';


const drop = function({
	originalEvent,
	putSortable,
	dragEl,
	activeSortable,
	dispatchSortableEvent,
	hideGhostForTarget,
	unhideGhostForTarget
}) {
	let fromSortable = putSortable || activeSortable;
	hideGhostForTarget();
	let target = document.elementFromPoint(originalEvent.clientX, originalEvent.clientY);
	unhideGhostForTarget();

	if (fromSortable && !fromSortable.el.contains(target)) {
		dispatchSortableEvent('spill');
		this.onSpill(dragEl);
	}
};

function Revert() {}

Revert.prototype = {
	startIndex: null,
	dragStart({ oldDraggableIndex }) {
		this.startIndex = oldDraggableIndex;
	},
	onSpill(dragEl) {
		this.sortable.captureAnimationState();
		let nextSibling = getChild(this.sortable.el, this.startIndex, this.sortable.options);

		if (nextSibling) {
			this.sortable.el.insertBefore(dragEl, nextSibling);
		} else {
			this.sortable.el.appendChild(dragEl);
		}
		this.sortable.animateAll();
	},
	drop
};

Object.assign(Revert, {
	pluginName: 'revertOnSpill'
});


function Remove() {}

Remove.prototype = {
	onSpill(dragEl) {
		this.sortable.captureAnimationState();
		dragEl.parentNode && dragEl.parentNode.removeChild(dragEl);
		this.sortable.animateAll();
	},
	drop
};

Object.assign(Remove, {
	pluginName: 'removeOnSpill'
});


export default [Remove, Revert];

export {
	Remove as RemoveOnSpill,
	Revert as RevertOnSpill
};
