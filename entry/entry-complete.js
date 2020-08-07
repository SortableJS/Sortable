import Sortable from "./entry-defaults.js";
import Swap from "../plugins/Swap";
import MultiDrag from "../plugins/MultiDrag";

if (window && !window.Sortable) {
  window.Sortable = Sortable;
}

Sortable.mount(new Swap());
Sortable.mount(new MultiDrag());

export default Sortable;
