### Bootstrap

Demo: https://jsbin.com/visimub/edit?html,js,output

```html
<!-- Latest compiled and minified CSS -->
<link
  rel="stylesheet"
  href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.1/css/bootstrap.min.css"
/>

<!-- Latest Sortable -->
<script src="http://SortableJS.github.io/Sortable/Sortable.js"></script>

<!-- Simple List -->
<ul id="simpleList" class="list-group">
  <li class="list-group-item">
    This is <a href="http://SortableJS.github.io/Sortable/">Sortable</a>
  </li>
  <li class="list-group-item">It works with Bootstrap...</li>
  <li class="list-group-item">...out of the box.</li>
  <li class="list-group-item">It has support for touch devices.</li>
  <li class="list-group-item">Just drag some elements around.</li>
</ul>

<script>
  // Simple list
  Sortable.create(simpleList, {
    /* options */
  });
</script>
```
