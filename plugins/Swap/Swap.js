import {
	toggleClass,
	index
} from '../../src/utils.js';

let lastSwapEl;


function SwapPlugin() {
	function Swap() {
		this.defaults = {
			swapClass: 'sortable-swap-highlight'
		};
	}

	Swap.prototype = {
		dragStart({ dragEl }) {
			lastSwapEl = dragEl;
		},
		dragOverValid({ completed, target, onMove, activeSortable, changed, cancel }) {
			if (!activeSortable.options.swap) return;
			let el = this.sortable.el,
				options = this.options;
			if (target && target !== el) {
				let prevSwapEl = lastSwapEl;
				if (onMove(target) !== false) {
					toggleClass(target, options.swapClass, true);
					lastSwapEl = target;
				} else {
					lastSwapEl = null;
				}

				if (prevSwapEl && prevSwapEl !== lastSwapEl) {
					toggleClass(prevSwapEl, options.swapClass, false);
				}
			}
			changed();

			completed(true);
			cancel();
		},
		drop({ activeSortable, putSortable, dragEl }) {
			let toSortable = (putSortable || this.sortable);
			let options = this.options;
			lastSwapEl && toggleClass(lastSwapEl, options.swapClass, false);
			if (lastSwapEl && (options.swap || putSortable && putSortable.options.swap)) {
				if (dragEl !== lastSwapEl) {
					toSortable.captureAnimationState();
					if (toSortable !== activeSortable) activeSortable.captureAnimationState();
					swapNodes(dragEl, lastSwapEl);

					toSortable.animateAll();
					if (toSortable !== activeSortable) activeSortable.animateAll();
				}
			}
		},
		nulling() {
			lastSwapEl = null;
		}
	};

	return Object.assign(Swap, {
		pluginName: 'swap',
		eventProperties() {
			return {
				swapItem: lastSwapEl
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
