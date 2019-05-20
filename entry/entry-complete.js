import Sortable from './entry-defaults.js';
import Swap from '../plugins/Swap';
import MultiDrag from '../plugins/MultiDrag';

Sortable.mount(new Swap());
Sortable.mount(new MultiDrag());

export default Sortable;
