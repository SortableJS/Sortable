# Contribute to SortableJS

## Entry points

todo: fix

All files in `src` are points of entry.

A plugin is either exported or mounted.

The plugins are mounted as follows:

### Core

<table>
  <thead>
    <tr>
      <th align="center" colspan="3">Mounted or Exported</th>
    </tr>
    <tr>
      <th>plugin</th>
      <th align="center">core</th>
      <th align="center">default</th>
      <th align="center">complete</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>AutoScroll</td>
      <td align="center">Exported</td>
      <td align="center">Mounted</td>
      <td align="center">Mounted</td>
    </tr>
    <tr>
      <td>RevertOnSpill</td>
      <td align="center">Exported</td>
      <td align="center">Mounted</td>
      <td align="center">Mounted</td>
    </tr>
    <tr>
      <td>RemoveonSpill</td>
      <td align="center">Exported</td>
      <td align="center">Mounted</td>
      <td align="center">Mounted</td>
    </tr>
    <tr>
      <td>MultiDrag</td>
      <td align="center">Exported</td>
      <td align="center">Exported</td>
      <td align="center">Mounted</td>
    </tr>
    <tr>
      <td>Swap</td>
      <td align="center">Exported</td>
      <td align="center">Exported</td>
      <td align="center">Mounted</td>
    </tr>
  </tbody>
</table>

This may be deprecated in the future, in favour of setting an option in the constructor.
It looks like this was done so bundle sizes could be controlled.
We now have treeshaking when bundling apps with NodeJS, so I feel we should have all plugins mounted via cdn and then no plugins mounted on nodejs imports.
