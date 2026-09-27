import { Selector } from 'testcafe';

fixture `Authored transforms`.page `./styled-cards.html`;

async function expectOriginalStyles(browser) {
	await browser.wait(400);
	const styles = await browser.eval(() => Array.from(document.querySelectorAll('#list > .card'), el => ({
		id: el.dataset.id,
		transform: el.style.transform,
		transition: el.style.transition,
		matrix: getComputedStyle(el).transform
	})).sort((a, b) => a.id.localeCompare(b.id)));
	const initial = await browser.eval(() => window.initialStyles);
	await browser.expect(styles).eql(initial);
}

test('Animated sorting preserves inline and stylesheet transforms', async browser => {
	await browser.click('#reverse');
	await expectOriginalStyles(browser);
	await browser.expect(Selector('#list > .card').nth(0).getAttribute('data-id')).eql('c');
});

test('Fallback dragging preserves the dragged and displaced cards', async browser => {
	await browser.dragToElement(Selector('[data-id="a"]'), Selector('[data-id="c"]'), { destinationOffsetY: 55 });
	await expectOriginalStyles(browser);
	await browser.expect(Selector('#list > .card').nth(0).getAttribute('data-id')).notEql('a');
});

test.page `./styled-cards.html?native=true` ('Native dragging preserves the dragged and displaced cards', async browser => {
	await browser.dragToElement(Selector('[data-id="a"]'), Selector('[data-id="c"]'), { destinationOffsetY: 55 });
	await expectOriginalStyles(browser);
	await browser.expect(Selector('#list > .card').nth(0).getAttribute('data-id')).notEql('a');
});
