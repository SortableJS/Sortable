import {
	toggleClass,
	getRect,
	index,
	closest,
	on,
	off,
	clone,
	css,
	setRect,
	unsetRect,
	matrix,
	expando
} from '../../src/utils.js';

import dispatchEvent from '../../src/EventDispatcher.js';

let multiDragElements = [],
	multiDragClones = [],
	lastMultiDragSelect, // for selection with modifier key down (SHIFT)
	multiDragSortable,
	initialFolding = false, // Initial multi-drag fold when drag started
	folding = false, // Folding any other time
	dragStarted = false,
	dragEl,
	clonesFromRect,
	clonesHidden;

function MultiDragPlugin() {
	function MultiDrag(sortable) {
		// Bind all private methods
		for (let fn in this) {
			if (fn.charAt(0) === '_' && typeof this[fn] === 'function') {
				this[fn] = this[fn].bind(this);
			}
		}

		if (sortable.options.supportPointer) {
			on(document, 'pointerup', this._deselectMultiDrag);
		} else {
			on(document, 'mouseup', this._deselectMultiDrag);
			on(document, 'touchend', this._deselectMultiDrag);
		}

		on(document, 'keydown', this._checkKeyDown);
		on(document, 'keyup', this._checkKeyUp);

		this.options = {
			selectedClass: 'sortable-selected',
			multiDragKey: null,
			setData(dataTransfer, dragEl) {
				let data = '';
				if (multiDragElements.length && multiDragSortable === sortable) {
					for (let i in multiDragElements) {
						data += (!i ? '' : ', ') + multiDragElements[i].textContent;
					}
				} else {
					data = dragEl.textContent;
				}
				dataTransfer.setData('Text', data);
			}
		};
	}

	MultiDrag.prototype = {
		multiDragKeyDown: false,
		isMultiDrag: false,


		delayStartGlobal({ dragEl: dragged }) {
			dragEl = dragged;
		},

		delayEnded() {
			this.isMultiDrag = ~multiDragElements.indexOf(dragEl);
		},

		setupClone({ sortable }) {
			if (!this.isMultiDrag) return;
			for (let i in multiDragElements) {
				multiDragClones.push(clone(multiDragElements[i]));

				multiDragClones[i].sortableIndex = multiDragElements[i].sortableIndex;

				multiDragClones[i].draggable = false;
				multiDragClones[i].style['will-change'] = '';

				toggleClass(multiDragClones[i], sortable.options.selectedClass, false);
				multiDragElements[i] === dragEl && toggleClass(multiDragClones[i], sortable.options.chosenClass, false);
			}

			sortable._hideClone();
			return true;
		},

		clone({ sortable, rootEl, dispatchSortableEvent }) {
			if (!this.isMultiDrag) return;
			if (!sortable.options.removeCloneOnHide) {
				if (multiDragElements.length && multiDragSortable === sortable) {
					insertMultiDragClones(true, rootEl);
					dispatchSortableEvent('clone');

					return true;
				}
			}
		},

		showClone({ cloneNowShown, rootEl }) {
			if (!this.isMultiDrag) return;
			insertMultiDragClones(false, rootEl);
			for (let i in multiDragClones) {
				css(multiDragClones[i], 'display', '');
			}

			cloneNowShown();
			clonesHidden = false;
			return true;
		},

		hideClone({ sortable, cloneNowHidden }) {
			if (!this.isMultiDrag) return;
			for (let i in multiDragClones) {
				css(multiDragClones[i], 'display', 'none');
				if (sortable.options.removeCloneOnHide && multiDragClones[i].parentNode) {
					multiDragClones[i].parentNode.removeChild(multiDragClones[i]);
				}
			}
			cloneNowHidden();
			clonesHidden = true;
			return true;
		},

		dragStartGlobal({ sortable }) {
			if (!this.isMultiDrag && multiDragSortable) {
				multiDragSortable.multiDrag._deselectMultiDrag();
			}

			for (let i in multiDragElements) {
				multiDragElements[i].sortableIndex = index(multiDragElements[i]);
			}

			// Sort multi-drag elements
			multiDragElements = multiDragElements.sort(function(a, b) {
				return a.sortableIndex - b.sortableIndex;
			});
			dragStarted = true;
		},

		dragStarted({ sortable }) {
			if (!this.isMultiDrag) return;
			if (sortable.options.sort) {
				// Capture rects,
				// hide multi drag elements (by positioning them absolute),
				// set multi drag elements rects to dragRect,
				// show multi drag elements,
				// animate to rects,
				// unset rects & remove from DOM

				sortable.captureAnimationState();

				if (sortable.options.animation) {
					for (let i in multiDragElements) {
						if (multiDragElements[i] === dragEl) continue;
						css(multiDragElements[i], 'position', 'absolute');
					}

					let dragRect = getRect(dragEl, false, true, true);

					for (let i in multiDragElements) {
						if (multiDragElements[i] === dragEl) continue;
						setRect(multiDragElements[i], dragRect);
					}

					folding = true;
					initialFolding = true;
				}
			}

			sortable.animateAll(function() {
				folding = false;
				initialFolding = false;

				if (sortable.options.animation) {
					for (let i in multiDragElements) {
						unsetRect(multiDragElements[i]);
					}
				}

				// Remove all auxiliary multidrag items from el, if sorting enabled
				if (sortable.options.sort) {
					removeMultiDragElements();
				}
			});
		},

		dragOver({ target, completed }) {
			if (folding && ~multiDragElements.indexOf(target)) {
				return completed(false);
			}
		},

		revert({ fromSortable, rootEl, sortable, dragRect }) {
			if (multiDragElements.length > 1) {
				// Setup unfold animation
				for (let i in multiDragElements) {
					sortable.addAnimationState({
						target: multiDragElements[i],
						rect: folding ? getRect(multiDragElements[i]) : dragRect
					});

					unsetRect(multiDragElements[i]);

					multiDragElements[i].fromRect = dragRect;

					fromSortable.removeAnimationState(multiDragElements[i]);
				}
				folding = false;
				insertMultiDragElements(!sortable.options.removeCloneOnHide, rootEl);
			}
		},

		dragOverCompleted({ sortable, isOwner, insertion, activeSortable, parentEl, putSortable }) {
			let options = sortable.options;
			if (insertion) {
				// Clones must be hidden before folding animation to capture dragRectAbsolute properly
				if (isOwner) {
					activeSortable._hideClone();
				}

				initialFolding = false;
				// If leaving sort:false root, or already folding - Fold to new location
				if (options.animation && multiDragElements.length > 1 && (folding || !isOwner && !activeSortable.options.sort && !putSortable)) {
					// Fold: Set all multi drag elements's rects to dragEl's rect when multi-drag elements are invisible
					let dragRectAbsolute = getRect(dragEl, false, true, true);

					for (let i in multiDragElements) {
						if (multiDragElements[i] === dragEl) continue;
						setRect(multiDragElements[i], dragRectAbsolute);

						// Move element(s) to end of parentEl so that it does not interfere with multi-drag clones insertion if they are inserted
						// while folding, and so that we can capture them again because old sortable will no longer be fromSortable
						parentEl.appendChild(multiDragElements[i]);
					}

					folding = true;
				}

				// Clones must be shown (and check to remove multi drags) after folding when interfering multiDragElements are moved out
				if (!isOwner) {
					// Only remove if not folding (folding will remove them anyways)
					if (!folding) {
						removeMultiDragElements();
					}

					if (multiDragElements.length > 1) {
						let clonesHiddenBefore = clonesHidden;
						activeSortable._showClone(sortable);

						// Unfold animation for clones if showing from hidden
						if (activeSortable.options.animation && !clonesHidden && clonesHiddenBefore) {
							for (let i in multiDragClones) {
								activeSortable.addAnimationState({
									target: multiDragClones[i],
									rect: clonesFromRect
								});

								multiDragClones[i].fromRect = clonesFromRect;
								multiDragClones[i].thisAnimationDuration = null;
							}
						}
					} else {
						activeSortable._showClone(sortable);
					}
				}
			}
		},

		dragOverAnimationCapture({ dragRect, isOwner, activeSortable }) {
			for (let i in multiDragElements) {
				multiDragElements[i].thisAnimationDuration = null;
			}

			if (activeSortable.options.animation && !isOwner && activeSortable.multiDrag.isMultiDrag) {
				clonesFromRect = Object.assign({}, dragRect);
				let dragMatrix = matrix(dragEl, true);
				clonesFromRect.top -= dragMatrix.f;
				clonesFromRect.left -= dragMatrix.e;
			}
		},

		dragOverAnimationComplete() {
			if (folding) {
				folding = false;
				removeMultiDragElements();
			}
		},

		drop({ originalEvent: evt, rootEl, parentEl, sortable, dispatchSortableEvent, oldIndex, putSortable }) {
			let toSortable = (putSortable || this.sortable);

			if (!evt) return;

			let options = sortable.options,
				children = parentEl.children;

			// Multi-drag selection
			if (!dragStarted) {
				if (options.multiDragKey && !this.multiDragKeyDown) {
					this._deselectMultiDrag();
				}
				toggleClass(dragEl, options.selectedClass, !~multiDragElements.indexOf(dragEl));

				if (!~multiDragElements.indexOf(dragEl)) {
					multiDragElements.push(dragEl);
					dispatchEvent({
						sortable,
						rootEl,
						name: 'select',
						targetEl: dragEl,
						originalEvt: evt
					});

					// Modifier activated, select from last to dragEl
					if ((!options.multiDragKey || this.multiDragKeyDown) && evt.shiftKey && lastMultiDragSelect && sortable.el.contains(lastMultiDragSelect)) {
						let lastIndex = index(lastMultiDragSelect),
							currentIndex = index(dragEl);

						if (~lastIndex && ~currentIndex && lastIndex !== currentIndex) {
							// Must include lastMultiDragSelect (select it), in case modified selection from no selection
							// (but previous selection existed)
							let n, i;
							if (currentIndex > lastIndex) {
								i = lastIndex;
								n = currentIndex;
							} else {
								i = currentIndex;
								n = lastIndex + 1;
							}

							for (; i < n; i++) {
								if (~multiDragElements.indexOf(children[i])) continue;
								toggleClass(children[i], options.selectedClass, true);
								multiDragElements.push(children[i]);

								dispatchEvent({
									sortable: sortable,
									rootEl,
									name: 'select',
									targetEl: children[i],
									originalEvt: evt
								});
							}
						}
					} else {
						lastMultiDragSelect = dragEl;
					}

					multiDragSortable = toSortable;
				} else {
					multiDragElements.splice(multiDragElements.indexOf(dragEl), 1);
					lastMultiDragSelect = null;
					dispatchEvent({
						sortable,
						rootEl,
						name: 'deselect',
						targetEl: dragEl,
						originalEvt: evt
					});
				}
			}

			// Multi-drag drop
			if (dragStarted && this.isMultiDrag) {
				// Do not "unfold" after around dragEl if reverted
				if ((parentEl[expando].options.sort || parentEl !== rootEl) && multiDragElements.length > 1) {
					let dragRect = getRect(dragEl),
						multiDragIndex = index(dragEl, ':not(.' + Sortable.active.options.selectedClass + ')');

					if (!initialFolding && options.animation) dragEl.thisAnimationDuration = null;

					toSortable.captureAnimationState();

					if (!initialFolding) {
						if (options.animation) {
							dragEl.fromRect = dragRect;
							for (let i in multiDragElements) {
								multiDragElements[i].thisAnimationDuration = null;
								if (multiDragElements[i] !== dragEl) {
									let rect = folding ? getRect(multiDragElements[i]) : dragRect;
									multiDragElements[i].fromRect = rect;

									// Prepare unfold animation
									toSortable.addAnimationState({
										target: multiDragElements[i],
										rect: rect
									});
								}
							}
						}

						// Multi drag elements are not necessarily removed from the DOM on drop, so to reinsert
						// properly they must all be removed
						removeMultiDragElements();

						for (let i in multiDragElements) {
							if (children[multiDragIndex]) {
								parentEl.insertBefore(multiDragElements[i], children[multiDragIndex]);
							} else {
								parentEl.appendChild(multiDragElements[i]);
							}
							multiDragIndex++;
						}

						// If initial folding is done, the elements may have changed position because they are now
						// unfolding around dragEl, even though dragEl may not have his index changed, so update event
						// must be fired here as Sortable will not.
						if (oldIndex === index(dragEl)) {
							let update = false;
							for (let i in multiDragElements) {
								if (multiDragElements[i].sortableIndex !== index(multiDragElements[i])) {
									update = true;
									break;
								}
							}

							if (update) {
								dispatchSortableEvent('update');
							}
						}
					}

					// Must be done after capturing individual rects (scroll bar)
					for (let i in multiDragElements) {
						unsetRect(multiDragElements[i]);
					}

					toSortable.animateAll();
				}

				multiDragSortable = toSortable;
			}

			// Remove clones if necessary
			if (rootEl === parentEl || (putSortable && putSortable.lastPutMode !== 'clone')) {
				for (let i in multiDragClones) {
					multiDragClones[i].parentNode && multiDragClones[i].parentNode.removeChild(multiDragClones[i]);
				}
			}
		},

		nullingGlobal() {
			this.isMultiDrag =
			dragStarted = false;
			multiDragClones.length = 0;
		},

		destroy() {
			this._deselectMultiDrag();
			off(document, 'pointerup', this._deselectMultiDrag);
			off(document, 'mouseup', this._deselectMultiDrag);
			off(document, 'touchend', this._deselectMultiDrag);

			off(document, 'keydown', this._checkKeyDown);
			off(document, 'keyup', this._checkKeyUp);
		},

		_deselectMultiDrag(evt) {
			if (dragStarted) return;

			// Only deselect if selection is in this sortable
			if (multiDragSortable !== this.sortable) return;

			// Only deselect if target is not item in this sortable
			if (evt && closest(evt.target, this.sortable.options.draggable, this.sortable.el, false)) return;

			// Only deselect if left click
			if (evt && evt.button !== 0) return;

			while (multiDragElements.length) {
				let el = multiDragElements[0];
				toggleClass(el, this.sortable.options.selectedClass, false);
				multiDragElements.shift();
				dispatchEvent({
					sortable: this.sortable,
					rootEl: this.sortable.el,
					name: 'deselect',
					targetEl: el,
					originalEvt: evt
				});
			}
		},

		_checkKeyDown(evt) {
			if (evt.key === this.sortable.options.multiDragKey) {
				this.multiDragKeyDown = true;
			}
		},

		_checkKeyUp(evt) {
			if (evt.key === this.sortable.options.multiDragKey) {
				this.multiDragKeyDown = false;
			}
		}
	};

	return Object.assign(MultiDrag, {
		// Static methods & properties
		pluginName: 'multiDrag',
		utils: {
			/**
			 * Selects the provided multi-drag item
			 * @param  {HTMLElement} el    The element to be selected
			 */
			select(el) {
				let sortable = el.parentNode[expando];
				if (!sortable || !sortable.options.multiDrag || ~multiDragElements.indexOf(el)) return;
				if (multiDragSortable && multiDragSortable !== sortable) {
					multiDragSortable.multiDrag._deselectMultiDrag();
					multiDragSortable = sortable;
				}
				toggleClass(el, sortable.options.selectedClass, true);
				multiDragElements.push(el);
			},
			/**
			 * Deselects the provided multi-drag item
			 * @param  {HTMLElement} el    The element to be deselected
			 */
			deselect(el) {
				let sortable = el.parentNode[expando],
					index = multiDragElements.indexOf(el);
				if (!sortable || !sortable.options.multiDrag || !~index) return;
				toggleClass(el, sortable.options.selectedClass, false);
				multiDragElements.splice(index, 1);
			}
		},
		eventOptions() {
			return {
				items: [...multiDragElements],
				clones: [...multiDragClones]
			};
		},
		optionListeners: {
			multiDragKey(key) {
				key = key.toLowerCase();
				if (key === 'ctrl') {
					key = 'Control';
				} else if (key.length > 1) {
					key = key.charAt(0).toUpperCase() + key.substr(1);
				}
				return key;
			}
		}
	});
}

function insertMultiDragElements(clonesInserted, rootEl) {
	for (let i in multiDragElements) {
		let target = rootEl.children[multiDragElements[i].sortableIndex + (clonesInserted ? Number(i) : 0)];
		if (target) {
			rootEl.insertBefore(multiDragElements[i], target);
		} else {
			rootEl.appendChild(multiDragElements[i]);
		}
	}
}

/**
 * Insert multi-drag clones
 * @param  {[Boolean]} elementsInserted  Whether the multi-drag elements are inserted
 * @param  {HTMLElement} rootEl
 */
function insertMultiDragClones(elementsInserted, rootEl) {
	for (let i in multiDragClones) {
		let target = rootEl.children[multiDragClones[i].sortableIndex + (elementsInserted ? Number(i) : 0)];
		if (target) {
			rootEl.insertBefore(multiDragClones[i], target);
		} else {
			rootEl.appendChild(multiDragClones[i]);
		}
	}
}

function removeMultiDragElements() {
	for (let i in multiDragElements) {
		if (multiDragElements[i] === dragEl) continue;
		multiDragElements[i].parentNode && multiDragElements[i].parentNode.removeChild(multiDragElements[i]);
	}
}

export default MultiDragPlugin;
