# Meact.js

## WHAT's THERE

[x] Functional Components
[x] Declarative programming
[x] react-dom API
[x] `props`
[x] `children`
[x] `useState`
[x] `useEffect`
[x] `useRef`
[] `useCallback`
[] `useMemo`
[x] Custom Hooks

## WHAT's MISSING

For insatnce, meact.js does synchronous state updates instead of batching them and applying them in an asynchronous manner like React.js, and its performance implication ("CPU fan noise") can be observed by running `.src/15-react-sim-sync-setstate-performance/index.html` where the UI does:

- consider a React Component which renders a colored circle following the mouse position, and another colored circle following first circle's position delayed by 100ms and so on (for total 5-6 circles).

### [Why is `setState` in react.js Async instead of Sync?](https://stackoverflow.com/a/48438145/3083243)

> ReactJS takes into consideration many variables in the scenario that you're changing the state in, to decide when the state should actually be updated and your component rerendered.
> A simple example to demonstrate this, is that if you call setState as a reaction to a user action, then the state will probably be updated immediately (although, again, you can't count on it), so the user won't feel any delay, but if you call setState in reaction to an ajax call response or some other event that isn't triggered by the user, then the state might be updated with a slight delay, since the user won't really feel this delay, and it will improve performance by waiting to batch multiple state updates together and rerender the DOM fewer times.

### Beyond many for-scale things, meact.js doesn't implement these necessary ones (versus react.js)

- Great documentation and OSS community
- Even better declarative syntax
- Local development server and hot reload
- Devtools and dev/prod environments
- Scoped CSS; CSS-in-JS
- Cross-browser tested API
- Ecosystem of client or async state management, UI components, caching, etc
- Ecosystem of build, bundler and tree-shaking tools
- Concurrent rendering
- Server side rendering
- Performance optimizations:
  - The virtual DOM allows React to batch updates and minimize direct manipulation of the real DOM, making the UI faster and more efficient.
