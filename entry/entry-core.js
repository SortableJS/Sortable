import Sortable from "../src/Sortable.js";
import AutoScroll from "../plugins/AutoScroll";
import OnSpill from "../plugins/OnSpill";
import Swap from "../plugins/Swap";
import MultiDrag from "../plugins/MultiDrag";

if (window & !window.Sortable) {
  window.Sortable = Sortable;
}

export default Sortable;

export {
  Sortable,
  // Default
  AutoScroll,
  OnSpill,
  // Extra
  Swap,
  MultiDrag,
};
