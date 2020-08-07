import Sortable from "../src/Sortable.js";
import AutoScroll from "../plugins/AutoScroll";
import { RemoveOnSpill, RevertOnSpill } from "../plugins/OnSpill";
// Extra
import Swap from "../plugins/Swap";
import MultiDrag from "../plugins/MultiDrag";

Sortable.mount(new AutoScroll());
Sortable.mount(RemoveOnSpill, RevertOnSpill);

if (window && !window.Sortable) {
  window.Sortable = Sortable;
}

export default Sortable;

export {
  Sortable,
  // Extra
  Swap,
  MultiDrag,
};
