# Meact.js Design

Meact.js = My (implementation of) React.js

## Implementation (in order)

- [x] Functional Components (i.e. reusable UI elements) built with "Template Literals" and global State & Event Handler Managers

- [x] React-like (`createElement` and `render`) API
- [x] Declarative UI Programming using library's functions
- [x] Render Tree (of `MeactElement` objects as nodes)
  - [x] Render Tree is plotted in browser as well for debugging
- [x] Event Handlers
- [x] `props`
- [x] Children Elements & Components (and `children` as render props)

- [x] `useState` (I needed `closure`!)
- [x] DIFF Reconciliation during Re-rendering

- [x] `useEffect`
- [x] `useRef`
- [x] Custom Hooks

- [x] `useMemo`
  - [x] `useCallback` (redundant after `useMemo`)
- [x] `memo`

- [x] JSX Syntax
- [x] Esbuild Bundler (to manually compile JSX into [`createElement` calls](https://esbuild.github.io/api/#jsx-factory))
- [x] [JSX Fragment](https://esbuild.github.io/api/#jsx-fragment)
- [x] `/jsx-runtime` [Entrypoint API](https://esbuild.github.io/api/#jsx-import-source)
- [x] MDX Support (using [MDXjs compiler](https://mdxjs.com/packages/mdx/))

- [x] Virtual DOM Nodes (i.e. `DocumentFragment` nodes)

- [] Build Automation
- [] Router (server-side)
- [] Tree Shaking (by routes)

### Constraints

- A component must be defined as a named function only, and not as an anonymous function.

  - Why is this okay?: Because anonymous functions as component definitions don't bring any benefits in ergonomics, while an anonymous component function is bound to be recreated on every render (due to a new node ID with the render tree each time) and it could be harder to debug in stack traces or logs as well.

### Optimizations

- DIFF Reconciliation during Re-render: ! TODO

- `useMemo` caches results of expensive calculations or references to arrays/objects/functions so that these result values or references are not recreated across re-renders, are then same values across renders when passed via `props` and are thus not queued as "updates" in the browser DOM by the UI library during a re-render.

  - [React's doc says](https://react.dev/reference/react/useMemo#memoizing-a-function): The only benefit to `useCallback` is that it lets you avoid writing an extra nested function inside. It doesn’t do anything else.

    ```js
    function useCallback(fn, dependencies) {
      return useMemo(() => fn, dependencies);
    }
    ```

- `memo` is a different optimization feature which is used to force stop the evaluation and thus updation of a child subtree (in the "Render Tree") itself when its parent component re-renders given child's `props` are same across renders.

### Interesting Takeaways

- [JSX Spec - "Why not Template Literals?"](https://facebook.github.io/jsx/#sec-why-not-template-literals)

- React uses the order of hooks inside a component's function definition to manage state and side effects.

- [How different frameworks handle the difference between DOM properties and attributes](https://jakearchibald.com/2024/attributes-vs-properties/#how-frameworks-handle-the-difference)

- React Compiler is a new experimental compiler which requires React 19 RC. It automatically memoizes code using [React's rules](https://react.dev/reference/rules). Also, [React Compiler's eslint plugin](https://react.dev/learn/react-compiler#installing-eslint-plugin-react-compiler) can be used independently of the compiler to display any violations of the rules of React in your editor.

## Virtual DOM

### Fragment

To mimic React.js's `Fragment` or to create a DOM node respective to a functional component as a render tree node, we can use a `DocumentFragment` object.

A `DocumentFragment` is a lightweight, minimalistic document object that can hold and manipulate a group of nodes. When we append a `DocumentFragment` to the DOM, its children are appended, but the fragment itself is not (similar to how a React `Fragment` works). That is, just like a React `Fragment`, a `DocumentFragment` doesn’t create an extra node in the DOM tree, and only its child elements are added.

### Why do we need a Virtual DOM

In order to do CRUD operations on the browser DOM for target `MeactElement` nodes, we need access to information about parent-children relations with positional info from the rendered browser DOM tree.

- The read-only `parentNode` property of the `Node` interface returns the parent of the specified node in the DOM tree. `Document` and `DocumentFragment` nodes can never have a parent, so `parentNode` will always return `null`. It also returns `null` if the node has just been created and is not yet attached to the tree.

## Build Tools

### Why do we need a Bundler Tool

- To write JSX synatx which is not natively understood by browsers, we need a transpiler that [transforms JSX](https://esbuild.github.io/api/#jsx) into calls to appropriate library function calls.

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
  - The virtual DOM (an abstraction over different DOM APIs and their quirks) allows React to batch updates and minimize direct manipulation of the real DOM, making the UI faster and more efficient.
  - Memory management (e.g. garbage collection)
