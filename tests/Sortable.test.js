import { t, Selector } from 'testcafe';

const itemHeight = 54; // px


async function logErrors() {
	const { errors } = await t.getBrowserConsoleMessages();
	console.log(errors);
}


fixture `Simple Sorting`
	.page `./single-list.html`;

let list1 = Selector('#list1');

test('Sort down list', async browser => {
	const dragStartPosition = list1.child(0);
	const dragEl = await dragStartPosition();
	const dragEndPosition = list1.child(2);
	const target = await dragEndPosition();
	const targetEndPosition = list1.child(1);

	await browser
		.expect(dragStartPosition.innerText).eql(dragEl.innerText)
		.expect(dragEndPosition.innerText).eql(target.innerText)
		.dragToElement(dragEl, target)
		.expect(dragEndPosition.innerText).eql(dragEl.innerText)
		.expect(targetEndPosition.innerText).eql(target.innerText);
});

test('Sort up list', async browser => {
	const dragStartPosition = list1.child(2);
	const dragEl = await dragStartPosition();
	const dragEndPosition = list1.child(0);
	const target = await dragEndPosition();
	const targetEndPosition = list1.child(1);

	await browser
		.expect(dragStartPosition.innerText).eql(dragEl.innerText)
		.expect(dragEndPosition.innerText).eql(target.innerText)
		.dragToElement(dragEl, target)
		.expect(dragEndPosition.innerText).eql(dragEl.innerText)
		.expect(targetEndPosition.innerText).eql(target.innerText);
});

test('Swap threshold', async browser => {
	const dragStartPosition = list1.child(0);
	const dragEl = await dragStartPosition();
	const dragEndPosition = list1.child(1);
	const target = await dragEndPosition();
	const targetEndPosition = list1.child(0);

	await browser.eval(() => {
			Sortable.get(document.getElementById('list1')).option('swapThreshold', 0.6);
		});


	await browser
		.expect(dragStartPosition.innerText).eql(dragEl.innerText)
		.expect(dragEndPosition.innerText).eql(target.innerText)
		.dragToElement(dragEl, target, {
			destinationOffsetY: Math.round(itemHeight / 2 * 0.4 - 1)
		})
		.expect(dragStartPosition.innerText).eql(dragEl.innerText)
		.expect(dragEndPosition.innerText).eql(target.innerText)
		.dragToElement(dragEl, target, {
			destinationOffsetY: Math.round(itemHeight / 2 * 0.4 + 1)
		})
		.expect(dragEndPosition.innerText).eql(dragEl.innerText)
		.expect(targetEndPosition.innerText).eql(target.innerText);
});

test('Invert swap', async browser => {
	const dragStartPosition = list1.child(0);
	const dragEl = await dragStartPosition();
	const dragEndPosition = list1.child(1);
	const target = await dragEndPosition();
	const targetEndPosition = list1.child(0);

	await browser.eval(() => {
			Sortable.get(document.getElementById('list1')).option('invertSwap', true);
		});


	await browser
		.expect(dragStartPosition.innerText).eql(dragEl.innerText)
		.expect(dragEndPosition.innerText).eql(target.innerText)
		.dragToElement(dragEl, target, {
			destinationOffsetY: Math.round(itemHeight / 2 - 1)
		})
		.expect(dragStartPosition.innerText).eql(dragEl.innerText)
		.expect(dragEndPosition.innerText).eql(target.innerText)
		.dragToElement(dragEl, target, {
			destinationOffsetY: Math.round(itemHeight / 2 + 1)
		})
		.expect(dragEndPosition.innerText).eql(dragEl.innerText)
		.expect(targetEndPosition.innerText).eql(target.innerText);
});


test('Inverted swap threshold', async browser => {
	const dragStartPosition = list1.child(0);
	const dragEl = await dragStartPosition();
	const dragEndPosition = list1.child(1);
	const target = await dragEndPosition();
	const targetEndPosition = list1.child(0);

	await browser.eval(() => {
			Sortable.get(document.getElementById('list1')).option('invertSwap', true);
			Sortable.get(document.getElementById('list1')).option('invertedSwapThreshold', 0.2);
		});


	await browser
		.expect(dragStartPosition.innerText).eql(dragEl.innerText)
		.expect(dragEndPosition.innerText).eql(target.innerText)
		.dragToElement(dragEl, target, {
			destinationOffsetY: Math.round(itemHeight - (itemHeight / 2 * 0.2) - 1)
		})
		.expect(dragStartPosition.innerText).eql(dragEl.innerText)
		.expect(dragEndPosition.innerText).eql(target.innerText)
		.dragToElement(dragEl, target, {
			destinationOffsetY: Math.round(itemHeight - (itemHeight / 2 * 0.2) + 1)
		})
		.expect(dragEndPosition.innerText).eql(dragEl.innerText)
		.expect(targetEndPosition.innerText).eql(target.innerText);
});

// TODO: Outside row/col test


fixture `Grouping`
	.page `./dual-list.html`;

let list2 = Selector('#list2');

test('Move to list of the same group', async browser => {
	const dragStartPosition = list1.child(0);
	const dragEl = await dragStartPosition();
	const dragEndPosition = list2.child(0);
	const target = await dragEndPosition();
	const targetEndPosition = list2.child(1);

	await browser.eval(() => {
			Sortable.get(document.getElementById('list2')).option('group', 'shared');
		});

	await browser
		.expect(dragStartPosition.innerText).eql(dragEl.innerText)
		.expect(dragEndPosition.innerText).eql(target.innerText)
		.dragToElement(dragEl, target, { offsetY: 0, destinationOffsetY: 0 })
		.expect(dragEndPosition.innerText).eql(dragEl.innerText)
		.expect(targetEndPosition.innerText).eql(target.innerText);
});


test('Do not move to list of different group', async browser => {
	const dragStartPosition = list1.child(0);
	const dragEl = await dragStartPosition();
	const dragEndPosition = list2.child(0);
	const target = await dragEndPosition();

	await browser.eval(() => {
			Sortable.get(document.getElementById('list2')).option('group', null);
		});

	await browser
		.expect(dragStartPosition.innerText).eql(dragEl.innerText)
		.expect(dragEndPosition.innerText).eql(target.innerText)
		.dragToElement(dragEl, target, { offsetY: 0, destinationOffsetY: 0 })
		.expect(dragStartPosition.innerText).eql(dragEl.innerText)
		.expect(dragEndPosition.innerText).eql(target.innerText);
});


test('Move to list with put:true', async browser => {
	// Should allow insert, since pull defaults to `true`
	const dragStartPosition = list1.child(0);
	const dragEl = await dragStartPosition();
	const dragEndPosition = list2.child(0);
	const target = await dragEndPosition();
	const targetEndPosition = list2.child(1);

	await browser.eval(() => {
			Sortable.get(document.getElementById('list2')).option('group', { put: true });
		});

	await browser
		.expect(dragStartPosition.innerText).eql(dragEl.innerText)
		.expect(dragEndPosition.innerText).eql(target.innerText)
		.dragToElement(dragEl, target, { offsetY: 0, destinationOffsetY: 0 })
		.expect(dragEndPosition.innerText).eql(dragEl.innerText)
		.expect(targetEndPosition.innerText).eql(target.innerText);
});

test('Do not move from list with pull:false', async browser => {
	// Should not allow insert, since put defaults to `false`
	const dragStartPosition = list1.child(0);
	const dragEl = await dragStartPosition();
	const dragEndPosition = list2.child(0);
	const target = await dragEndPosition();
	const targetEndPosition = list2.child(1);

	await browser.eval(() => {
			Sortable.get(document.getElementById('list1')).option('group', { pull: false });
		});

	await browser
		.expect(dragStartPosition.innerText).eql(dragEl.innerText)
		.expect(dragEndPosition.innerText).eql(target.innerText)
		.dragToElement(dragEl, target, { offsetY: 0, destinationOffsetY: 0 })
		.expect(dragStartPosition.innerText).eql(dragEl.innerText)
		.expect(dragEndPosition.innerText).eql(target.innerText);
});


fixture `Handles`
	.page `./handles.html`;

test('Do not allow dragging not using handle', async browser => {
	const dragStartPosition = list1.child(0);
	const dragEl = await dragStartPosition();
	const dragEndPosition = list1.child(1);
	const target = await dragEndPosition();
	const targetEndPosition = list1.child(0);

	await browser
		.expect(dragStartPosition.innerText).eql(dragEl.innerText)
		.expect(dragEndPosition.innerText).eql(target.innerText)
		.dragToElement(dragEl, target)
		.expect(dragStartPosition.innerText).eql(dragEl.innerText)
		.expect(dragEndPosition.innerText).eql(target.innerText);
});


test('Allow dragging using handle', async browser => {
	const dragStartPosition = list1.child(0);
	const dragEl = await dragStartPosition();
	const dragEndPosition = list1.child(1);
	const target = await dragEndPosition();
	const targetEndPosition = list1.child(0);

	await browser
		.expect(dragStartPosition.innerText).eql(dragEl.innerText)
		.expect(dragEndPosition.innerText).eql(target.innerText)
		.dragToElement(await dragStartPosition.child('.handle'), target)
		.expect(dragEndPosition.innerText).eql(dragEl.innerText)
		.expect(targetEndPosition.innerText).eql(target.innerText);
});
