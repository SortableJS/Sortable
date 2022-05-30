import {
	toggleClass,
	index
} from '../../src/utils.js';

let lastSwapValidEl;


function SwapPlugin() {
	function Swap() {
		this.defaults = {
			swapClass: 'sortable-swap-highlight'
		};
	}

	Swap.prototype = {
		dragOver({ activeSortable, target, dragEl, onMove, completed, cancel }) {
			let el = this.sortable.el,
				options = this.options;

			if (!activeSortable.options.swap || !target || target === el || target.contains(dragEl) || onMove(target) === false) {
				lastSwapValidEl && toggleClass(lastSwapValidEl, options.swapClass, false);
				lastSwapValidEl = null;

				completed(false);
				cancel();
			}
		},
		dragOverValid({ target, changed, completed, cancel }) {
			let options = this.options;

			if (lastSwapValidEl && lastSwapValidEl !== target) {
				toggleClass(lastSwapValidEl, options.swapClass, false);
			}

			toggleClass(target, options.swapClass, true);
			lastSwapValidEl = target;

			changed();

			completed(true);
			cancel();
		},
		drop({ activeSortable, putSortable, dragEl, cancel }) {
			let toSortable = putSortable || this.sortable,
				options = this.options;
				
			if (!lastSwapValidEl) {
				toggleClass(dragEl, options.ghostClass, false);
				cancel();
				return 
			}

			toggleClass(lastSwapValidEl, options.swapClass, false);
			
			if (options.swap || putSortable && putSortable.options.swap) {
				toSortable.captureAnimationState();
				if (toSortable !== activeSortable) activeSortable.captureAnimationState();

				swapNodes(dragEl, lastSwapValidEl);

				toSortable.animateAll();
				if (toSortable !== activeSortable) activeSortable.animateAll();
			}
		},
		nulling() {
			lastSwapValidEl = null;
		}
	};

	return Object.assign(Swap, {
		pluginName: 'swap',
		eventProperties() {
			return {
				swapItem: lastSwapValidEl
			};
		}
	});
}


function swapNodes(n1, n2) {
	let p1 = n1.parentNode,
		p2 = n2.parentNode,
		i1, i2;

	if (!p1 || !p2 || p1.isEqualNode(n2) || p2.isEqualNode(n1)) return;

	i1 = index(n1);
	i2 = index(n2);

	if (p1.isEqualNode(p2) && i1 < i2) {
		i2++;
	}
	p1.insertBefore(n2, p1.children[i1]);
	p2.insertBefore(n1, p2.children[i2]);
}

export default SwapPlugin;
