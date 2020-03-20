# Contribution Guidelines

### Issue

 1. Try [master](https://github.com/SortableJS/Sortable/tree/master/)-branch, perhaps the problem has been solved;
 2. [Use the search](https://github.com/SortableJS/Sortable/search?type=Issues&q=problem), maybe already have an answer;
 3. If not found, create example on [jsbin.com (draft)](https://jsbin.com/kamiwez/edit?html,js,output) and describe the problem.

---

### Pull Request

 1. Only request to merge with the [master](https://github.com/SortableJS/Sortable/tree/master/)-branch.
 2. Only modify source files, **do not commit the resulting build**

### Setup

 1. Fork the repo on [github](https://github.com)
 2. Clone locally
 3. Run `npm i` in the local repo

### Online one-click setup

You can use Gitpod (a free online VS Code-like IDE) for contributing, With a single click it'll launch a workspace and automatically:

- clone the Sortable repo.
- install the dependencies.
- run `npm run build:umd:watch`.

[![Open in Gitpod](https://gitpod.io/button/open-in-gitpod.svg)](https://gitpod.io/#https://github.com/SortableJS/Sortable/)

### Building

 - For development, build the `./Sortable.js` file using the command `npm run build:umd:watch`
 - To build everything and minify it, run `npm run build`
 - Do not commit the resulting builds in any pull request – they will be generated at release
