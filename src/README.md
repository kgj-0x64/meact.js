# WHAT's MISSING

Beyond many for-scale things, these necessary ones:

- Great documentation and OSS community
- Local development server and hot reload
- Declarative syntax
- Modern JavaScript/Typescript syntax
- Scoped CSS; CSS-in-JS
- Cross-browser tested API
- Ecosystem of client or async state management, UI components, caching, etc
- Ecosystem of build, bundler and tree-shaking tools
- Concurrent rendering
- Server side rendering
- Performance optimization:
  - React's internal structure (known as the Fiber tree in React's implementation) is quite complex. However, we created a simplified version to illustrate the concept.
  - The virtual DOM allows React to compare (or "diff") the current version of the virtual DOM with the previous version. This comparison identifies the changes needed to update the real DOM, ensuring only the necessary parts are modified.
  - The virtual DOM allows React to batch updates and minimize direct manipulation of the real DOM, making the UI faster and more efficient.

TODO

[] 1. useState, useRef, rerender
[] 2. children are persisted
[] 3. useEffect
[] 4. useCallback, useMemo
[] 5. final app
