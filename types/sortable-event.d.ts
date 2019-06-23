export interface SortableEvent extends Event {
	clone: HTMLElement;
	/**
	 * previous list
	 */
	from: HTMLElement;
	/**
	 * dragged element
	 */
	item: HTMLElement;
	/**
	 * new index within parent, only counting draggable elements
	 */
	newDraggableIndex: number | undefined;
	/**
	 * new index within parent
	 */
	newIndex: number | undefined;
	/**
	 * old index within parent, only counting draggable elements
	 */
	oldDraggableIndex: number | undefined;
	/**
	 * old index within parent
	 */
	oldIndex: number | undefined;
	/**
	 * Pull mode if dragging into another sortable
	 */
	pullMode: 'clone' | boolean | undefined;
	target: HTMLElement;
	/**
	 * list, in which moved element.
	 */
	to: HTMLElement;
}

export interface SortableMoveEvent extends Event {
	dragged: HTMLElement;
	draggedRect: SortableDOMRect;
	from: HTMLElement;
	/**
	 * element on which have guided
	 */
	related: HTMLElement;
	relatedRect: SortableDOMRect;
	to: HTMLElement;
	willInsertAfter?: boolean;
}

export interface SortableDOMRect {
	bottom: number;
	height: number;
	left: number;
	right: number;
	top: number;
	width: number;
	x: number;
	y: number;
}
