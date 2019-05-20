import { getChild } from '../../src/utils.js';


function SpillPlugin() {

	const drop = function({
		originalEvent,
		putSortable,
		dragEl,
		activeSortable,
		dispatchSortableEvent,
		hideGhostForTarget,
		unhideGhostForTarget
	}) {
		hideGhostForTarget();
		let target = document.elementFromPoint(originalEvent.clientX, originalEvent.clientY);
		unhideGhostForTarget();

		if (!(putSortable || activeSortable).el.contains(target)) {
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

	function Remove() {}

	Remove.prototype = {
		onSpill(dragEl) {
			dragEl.parentNode && dragEl.parentNode.removeChild(dragEl);
		},
		drop
	};


	return [
		Object.assign(Revert, {
			pluginName: 'revertOnSpill'
		}),
		Object.assign(Remove, {
			pluginName: 'removeOnSpill'
		})
	];
}


export default SpillPlugin;
