import { Selector } from 'testcafe';
const itemHeight = 54; // px
const leeway = 1;


fixture `Simple Sorting`
	.page `./single-list.html`;

let list1 = Selector('#list1');

test('Sort down list', async browser => {
	const dragStartPosition = list1.child(0);
	const dragEl = await dragStartPosition();
	const dragEndPosition = list1.child(2);
	const targetStartPosition = list1.child(2);
	const target = await targetStartPosition();
	const targetEndPosition = list1.child(1);

	await browser
		.expect(dragStartPosition.innerText).eql(dragEl.innerText)
		.expect(targetStartPosition.innerText).eql(target.innerText)
		.dragToElement(dragEl, target)
		.expect(dragEndPosition.innerText).eql(dragEl.innerText)
		.expect(targetEndPosition.innerText).eql(target.innerText);
});

test('Sort up list', async browser => {
	const dragStartPosition = list1.child(2);
	const dragEl = await dragStartPosition();
	const dragEndPosition = list1.child(0);
	const targetStartPosition = list1.child(0);
	const target = await targetStartPosition();
	const targetEndPosition = list1.child(1);

	await browser
		.expect(dragStartPosition.innerText).eql(dragEl.innerText)
		.expect(targetStartPosition.innerText).eql(target.innerText)
		.dragToElement(dragEl, target)
		.expect(dragEndPosition.innerText).eql(dragEl.innerText)
		.expect(targetEndPosition.innerText).eql(target.innerText);
});

test('Swap threshold', async browser => {
	const dragStartPosition = list1.child(0);
	const dragEl = await dragStartPosition();
	const dragEndPosition = list1.child(1);
	const targetStartPosition = list1.child(1);
	const target = await targetStartPosition();
	const targetEndPosition = list1.child(0);

	await browser.eval(() => {
			Sortable.get(document.getElementById('list1')).option('swapThreshold', 0.6);
		});


	await browser
		.expect(dragStartPosition.innerText).eql(dragEl.innerText)
		.expect(targetStartPosition.innerText).eql(target.innerText)
		.dragToElement(dragEl, target, {
			destinationOffsetY: Math.round(itemHeight / 2 * 0.4 - leeway)
		})
		.expect(dragStartPosition.innerText).eql(dragEl.innerText)
		.expect(targetStartPosition.innerText).eql(target.innerText)
		.dragToElement(dragEl, target, {
			destinationOffsetY: Math.round(itemHeight / 2 * 0.4 + leeway)
		})
		.expect(dragEndPosition.innerText).eql(dragEl.innerText)
		.expect(targetEndPosition.innerText).eql(target.innerText);
});

test('Invert swap', async browser => {
	const dragStartPosition = list1.child(0);
	const dragEl = await dragStartPosition();
	const dragEndPosition = list1.child(1);
	const targetStartPosition = list1.child(1);
	const target = await targetStartPosition();
	const targetEndPosition = list1.child(0);

	await browser.eval(() => {
			Sortable.get(document.getElementById('list1')).option('invertSwap', true);
		});


	await browser
		.expect(dragStartPosition.innerText).eql(dragEl.innerText)
		.expect(targetStartPosition.innerText).eql(target.innerText)
		.dragToElement(dragEl, target, {
			destinationOffsetY: Math.round(itemHeight / 2 - leeway)
		})
		.expect(dragStartPosition.innerText).eql(dragEl.innerText)
		.expect(targetStartPosition.innerText).eql(target.innerText)
		.dragToElement(dragEl, target, {
			destinationOffsetY: Math.round(itemHeight / 2 + leeway)
		})
		.expect(dragEndPosition.innerText).eql(dragEl.innerText)
		.expect(targetEndPosition.innerText).eql(target.innerText);
});


test('Inverted swap threshold', async browser => {
	const dragStartPosition = list1.child(0);
	const dragEl = await dragStartPosition();
	const dragEndPosition = list1.child(1);
	const targetStartPosition = list1.child(1);
	const target = await targetStartPosition();
	const targetEndPosition = list1.child(0);

	await browser.eval(() => {
			Sortable.get(document.getElementById('list1')).option('invertSwap', true);
			Sortable.get(document.getElementById('list1')).option('invertedSwapThreshold', 0.5);
		});


	await browser
		.expect(dragStartPosition.innerText).eql(dragEl.innerText)
		.expect(targetStartPosition.innerText).eql(target.innerText)
		.dragToElement(dragEl, target, {
			destinationOffsetY: Math.round(itemHeight - (itemHeight / 2 * 0.5) - leeway)
		})
		.expect(dragStartPosition.innerText).eql(dragEl.innerText)
		.expect(targetStartPosition.innerText).eql(target.innerText)
		.dragToElement(dragEl, target, {
			destinationOffsetY: Math.round(itemHeight - (itemHeight / 2 * 0.5) + leeway)
		})
		.expect(dragEndPosition.innerText).eql(dragEl.innerText)
		.expect(targetEndPosition.innerText).eql(target.innerText);
});


fixture `Grouping`
	.page `./dual-list.html`;

let list2 = Selector('#list2');

test('Move to list of the same group', async browser => {
	const dragStartPosition = list1.child(0);
	const dragEl = await dragStartPosition();
	const dragEndPosition = list2.child(0);
	const targetStartPosition = list2.child(0);
	const target = await targetStartPosition();
	const targetEndPosition = list2.child(1);

	await browser.eval(() => {
			Sortable.get(document.getElementById('list2')).option('group', 'shared');
		});

	await browser
		.expect(dragStartPosition.innerText).eql(dragEl.innerText)
		.expect(targetStartPosition.innerText).eql(target.innerText)
		.dragToElement(dragEl, target, { offsetY: 0, destinationOffsetY: 0 })
		.expect(dragEndPosition.innerText).eql(dragEl.innerText)
		.expect(targetEndPosition.innerText).eql(target.innerText);
});


test('Do not move to list of different group', async browser => {
	const dragStartPosition = list1.child(0);
	const dragEl = await dragStartPosition();
	const targetStartPosition = list2.child(0);
	const target = await targetStartPosition();

	await browser.eval(() => {
			Sortable.get(document.getElementById('list2')).option('group', null);
		});

	await browser
		.expect(dragStartPosition.innerText).eql(dragEl.innerText)
		.expect(targetStartPosition.innerText).eql(target.innerText)
		.dragToElement(dragEl, target, { offsetY: 0, destinationOffsetY: 0 })
		.expect(dragStartPosition.innerText).eql(dragEl.innerText)
		.expect(targetStartPosition.innerText).eql(target.innerText);
});


test('Move to list with put:true', async browser => {
	// Should allow insert, since pull defaults to `true`
	const dragStartPosition = list1.child(0);
	const dragEl = await dragStartPosition();
	const dragEndPosition = list2.child(0);
	const targetStartPosition = list2.child(0);
	const target = await targetStartPosition();
	const targetEndPosition = list2.child(1);

	await browser.eval(() => {
			Sortable.get(document.getElementById('list2')).option('group', { put: true });
		});

	await browser
		.expect(dragStartPosition.innerText).eql(dragEl.innerText)
		.expect(targetStartPosition.innerText).eql(target.innerText)
		.dragToElement(dragEl, target, { offsetY: 0, destinationOffsetY: 0 })
		.expect(dragEndPosition.innerText).eql(dragEl.innerText)
		.expect(targetEndPosition.innerText).eql(target.innerText);
});

test('Do not move from list with pull:false', async browser => {
	// Should not allow insert, since put defaults to `false`
	const dragStartPosition = list1.child(0);
	const dragEl = await dragStartPosition();
	const targetStartPosition = list2.child(0);
	const target = await targetStartPosition();

	await browser.eval(() => {
			Sortable.get(document.getElementById('list1')).option('group', { pull: false });
		});

	await browser
		.expect(dragStartPosition.innerText).eql(dragEl.innerText)
		.expect(targetStartPosition.innerText).eql(target.innerText)
		.dragToElement(dragEl, target, { offsetY: 0, destinationOffsetY: 0 })
		.expect(dragStartPosition.innerText).eql(dragEl.innerText)
		.expect(targetStartPosition.innerText).eql(target.innerText);
});

test('Clone element if pull:"clone"', async browser => {
	const dragStartPosition = list1.child(0);
	const dragEl = await dragStartPosition();
	const dragEndPosition = list2.child(0);
	const targetStartPosition = list2.child(0);
	const target = await targetStartPosition();
	const targetEndPosition = list2.child(1);

	await browser.eval(() => {
			Sortable.get(document.getElementById('list1')).option('group', { pull: 'clone' });
			Sortable.get(document.getElementById('list2')).option('group', { put: true });
		});

	await browser
		.expect(dragStartPosition.innerText).eql(dragEl.innerText)
		.expect(targetStartPosition.innerText).eql(target.innerText)
		.dragToElement(dragEl, target, { offsetY: 0, destinationOffsetY: 0 })
		.expect(dragStartPosition.innerText).eql(dragEl.innerText) // clone check
		.expect(dragEndPosition.innerText).eql(dragEl.innerText)
		.expect(targetEndPosition.innerText).eql(target.innerText);
});



fixture `Handles`
	.page `./handles.html`;

test('Do not allow dragging not using handle', async browser => {
	const dragStartPosition = list1.child(0);
	const dragEl = await dragStartPosition();
	const targetStartPosition = list1.child(1);
	const target = await targetStartPosition();

	await browser
		.expect(dragStartPosition.innerText).eql(dragEl.innerText)
		.expect(targetStartPosition.innerText).eql(target.innerText)
		.dragToElement(dragEl, target)
		.expect(dragStartPosition.innerText).eql(dragEl.innerText)
		.expect(targetStartPosition.innerText).eql(target.innerText);
});


test('Allow dragging using handle', async browser => {
	const dragStartPosition = list1.child(0);
	const dragEl = await dragStartPosition();
	const dragEndPosition = list1.child(1);
	const targetStartPosition = list1.child(1);
	const target = await targetStartPosition();
	const targetEndPosition = list1.child(0);

	await browser
		.expect(dragStartPosition.innerText).eql(dragEl.innerText)
		.expect(targetStartPosition.innerText).eql(target.innerText)
		.dragToElement(await dragStartPosition.child('.handle'), target)
		.expect(dragEndPosition.innerText).eql(dragEl.innerText)
		.expect(targetEndPosition.innerText).eql(target.innerText);
});

fixture `Filter`
	.page `./filter.html`;

test('Do not allow dragging of filtered element', async browser => {
	const dragStartPosition = list1.child('.filtered');
	const dragEl = await dragStartPosition();
	const targetStartPosition = dragStartPosition.nextSibling(1);
	const target = await targetStartPosition();

	await browser
		.expect(dragStartPosition.innerText).eql(dragEl.innerText)
		.expect(targetStartPosition.innerText).eql(target.innerText)
		.dragToElement(dragEl, target)
		.expect(dragStartPosition.innerText).eql(dragEl.innerText)
		.expect(targetStartPosition.innerText).eql(target.innerText);
});


test('Allow dragging of non-filtered element', async browser => {
	const dragStartPosition = list1.child(':not(.filtered)');
	const dragEl = await dragStartPosition();
	const dragEndPosition = dragStartPosition.nextSibling(1);
	const targetStartPosition = dragStartPosition.nextSibling(1);
	const target = await targetStartPosition();
	const targetEndPosition = dragStartPosition.nextSibling(0);

	await browser
		.expect(dragStartPosition.innerText).eql(dragEl.innerText)
		.expect(targetStartPosition.innerText).eql(target.innerText)
		.dragToElement(dragEl, target)
		.expect(dragEndPosition.innerText).eql(dragEl.innerText)
		.expect(targetEndPosition.innerText).eql(target.innerText);
});



fixture `Nested`
	.page `./nested.html`;

let list1n1 = Selector('.n1');
let list1n2 = Selector('.n2');
let list2n1 = Selector('.n1:nth-of-type(2)');

test('Dragging from level 1 to level 0', async browser => {
	const dragStartPosition = list1n1.child(0);
	const dragEl = await dragStartPosition();
	const dragEndPosition = list1.child(2);
	const targetStartPosition = list1.child(2);
	const target = await targetStartPosition();
	const targetEndPosition = list1.child(3);

	await browser
		.expect(dragStartPosition.innerText).eql(dragEl.innerText)
		.expect(targetStartPosition.innerText).eql(target.innerText)
		.dragToElement(dragEl, target, { destinationOffsetY: 0 })
		.expect(dragEndPosition.innerText).eql(dragEl.innerText)
		.expect(targetEndPosition.innerText).eql(target.innerText);
});


test('Dragging from level 0 to level 2', async browser => {
	const dragStartPosition = list1.child(1);
	const dragEl = await dragStartPosition();
	const dragEndPosition = list1n2.child(2);
	const targetStartPosition = list1n2.child(2);
	const target = await targetStartPosition();
	const targetEndPosition = list1n2.child(3);

	await browser
		.expect(dragStartPosition.innerText).eql(dragEl.innerText)
		.expect(targetStartPosition.innerText).eql(target.innerText)
		.dragToElement(dragEl, target, { destinationOffsetY: 0 })
		.expect(dragEndPosition.innerText).eql(dragEl.innerText)
		.expect(targetEndPosition.innerText).eql(target.innerText);
});


fixture `Empty Insert`
	.page `./empty-list.html`;

test('Insert into empty list if within emptyInsertThreshold', async browser => {
	const threshold = await browser.eval(() => Sortable.get(document.getElementById('list2')).option('emptyInsertThreshold'));
	const dragStartPosition = list1.child(0);
	const dragEl = await dragStartPosition();
	const dragEndPosition = list2.child(0);
	// Must use rects since testcafe won't drag to element that is "not visible"
	const dragRect = dragEl.boundingClientRect;
	const list2Rect = await list2.boundingClientRect;


	await browser
		.expect(dragStartPosition.innerText).eql(dragEl.innerText)
		.drag(dragEl, Math.round(list2Rect.left - dragRect.left) - (threshold - 1), -(threshold - 1), {
			offsetY: 0,
			offsetX: 0
		})
		.expect(dragEndPosition.innerText).eql(dragEl.innerText);
});

test('Do not insert into empty list if outside emptyInsertThreshold', async browser => {
	const threshold = await browser.eval(() => Sortable.get(document.getElementById('list2')).option('emptyInsertThreshold'));
	const dragStartPosition = list1.child(0);
	const dragEl = await dragStartPosition();
	const dragRect = dragEl.boundingClientRect;
	const list2Rect = await list2.boundingClientRect;

	await browser
		.expect(dragStartPosition.innerText).eql(dragEl.innerText)
		.drag(dragEl, Math.round(list2Rect.left - dragRect.left) - (threshold + 1), -(threshold + 1), {
			offsetY: 0,
			offsetX: 0
		})
		.expect(dragStartPosition.innerText).eql(dragEl.innerText);
});
