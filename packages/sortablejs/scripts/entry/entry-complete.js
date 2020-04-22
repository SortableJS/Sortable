import { Sortable } from "./entry-defaults";
import { Swap } from "@sortablejs/plugin-swap/";
import { MultiDrag } from "@sortablejs/plugin-multidrag/";

Sortable.mount(new Swap());
Sortable.mount(new MultiDrag());

export default Sortable;
