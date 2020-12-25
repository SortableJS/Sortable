import Sortable from "../../sortable/src/Sortable";
import Swap from "../../plugins/swap/src";
import MultiDrag from "../../plugins/multi-drag/src";
import AutoScroll from "../../plugins/auto-scroll/src";

import { RemoveOnSpill, RevertOnSpill } from "../../plugins/on-spill/src";

//@ts-ignore
Sortable.mount(new AutoScroll());
Sortable.mount(RemoveOnSpill, RevertOnSpill);

export default Sortable;
export { Sortable, Swap, MultiDrag };
