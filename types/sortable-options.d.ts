import { Sortable } from './sortable';
import { SortableEvent, SortableMoveEvent } from './sortable-event';

export interface SortableGroupOptions {
	/**
	 * group name
	 */
	name: string;
	/**
	 * ability to move from the list. clone — copy the item, rather than move.
	 */
	pull?: boolean | 'clone' | ((to: Sortable, from: Sortable) => boolean | string);
	/**
	 * whether elements can be added from other lists, or an array of group names from which elements can be taken.
	 */
	put?: boolean | string | ReadonlyArray<string> | ((to: Sortable) => boolean);
	/**
	 * a canonical version of pull, created by Sortable
	 */
	checkPull?: ((to: Sortable, from: Sortable) => boolean | string);
	/**
	 * a canonical version of put, created by Sortable
	 */
	checkPut?: (to: Sortable) => boolean;
	/**
	 * revert cloned element to initial position after moving to another list.
	 */
	revertClone?: boolean;
}

export interface SortableOptions {
	/**
	 * ms, animation speed moving items when sorting, `0` — without animation
	 */
	animation?: number;
	/**
	 * Class name for the chosen item
	 */
	chosenClass?: string;
	dataIdAttr?: string;
	/**
	 * time in milliseconds to define when the sorting should start
	 */
	delay?: number;
	/*
	 * only delay if user is using touch
	 */
	delayOnTouchOnly?: Boolean;
	/**
	 * Direction of Sortable (will be detected automatically if not given)
	 */
	direction?: 'horizontal' | 'vertical' | ((event: Event, target: HTMLElement, dragEl: HTMLElement) => 'horizontal'|'vertical');
	/**
	 * Disables the sortable if set to true.
	 */
	disabled?: boolean;
	/**
	 * Class name for the dragging item
	 */
	dragClass?: string;
	/**
	 * Specifies which items inside the element should be draggable
	 */
	draggable?: string;
	dragoverBubble?: boolean;
	dropBubble?: boolean;
	/**
	 * Easing for animation. Defaults to null. See https://easings.net/ for examples.
	 */
	easing?: string;
	/**
	 * distance in px mouse must be from empty sortable to insert drag element into it
	 */
	emptyInsertThreshold?: number;
	/**
	 * Class name for the cloned DOM Element when using forceFallback
	 */
	fallbackClass?: string;
	/**
	 * Appends the cloned DOM Element into the Document's Body
	 */
	fallbackOnBody?: boolean;
	/**
	 * Specify in pixels how far the mouse should move before it's considered as a drag.
	 */
	fallbackTolerance?: number;
	fallbackOffset?: { x: number, y: number };
	/**
	 * Selectors that do not lead to dragging (String or Function)
	 */
	filter?: string | ((this: Sortable, event: Event | TouchEvent, target: HTMLElement, sortable: Sortable) => boolean);
	/**
	 * ignore the HTML5 DnD behaviour and force the fallback to kick in
	 */
	forceFallback?: boolean;
	/**
	 * Class name for the drop placeholder
	 */
	ghostClass?: string;
	/**
	 * To drag elements from one list into another, both lists must have the same group value.
	 * You can also define whether lists can give away, give and keep a copy (clone), and receive elements.
	 */
	group?: string | SortableGroupOptions;
	/**
	 * Drag handle selector within list items
	 */
	handle?: string;
	ignore?: string;
	/**
	 * Threshold of the inverted swap zone (will be set to swapThreshold value by default)
	 */
	invertedSwapThreshold?: number,
	/**
	 * Will always use inverted swap zone if set to true
	 */
	invertSwap?: boolean,
	/**
	 * Call `event.preventDefault()` when triggered `filter`
	 */
	preventOnFilter?: boolean;
	/**
	 * Remove the clone element when it is not showing, rather than just hiding it
	 */
	removeCloneOnHide?: boolean;
	scroll?: boolean;
	/**
	 * if you have custom scrollbar scrollFn may be used for autoscrolling
	 */
	scrollFn?: ((this: Sortable, offsetX: number, offsetY: number, event: MouseEvent) => void);
	/**
	 * px, how near the mouse must be to an edge to start scrolling.
	 */
	scrollSensitivity?: number;
	/**
	 * px
	 */
	scrollSpeed?: number;
	/**
	 * sorting inside list
	 */
	sort?: boolean;
	store?: {
		get: (sortable: Sortable) => string[];
		set: (sortable: Sortable) => void;
	};
	/*
	 * Threshold of the swap zone
	 */
	swapThreshold?: number,
	/*
	 * how many pixels the point should move before cancelling a delayed drag event
	 */
	touchStartThreshold?: number;
	setData?: (dataTransfer: DataTransfer, draggedElement: HTMLElement) => void;
	/**
	 * Element dragging started
	 */
	onStart?: (event: SortableEvent) => void;
	/**
	 * Element dragging ended
	 */
	onEnd?: (event: SortableEvent) => void;
	/**
	 * Element is dropped into the list from another list
	 */
	onAdd?: (event: SortableEvent) => void;
	/**
	 * Created a clone of an element
	 */
	onClone?: (event: SortableEvent) => void;
	/**
	 * Dragging element changes position
	 */
	onChange?: (event: SortableEvent) => void;
	/**
	 * Element is chosen
	 */
	onChoose?: (event: SortableEvent) => void;
	/**
	 * Element is unchosen
	 */
	onUnchoose?: (event: SortableEvent) => void;
	/**
	 * Changed sorting within list
	 */
	onUpdate?: (event: SortableEvent) => void;
	/**
	 * Called by any change to the list (add / update / remove)
	 */
	onSort?: (event: SortableEvent) => void;
	/**
	 * Element is removed from the list into another list
	 */
	onRemove?: (event: SortableEvent) => void;
	/**
	 * Attempt to drag a filtered element
	 */
	onFilter?: (event: SortableEvent) => void;
	/**
	 * Event when you move an item in the list or between lists
	 */
	onMove?: (event: SortableMoveEvent) => boolean;
}
