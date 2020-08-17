import { Selector } from "testcafe";

fixture`Simple Sorting`.page`../e2e-fixtures/single-list.html`;

let list1 = Selector("#list1");

test("Sort down list", async (browser) => {
  const dragStartPosition = list1.child(0);
  const dragEl = await dragStartPosition();
  const dragEndPosition = list1.child(2);
  const targetStartPosition = list1.child(2);
  const target = await targetStartPosition();
  const targetEndPosition = list1.child(1);

  await browser
    .expect(dragStartPosition.innerText)
    .eql(dragEl.innerText)
    .expect(targetStartPosition.innerText)
    .eql(target.innerText)
    .dragToElement(dragEl, target)
    .expect(dragEndPosition.innerText)
    .eql(dragEl.innerText)
    .expect(targetEndPosition.innerText)
    .eql(target.innerText);
});

test("Sort up list", async (browser) => {
  const dragStartPosition = list1.child(2);
  const dragEl = await dragStartPosition();
  const dragEndPosition = list1.child(0);
  const targetStartPosition = list1.child(0);
  const target = await targetStartPosition();
  const targetEndPosition = list1.child(1);

  await browser
    .expect(dragStartPosition.innerText)
    .eql(dragEl.innerText)
    .expect(targetStartPosition.innerText)
    .eql(target.innerText)
    .dragToElement(dragEl, target)
    .expect(dragEndPosition.innerText)
    .eql(dragEl.innerText)
    .expect(targetEndPosition.innerText)
    .eql(target.innerText);
});
