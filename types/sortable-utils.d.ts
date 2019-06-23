export interface SortableUtils {
	/**
	 * Attach an event handler function
	 * @param element an HTMLElement.
	 * @param event an Event context.
	 * @param fn
	 */
	on(element: HTMLElement, event: string, fn: EventListenerOrEventListenerObject): void;

	/**
	 * Remove an event handler function
	 * @param element an HTMLElement.
	 * @param event an Event context.
	 * @param fn a callback.
	 */
	off(element: HTMLElement, event: string, fn: EventListenerOrEventListenerObject): void;

	/**
	 * Get the values of all the CSS properties.
	 * @param element an HTMLElement.
	 */
	css(element: HTMLElement): CSSStyleDeclaration;

	/**
	 * Get the value of style properties.
	 * @param element an HTMLElement.
	 * @param prop a property key.
	 */
	css<K extends keyof CSSStyleDeclaration>(element: HTMLElement, prop: K): CSSStyleDeclaration[K];

	/**
	 * Set one CSS property.
	 * @param element an HTMLElement.
	 * @param prop a property key.
	 * @param value a property value.
	 */
	css<K extends keyof CSSStyleDeclaration>(element: HTMLElement, prop: K, value: CSSStyleDeclaration[K]): void;

	/**
	 * Get elements by tag name.
	 * @param context an HTMLElement.
	 * @param tagName A tag name.
	 * @param iterator An iterator.
	 */
	find(context: HTMLElement, tagName: string, iterator?: (value: HTMLElement, index: number) => void): NodeListOf<HTMLElement>;

	/**
	 * Check the current matched set of elements against a selector.
	 * @param element an HTMLElement.
	 * @param selector an element selector.
	 */
	is(element: HTMLElement, selector: string): boolean;

	/**
	 * For each element in the set, get the first element that matches the selector by testing the element itself and traversing up through its ancestors in the DOM tree.
	 * @param element an HTMLElement.
	 * @param selector an element seletor.
	 * @param context a specific element's context.
	 */
	closest(element: HTMLElement, selector: string, context?: HTMLElement): HTMLElement | null;

	/**
	 * Add or remove one classes from each element
	 * @param element an HTMLElement.
	 * @param name a class name.
	 * @param state a class's state.
	 */
	toggleClass(element: HTMLElement, name: string, state: boolean): void;
}
