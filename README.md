# Meact.js Design

Meact.js = My (implementation of) React.js

## Scope (in order)

- [x] Functional Components with Template String
- [x] Declarative Programming
- [x] React-like API
- [x] Render Tree
- [x] `props`
- [x] `children`
- [x] `useState`
- [x] `useEffect`
- [x] `useRef`
- [x] Custom Hooks
- [x] `useMemo`: caches expensive calculations or references to arrays/objects/functions so that they (their references) are not recreated across re-renders and thus not reflected as "updates" in the browser DOM
- [x] `useCallback` (redundant after `useMemo`)
- [x] `memo`: force stops reredering of a child subtree when a parent rerenders
- [x] DIFF Re-rendering
- [x] JSX Syntax
- [x] Esbuild Bundler (to manually compile JSX)
- [x] JSX Runtime Factory/API
- [x] Virtual DOM Nodes (i.e. `DocumentFragment`)
- [x] MDX Support (manually compiled with Esbuild)
- [] Build Automation

### Constraints

- A component must be defined as a named function only, and not as an anonymous function.

  - Because anonymous functions as component definitions don't bring any benefits in ergonomics, while an anonymous component function is bound to be recreated on every render (due to a new node ID with the render tree each time) and it could be harder to debug in stack traces or logs as well.

## Virtual DOM

### Fragment

To mimic React.js's `Fragment` or to create a DOM node respective to a functional component as a render tree node, we can use a `DocumentFragment` object.

A `DocumentFragment` is a lightweight, minimalistic document object that can hold and manipulate a group of nodes. When we append a `DocumentFragment` to the DOM, its children are appended, but the fragment itself is not (similar to how a React `Fragment` works). That is, just like a React `Fragment`, a `DocumentFragment` doesn’t create an extra node in the DOM tree, and only its child elements are added.

### Why do we need a Virtual DOM

In order to do CRUD operations on the browser DOM for target `ReactElement` nodes, we need access to information about parent-children relations with positional info from the rendered browser DOM tree.

- The read-only `parentNode` property of the `Node` interface returns the parent of the specified node in the DOM tree. `Document` and `DocumentFragment` nodes can never have a parent, so `parentNode` will always return `null`. It also returns `null` if the node has just been created and is not yet attached to the tree.

## Build Tools

### Why do we need a Bundler Tool

- To write JSX synatx which is not natively understood by browsers needs a transpiler that transforms JSX into calls to your `createElement` function.

  - [JSX vs Template Literals](https://facebook.github.io/jsx/#sec-why-not-template-literals)

- To write modern JavaScript which is [not natively understood by older browsers](https://esbuild.github.io/api/#target) needs a transformer.

  - E.g. use of different module systems (e.g., CommonJS, ES modules)

- To package (or bundle) multiple JavaScript files by resolving their dependencies into a single file (or a few files) that can be efficiently loaded by a web browser.

  - [To bundle a file means to inline any imported dependencies into the file itself.](https://esbuild.github.io/api/#bundle) This process is recursive so dependencies of dependencies (and so on) will also be inlined. By default esbuild will not bundle the input files.

### Why do we need a Build Setup

- I keep forgetting to re-generate the bundle after editing code, besides it being a unproductive flow-breaker. So, ["live reload"](https://esbuild.github.io/api/#live-reload) would be much appreciated!

## Out of Scope

### Asynchronous State Updates

meact.js does synchronous state updates instead of batching them and applying them in an asynchronous manner like React.js, and its performance implication ("CPU fan noise") can be observed by running

- `.src/15-react-sim-sync-setstate-performance/index.html` where the UI implements a React Component which renders a colored circle following the mouse position, and another colored circle following first circle's position delayed by 100ms and so on (for total 5-6 circles).

[Why is `setState` in react.js Async instead of Sync?](https://stackoverflow.com/a/48438145/3083243)

ReactJS takes into consideration many variables in the scenario that you're changing the state in, to decide when the state should actually be updated and your component rerendered.

- A simple example to demonstrate this, is that if you call `setState` as a reaction to a user action, then the state will probably be updated immediately (although, again, you can't count on it), so the user won't feel any delay, but if you call `setState` in reaction to an ajax call response or some other event that isn't triggered by the user, then the state might be updated with a slight delay, since the user won't really feel this delay, and it will improve performance by waiting to batch multiple state updates together and rerender the DOM fewer times.

### WHAT's MISSING

Beyond many for-scale things, meact.js doesn't implement these necessary ones (versus react.js)

- Great documentation and OSS community
- Local development server and hot reload
- Devtools and dev/prod environments
- Scoped CSS; CSS-in-JS
- Synthetic events (cross-browser tested API)
- Ecosystem of client or async state management, UI components, caching, etc
- Ecosystem of build, bundler and tree-shaking tools
- Metadata, SEO tuning, robots.txt, sitemap
- Server side rendering
- Concurrent rendering
- Performance optimizations:
  - The virtual DOM allows React to batch updates and minimize direct manipulation of the real DOM, making the UI faster and more efficient.
