import { Selector } from 'testcafe';

export default class IndexPage {
    constructor () {
        const listAContainer = Selector('#foo');
        const listAItems     = listAContainer.find('li');

        this.listA = {
            container: listAContainer,
            items:     listAItems,
            getItem:   text => listAItems.withText(text)
        };
    }
}
