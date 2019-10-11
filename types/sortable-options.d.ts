import { Sortable } from "./sortable"
import { SortableEvent, SortableMoveEvent } from "./sortable-event"

export interface Options extends SortableOptions, OnSpillOptions, AutoScrollOptions, MultiDragOptions, SwapOptions {}

type PullResult = ReadonlyArray<string> | boolean | "clone"
type PutResult = ReadonlyArray<string> | boolean

export interface GroupOptions {
	/**
	 * group name
	 */
	name: string
	/**
	 * ability to move from the list. clone — copy the item, rather than move.
	 */
	pull?: PullResult | ((to: Sortable, from: Sortable) => PullResult)
	/**
	 * whether elements can be added from other lists, or an array of group names from which elements can be taken.
	 */
	put?: ((to: Sortable) => PutResult) | PutResult
	/**
	 * a canonical version of pull, created by Sortable
	 */
	checkPull?: (to: Sortable, from: Sortable) => boolean | string
	/**
	 * a canonical version of put, created by Sortable
	 */
	checkPut?: (to: Sortable) => boolean
	/**
	 * revert cloned element to initial position after moving to a another list.
	 */
	revertClone?: boolean
}

type Direction = "vertical" | "horizontal"

export interface SortableOptions {
	/**
	 * ms, animation speed moving items when sorting, `0` — without animation
	 */
	animation?: number
	/**
	 * Class name for the chosen item
	 */
	chosenClass?: string
	dataIdAttr?: string
	/**
	 * time in milliseconds to define when the sorting should start
	 */
	delay?: number
	/**
	 * Only delay if user is using touch
	 */
	delayOnTouchOnly?: boolean
	/**
	 * Direction of Sortable
	 * (will be detected automatically if not given)
	 */
	direction?: ((evt: SortableEvent, target: HTMLElement, dragEl: HTMLElement) => Direction) | Direction
	/**
	 * Disables the sortable if set to true.
	 */
	disabled?: boolean
	/**
	 * Class name for the dragging item
	 */
	dragClass?: string
	/**
	 * Specifies which items inside the element should be draggable
	 */
	draggable?: string
	dragoverBubble?: boolean
	dropBubble?: boolean
	/**
	 * distance mouse must be from empty sortable
	 * to insert drag element into it
	 */
	emptyInsertThreshold?: number

	/**
	 * Easing for animation. Defaults to null.
	 *
	 * See https://easings.net/ for examples.
	 *
	 * For other possible values, see
	 * https://www.w3schools.com/cssref/css3_pr_animation-timing-function.asp
	 *
	 * @example
	 *
	 * // CSS functions
	 * | 'steps(int, start | end)'
	 * | 'cubic-bezier(n, n, n, n)'
	 *
	 * // CSS values
	 * | 'linear'
	 * | 'ease'
	 * | 'ease-in'
	 * | 'ease-out'
	 * | 'ease-in-out'
	 * | 'step-start'
	 * | 'step-end'
	 * | 'initial'
	 * | 'inherit'
	 */
	easing?: string
	/**
	 * Class name for the cloned DOM Element when using forceFallback
	 */
	fallbackClass?: string
	/**
	 * Appends the cloned DOM Element into the Document's Body
	 */
	fallbackOnBody?: boolean
	/**
	 * Specify in pixels how far the mouse should move before it's considered as a drag.
	 */
	fallbackTolerance?: number
	fallbackOffset?: { x: number; y: number }
	/**
	 * Selectors that do not lead to dragging (String or Function)
	 */
	filter?: string | ((this: Sortable, event: Event | TouchEvent, target: HTMLElement, sortable: Sortable) => boolean)
	/**
	 * ignore the HTML5 DnD behaviour and force the fallback to kick in
	 */
	forceFallback?: boolean
	/**
	 * Class name for the drop placeholder
	 */
	ghostClass?: string
	/**
	 * To drag elements from one list into another, both lists must have the same group value.
	 * You can also define whether lists can give away, give and keep a copy (clone), and receive elements.
	 */
	group?: string | GroupOptions
	/**
	 * Drag handle selector within list items
	 */
	handle?: string
	ignore?: string
	/**
	 * Will always use inverted swap zone if set to true
	 */
	invertSwap?: boolean
	/**
	 * Threshold of the inverted swap zone
	 * (will be set to `swapThreshold` value by default)
	 */
	invertedSwapThreshold?: number
	/**
	 * Call `event.preventDefault()` when triggered `filter`
	 */
	preventOnFilter?: boolean
	/**
	 * Remove the clone element when it is not showing,
	 * rather than just hiding it
	 */
	removeCloneOnHide?: true
	/**
	 * sorting inside list
	 */
	sort?: boolean
	store?: {
		get: (sortable: Sortable) => string[]
		set: (sortable: Sortable) => void
	}
	/**
	 * Threshold of the swap zone.
	 * Defaults to `1`
	 */
	swapThreshold?: number
	/**
	 * How many *pixels* the point should move before cancelling a delayed drag event
	 */
	touchStartThreshold?: number

	setData?: (dataTransfer: DataTransfer, draggedElement: HTMLElement) => void
	/**
	 * Element dragging started
	 */
	onStart?: (event: SortableEvent) => void
	/**
	 * Element dragging ended
	 */
	onEnd?: (event: SortableEvent) => void
	/**
	 * Element is dropped into the list from another list
	 */
	onAdd?: (event: SortableEvent) => void
	/**
	 * Created a clone of an element
	 */
	onClone?: (event: SortableEvent) => void
	/**
	 * Element is chosen
	 */
	onChoose?: (event: SortableEvent) => void
	/**
	 * Element is unchosen
	 */
	onUnchoose?: (event: SortableEvent) => void
	/**
	 * Changed sorting within list
	 */
	onUpdate?: (event: SortableEvent) => void
	/**
	 * Called by any change to the list (add / update / remove)
	 */
	onSort?: (event: SortableEvent) => void
	/**
	 * Element is removed from the list into another list
	 */
	onRemove?: (event: SortableEvent) => void
	/**
	 * Attempt to drag a filtered element
	 */
	onFilter?: (event: SortableEvent) => void
	/**
	 * Event when you move an item in the list or between lists
	 */
	onMove?: (evt: SortableMoveEvent, originalEvent: Event) => boolean | -1 | 1
	/**
	 * Called when dragging element changes position
	 */
	onChange?: (evt: SortableEvent) => void
}
export interface AutoScrollOptions {
	/**
	 *  Enable the plugin. Can be `HTMLElement`.
	 */
	scroll?: boolean | HTMLElement
	/**
	 * if you have custom scrollbar scrollFn may be used for autoscrolling.
	 */
	scrollFn?: (
		this: Sortable,
		offsetX: number,
		offsetY: number,
		originalEvent: Event,
		touchEvt: TouchEvent,
		hoverTargetEl: HTMLElement
	) => "continue" | void
	/**
	 * `px`, how near the mouse must be to an edge to start scrolling.
	 */
	scrollSensitivity?: number
	/**
	 * `px`, speed of the scrolling.`
	 */
	scrollSpeed?: number
	/**
	 * apply autoscroll to all parent elements, allowing for easier movement.
	 */
	bubbleScroll?: boolean
}

export interface OnSpillOptions {
	/**
	 * This plugin, when enabled,
	 * will cause the dragged item to be reverted to it's original position if it is *spilled*
	 * (ie. it is dropped outside of a valid Sortable drop target)
	 */
	revertOnSpill?: boolean
	/**
	 * This plugin, when enabled,
	 * will cause the dragged item to be removed from the DOM if it is *spilled*
	 * (ie. it is dropped outside of a valid Sortable drop target)
	 */
	removeOnSpill?: boolean
	/**
	 * Called when either `revertOnSpill` or `RemoveOnSpill` plugins are enabled.
	 */
	onSpill?: (evt: SortableEvent) => void
}
export interface MultiDragOptions {
	/**
	 * Enable the plugin
	 */
	multiDrag?: boolean
	/**
	 * Class name for selected item
	 */
	selectedClass?: string
	/**
	 * Key that must be down for items to be selected
	 */
	// todo: create a type
	// todo: check source code for type
	multiDragKey?: null

	/**
	 * Called when an item is selected
	 */
	onSelect?: (event: SortableEvent) => void

	/**
	 * Called when an item is deselected
	 */
	onDeselect?: (event: SortableEvent) => void
}
export interface SwapOptions {
	/**
	 * Enable the Swap plugin
	 * @default false
	 */
	swap: boolean
	/**
	 * Class name for the item to be swapped with, if swap mode is enabled. Defaults to.
	 * @default 'sortable-swap-highlight'
	 */
	swapClass: string
}
