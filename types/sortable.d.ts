import { SortableOptions } from './sortable-options';
import { SortablePlugin } from './sortable-plugins';
import { SortableUtils } from './sortable-utils';

export class Sortable {
	options: SortableOptions;
	el: HTMLElement;

	static active: Sortable;
	static utils: SortableUtils;

	constructor(element: HTMLElement, options: SortableOptions);

	/**
	* Creation of new instances.
	* @param element Any variety of HTMLElement.
	* @param options Sortable options object.
	*/
	static create(element: HTMLElement, options: SortableOptions): Sortable;

	/**
	* Mount a plugin.
	* @param plugin A Sortable plugin.
	*/
	static mount(...plugins:  SortablePlugin[]): void;

	/**
	* Options getter/setter
	* @param name a SortableOptions property.
	* @param value a value.
	*/
	option<K extends keyof SortableOptions>(name: K, value: SortableOptions[K]): void;
	option<K extends keyof SortableOptions>(name: K): SortableOptions[K];

	/**
	* For each element in the set, get the first element that matches the selector by testing the element itself and traversing up through its ancestors in the DOM tree.
	* @param element an HTMLElement or selector string.
	* @param selector default: `options.draggable`
	*/
	closest(element: HTMLElement, selector?: string): HTMLElement | null;

	/**
	* Sorts the elements according to the array.
	* @param order an array of strings to sort.
	*/
	sort(order: ReadonlyArray<string>): void;

	/**
	* Saving and restoring of the sort.
	*/
	save(): void;

	/**
	* Removes the sortable functionality completely.
	*/
	destroy(): void;

	/**
	* Serializes the sortable's item data-id's (dataIdAttr option) into an array of string.
	*/
	toArray(): string[];
}
