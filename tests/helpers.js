export async function testSorting(t, dragIndex, targetIndex, from, to, offset = 25, expectChange = true) {
	let targetIndexChange;
	if (from === to) {
		targetIndexChange = dragIndex < targetIndex ? -1 : 1;
	} else {
		targetIndexChange = offset < 25 ? 1 : 0;
	}

	let dragStartPosition = from.child(dragIndex);
	let dragEl = await dragStartPosition();
	let dragEndPosition = to.child(targetIndex + (targetIndexChange === 0 && 1 || 0));
	let targetStartPosition = to.child(targetIndex);
	let target = await dragEndPosition();
	let targetEndPosition = to.child(targetIndex + targetIndexChange);


	await t
		.expect(dragStartPosition.innerText).eql(dragEl.innerText)
		.expect(targetStartPosition.innerText).eql(target.innerText)
		// If in another list: Drag only to the top of the element,
		// so that it is inserted at it's position (because of invert)
		.dragToElement(dragEl, target, { destinationOffsetY: offset })
		.expect(expectChange ? dragEndPosition.innerText : dragStartPosition.innerText).eql(dragEl.innerText)
		.expect(expectChange ? targetEndPosition.innerText : targetStartPosition.innerText).eql(target.innerText);
}
