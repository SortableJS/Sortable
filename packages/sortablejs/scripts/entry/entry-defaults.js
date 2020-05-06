import { Sortable } from "../../src/Sortable";
import { AutoScroll } from "@sortablejs/plugin-autoscroll";
import { RemoveOnSpill, RevertOnSpill } from "@sortablejs/plugin-onspill/";
import { Swap } from "@sortablejs/plugin-swap/";
import { MultiDrag } from "@sortablejs/plugin-multidrag/";

Sortable.mount(new AutoScroll());
Sortable.mount(RemoveOnSpill, RevertOnSpill);

export default Sortable;

export {
	Sortable,
	// Extra
	Swap,
	MultiDrag,
};
