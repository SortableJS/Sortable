import Sortable from '../src/Sortable.js';
import Swap from '../plugins/Swap.js';
import MultiDrag from '../plugins/MultiDrag.js';

Sortable.mount(new Swap());
Sortable.mount(new MultiDrag());

export default Sortable;
