# Contribution Guidelines

Thank you for considering to contribute. Please follow the guidelines.
If the guidelines are not followed, your issues or requests may be closed or left on hold until the requirements are fulfilled.

---

## Manners and Etiquette 🎩

Please be thoughtful and considerate of others when posting any content within the sortable community. We do this for free, just like you.

Hate speech and non constructive, negatively loaded critisism will be issued with a warnings and potential bans.

---

## Issues ❗

### Submitting an Issue✅✅

We have three broad categories, to which _you should pick the correct template_. Selecting the correct templates help triage issues, allowing us to resolve the issue faster.

We have **enhancements & features**, **bug reports** and **questions**.

> _todo: expand on these_

#### Enhancements & Features➕➕➕➕ ✅➕➕➕➕➕➕

These are additions to functionality that do are not documented.

#### Bugs

These are related to existing functionality that are documented, but not working correctly.

Functionality bugs without a codesandbox or a jsfiddle will be marked as low priority unless a description is made.

#### Questions

When you have a question about how the code works, or you've become stuck on how to do something.

---

## 🚃🚃🚃Pull Requests 🚃🚃📥🌊🌊

All pull requests should close an issue, unless it:

- Fixes a typo in the documentation
- Adds some documentation

### Workflow

We're aware that easy use nature of the library brings in many new programmers seeking to contribute. Please read the section below for how to do it properly.

#### Git and GitHub CLI

Please read the [GitHub Workflow Guide](https://gist.github.com/Chaser324/ce0505fbed06b947d962) for how to handle git when making changes. This is a great guide and once you learn it here, you can take it everywhere.

You can use the [GitHub CLI](https://github.com/cli/cli) to skip a few steps, as it would create the fork, clone it locally and add both origin and upstream branches.

> todo: add some more detailed instructions for the beginners.

---

## Run locally

The entry points are in `packages/sortablejs`, but most of the code is in `packages/sortable`. We've made this separation in preparation for the future.

### Bootstrap

After creating your fork and/or cloning this repository, please bootstrap (initialize) the repository so code can be run and built.

```sh
# install dependencies with yarn
yarn install

# Use the locally downloaded version of lerna
# to install sub package dependencies
yarn lerna bootstrap
```

### Build

Run `yarn build` to build all the files. You should end up with a total of 10 files between the two folders `packages/sortablejs/(dist|modular)`

_**Note:** Please don't use the following files, as they're deprecated and kept only for backwards compatability:_

- Sortable.js
- Sortable.min.js
- modular/\*.js.
