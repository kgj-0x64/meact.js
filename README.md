# Meact.js Design

Meact.js = My (implementation of) React.js

## Implementation

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

- [x] `createContext` and `useContext` (! Scope for improvement)

- [x] JSX Syntax
- [x] Esbuild Bundler (to manually compile JSX into [`createElement` calls](https://esbuild.github.io/api/#jsx-factory))
- [x] [JSX Fragment](https://esbuild.github.io/api/#jsx-fragment)
- [x] `/jsx-runtime` [Entrypoint API](https://esbuild.github.io/api/#jsx-import-source)
- [x] MDX Support (using [MDXjs compiler](https://mdxjs.com/packages/mdx/))

- [x] Virtual DOM Nodes (i.e. `DocumentFragment` nodes)

- [x] Multi-Page Application (i.e. Server-side Routing)
- [x] Page-based Router

- [x] Client-Side Rendering (CSR)
- [x] [Tree Shaking](https://github.com/evanw/esbuild/blob/main/docs/architecture.md#tree-shaking) (by routes)
- [x] [Code splitting](https://github.com/evanw/esbuild/blob/main/docs/architecture.md#code-splitting) (chunks shared between routes)

- [x] Meta Tags (Server-side Hydration)
- [x] Server-side Loader Pattern (Remix.js-like)
- [x] Framework's Abstraction

### Constraints

- A component must be defined as a named function only, and not as an anonymous function.

  - Why is this okay?: Because anonymous functions as component definitions don't bring any benefits in ergonomics, while an anonymous component function is bound to be recreated on every render (due to a new node ID with the render tree each time) and it could be harder to debug in stack traces or logs as well.

- `app/index.js` should default export component that should be rendered for a URL/path, and each page component (inside `app/pages/*.js`) should also default export their corresponding function definitions.

### Optimizations

- DIFF Reconciliation: [Reconciliation is the algorithm behind what is popularly understood as the "virtual DOM."](https://github.com/acdlite/react-fiber-architecture) When the application is rendered, a tree of nodes (i.e. the "render tree") that describes the app is generated and saved in memory. The renderer translates the render tree into a set of DOM operations. It's designed such that reconciliation and rendering are separate phases where the reconciler does the work of computing which parts of the tree have changed and the renderer then uses this information about the minimum set of changes required to update the actual DOM so as to update the rendered app. (This is why "virtual DOM" is a bit of a misnomer.)

  - Fancy side note: We could maybe say that the render tree is a more specific implementation that embodies the concept of the virtual DOM. Like, Inversion of Control (IoC) is a design principle (concept) where the control flow of a program is inverted from our custom logic to the framework or runtime and the Spring frmaework (an IoC container) implements that as dependency injection using reflection at runtime.

- `useMemo` caches results of expensive calculations or references to arrays/objects/functions so that these result values or references are not recreated across re-renders, are then same values across renders when passed via `props` and are thus not queued as "updates" in the browser DOM by the UI library during a re-render.

  - [React's doc says](https://react.dev/reference/react/useMemo#memoizing-a-function): The only benefit to `useCallback` is that it lets you avoid writing an extra nested function inside. It doesn’t do anything else.

    ```js
    function useCallback(fn, dependencies) {
      return useMemo(() => fn, dependencies);
    }
    ```

- `memo` is a different optimization feature which is used to force stop the evaluation and thus updation of a child subtree (in the "Render Tree") itself when its parent component re-renders given child's `props` are same across renders.

### Interesting Takeaways

- **In-browser debugging** is just so beautiful, nothing short of IntelliJ!

- [JSX Spec - "Why not Template Literals?"](https://facebook.github.io/jsx/#sec-why-not-template-literals)

- **React uses the order of hooks inside a component's function definition to manage state and side effects.**

- [How different frameworks handle the difference between DOM properties and attributes](https://jakearchibald.com/2024/attributes-vs-properties/#how-frameworks-handle-the-difference)

- A `JSX Runtime` is a set of functions that a compiler (like Babel) uses to transform JSX syntax into JavaScript function calls. In the React ecosystem, these are provided by the "@jsx-runtime/react" package. Instead of just a single `createElement` function, modern JSX runtimes usually define:

  - `Fragment`: A component used to group multiple elements without adding extra nodes to the DOM.
  - `jsx`: For handling JSX elements.
  - `jsxs`: For handling JSX elements with multiple children (used for optimization).
  - `jsxDEV`: A version of jsx with additional development features (like better error messages).

- `DocumentFragment`: To mimic React.js's `Fragment` or to create a DOM node respective to a functional component node from the render tree, we can use a `DocumentFragment` object.

  - A `DocumentFragment` is a lightweight, minimalistic document object that can hold and manipulate a group of nodes. When we append a `DocumentFragment` to the DOM, its children are appended, but the fragment itself is not (similar to how a React `Fragment` works). That is, just like a React `Fragment`, a `DocumentFragment` doesn’t create an extra node in the DOM tree, and only its child elements are added. But, `Document` and `DocumentFragment` nodes can never have a parent, so `parentNode` will always return `null`.

- **React Compiler is a new experimental compiler which requires React 19 RC. It automatically memoizes code using** [**React's rules**](https://react.dev/reference/rules). Also, [React Compiler's eslint plugin](https://react.dev/learn/react-compiler#installing-eslint-plugin-react-compiler) can be used independently of the compiler to display any violations of the rules of React in your editor.

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

- When you import a script via a `<script>` tag, the code is expected to be directly executable in the browser without any additional environment.

  - `require()` is a Node.js module system function, and it's not supported in browsers.

  - ES Modules (ESM) are a standardized module system in JavaScript. They use `import` and `export` statements and are supported by modern browsers. However, for the browser to recognize and correctly parse a JavaScript file that uses ES Modules, you need to indicate this with the `type="module"` attribute in the `<script>` tag. But, `type="module"` causes following issue which can be solved using a server.

    ```text
    Access to script at '.../components.js' from origin "null" has been blocked by CORS policy: Cross origin requests are only supported for protocol schemes: http, data, isolated-app, chrome-extension, chrome, https, chrome-untrusted.
    ```

  - By using format: "iife", you ensure that the output is wrapped in an Immediately Invoked Function Expression, which allows it to run directly in the browser.

## Out of Scope

### [Scheduling Updates](https://github.com/acdlite/react-fiber-architecture?tab=readme-ov-file#scheduling)

meact.js does synchronous state updates instead of batching them and applying them in an asynchronous manner like React.js, and its performance implication ("CPU fan noise") can be observed by running `./lab/15-react-sim-sync-setstate-performance/index.html` where the UI implements a React Component which renders a colored circle following the mouse position, and another colored circle following first circle's position delayed by 100ms and so on (for total 5-6 circles).

[Why is `setState` in react.js Async instead of Sync?](https://github.com/acdlite/react-fiber-architecture?tab=readme-ov-file#scheduling)

1. In a UI, it's not necessary for every update to be applied immediately; in fact, doing so can be wasteful, causing frames to drop and degrading the user experience.
2. Different types of updates have different priorities — an animation update needs to complete more quickly than, say, an update from a data store.
3. A push-based approach requires the app (you, the programmer) to decide how to schedule work. A pull-based approach allows the framework (React) to be smart and make those decisions for you.
   React doesn't currently take advantage of scheduling in a significant way; an update results in the entire subtree being re-rendered immediately. Overhauling React's core algorithm to take advantage of scheduling is the driving idea behind Fiber.

- A [simple example to demonstrate this](https://stackoverflow.com/a/48438145/3083243), is that if you call `setState` as a reaction to a user action, then the state will probably be updated immediately (although, again, you can't count on it), so the user won't feel any delay, but if you call `setState` in reaction to an ajax call response or some other event that isn't triggered by the user, then the state might be updated with a slight delay, since the user won't really feel this delay, and it will improve performance by waiting to batch multiple state updates together and rerender the DOM fewer times.

### WHAT's MISSING

Beyond many for-scale things, meact.js doesn't implement these necessary ones (versus react.js)

- Great documentation, extensive testing and OSS community
- Dev tools and Hot Reload in dev environment
- Scoped CSS; CSS-in-JS
- Synthetic events and Cross-browser API for setting DOM node attributes and properties
- Ecosystem of libraries and frameworks (e.g. Astro, Next.js, client or async state management, UI components, caching, etc)
- Metadata, SEO tuning, robots.txt, sitemap
- Server side rendering
- Concurrent rendering
- Performance optimizations:
  - Scheduling of state updates
  - Memory management (e.g. garbage collection)
  - Compiler like Svelte/Solid (under development)
