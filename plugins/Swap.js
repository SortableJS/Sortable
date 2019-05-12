import {
	_toggleClass,
	_getRect,
	_index,
	_extend
} from '../src/utils.js';

let lastSwapEl;


function SwapPlugin() {
	function Swap() {
		this.options = {
			swapClass: 'sortable-swap-highlight'
		};
	}

	Swap.prototype = {
		dragStart({ dragEl }) {
			lastSwapEl = dragEl;
		},
		dragOverValid({ completed, target, onMove, changed }) {
			let el = this.sortable.el,
				options = this.sortable.options;
			if (target && target !== el) {
				let prevSwapEl = lastSwapEl;
				if (onMove(target) !== false) {
					_toggleClass(target, options.swapClass, true);
					lastSwapEl = target;
				} else {
					lastSwapEl = null;
				}

				if (prevSwapEl && prevSwapEl !== lastSwapEl) {
					_toggleClass(prevSwapEl, options.swapClass, false);
				}
			}
			changed();

			return completed(true);
		},
		drop({ putSortable, dragEl }) {
			let toSortable = (putSortable || this.sortable);
			let options = this.sortable.options;
			lastSwapEl && _toggleClass(lastSwapEl, options.swapClass, false);
			if (lastSwapEl && (options.swap || putSortable && putSortable.options.swap)) {
				if (dragEl !== lastSwapEl) {
					toSortable.captureAnimationState();
					swapNodes(dragEl, lastSwapEl);

					toSortable.animateAll();
				}
			}
		},
		nulling() {
			lastSwapEl = null;
		}
	};

	return _extend(Swap, {
		pluginName: 'swap',
		eventOptions() {
			return {
				lastSwapEl
			};
		}
	});
}


function swapNodes(n1, n2) {
	let p1 = n1.parentNode,
		p2 = n2.parentNode,
		i1, i2;

	if (!p1 || !p2 || p1.isEqualNode(n2) || p2.isEqualNode(n1)) return;

	i1 = _index(n1);
	i2 = _index(n2);

	if (p1.isEqualNode(p2) && i1 < i2) {
		i2++;
	}
	p1.insertBefore(n2, p1.children[i1]);
	p2.insertBefore(n1, p2.children[i2]);
}

export default SwapPlugin;
