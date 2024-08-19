# Algorithm

The library works by inverting control of executing (invoking) component functions from its users to itself.

## Render Tree

The "Render Tree" is a DOM-like tree data structure created at runtime by this library where every node is an object (a "render object") of `MeactElement` class.

### `MeactElement` Node

Every call to the library's `createElement` function creates an object of `MeactElement` class to contain local data (e.g. state), useful methods to manipulate that local data and its "children" `MeactElement` nodes.

The first `createElement` call by the library user creates the root node of this "Render Tree", and further nodes are created by recursively executing `createElement` function calls passed in the `children` argument by the library user.

For a component (i.e. a reusable element), the `createElement` function needs to invoke the corresponding function object (say, function definition) of that component and use the returned `MeactElement` node as a subtree.

## How it's designed

### Hooks

Hooks are the library APIs which make the management of a component's local context (that is, data of an object of `MeactElement` class) very convenient for library users (i.e. component's function writers). Hooks are discovered by the library runtime when it is executing a component's function, so it needs to remember which component's function it is currently running.

- I just needed to be careful with the "Closure" while creating the inner `setState` function because the inner function gets a reference in a Closure and not the copy of the variable/reference from the outer scope. So, I needed to explictly make a copy of this global variable in that outer scope (i.e. `useState` function definition scope) to ensure that a change in the global value does not make a `setState` function lose track of its corresponding component object reference.

### A Child depends on Ancestors

A component's function definition could depend on its direct parent component's function definition (i.e. its `return` block) for dynamic information which are "explicitly" passed as an object called "props" in the argument by our library users. So, we have already got access to this dynamic object when our `createElement` function is called to build this component.

But there are certain cases (such as the "Context Provider" API provided by our library) where a component's function definition could depend on dynamic information from any of its ancestors while the library design should allow its users to not pass that dynamic information explicitly and it still being accessible via a hook.

### `createElement` API

A child component's function is always invoked from the `return` block of a parent component's function. So, a child component's function can easily get whatever data it needs from its parent component's function body. Except for the context provider API design where a child subtree gets dynamic data from its parent element from within the same "return" block of an encapsulating parent component's function.

From the library's algorithm perspective, a component's function has two parts: function body where hooks and other logic are defined, and the "return" block where its child subtree via `createElement` call on children elements are defined in a nested manner.

To handle hooks, the library must know which component object (node) does it correspond to. For that, only one component's function must be running at a time and its reference should be accessible for the hook functions.

Doing this much ensures that a child component's function body is not executed before a parent component's function body, and thus the child component's function gets appropriate arguments ("props") in its function call (from within the `createElement` function).

But, this design means that within a component's function's "return" block, a `createElement` call at a nesting level `L+1` is called for evaluation before a `createElement` call at level `<=L`. That means, by the time a component's function's "return" block is done, its "final render subtree" is already evaluated.

The issue is that it doesn't let us enforce the passing of dynamic values (from context providers for example) - from a parent element within the return block to its children elements (and thus its subtrees) declared as "render props" (within the same return block) - without doing one extra full top-down scan afterwards (or worse, multiple top-down scans through subtrees rooted at different `MeactContextProvider` components) (see [that in action here](./lab//23-react-sim-usecontext/meact/hooks/useContext.js)).

So, I am changing the algorithm to create the initial "render tree" by making it top-down where a component's function's "return" block is fully evaluated before proceeding on to call corresponding components' functions from the "locally scoped" child subtree definition. That is, we kind of hijack the simpler recursive call stack. `createElement` is obviously still recursive, but I am limiting its recursion scope to a component function's return block instead of running for the full tree in one go.

- See [`handleComponentFunctionExecution` function](./lab/24-react-sim-refactoring/meact/createElement.js)

! Frustrating part is that I was already doing this top-down scan to handle re-render and reconciliation.

### Reconciliation

A re-render is triggered on a state update which is handled synchronously.

The "Render Tree" is re-evaluated on this re-render trigger by carefully recreating one component at a time while updating persisted elements in-place at their positions and inserting freshly created (mounted) subtrees at appropriate positions or deleting unmounted subtrees from abandoned positions.

Here, the objective was always clear that I must go top-down to prevent an extra full-scan of the created tree afterwards while comparing it with the existing "render tree". I am able to capture a DIFF in a single go while updating persisted elements, creating newly mounted subtrees and deleting unmounted positions.

- See [`updateSubtreeForExistingNode` function](./lab/24-react-sim-refactoring/meact/reconcile.js)

I keep a track of all these update/create/delete changes in the `rerenderDiffForDomHandler` object. Finally, DOM is manipulated using this DIFF for changed elements and positions only.

### DOM Rendering

"Render Tree" is recursively scanned to create DOM nodes or elements using browser's `document` CRUD APIs.

"Render Tree" nodes of type `MeactHtmlElement` are converted into corresponding DOM elements. And, those of types `MeactTextElement` and `NullComponent` are handled by creating a text node and a hidden `div` node respectively. Finally, a DOM node of type `DocumentFragment` is created for "Render Tree" nodes which are neither HTML elements nor `null` values.

- See [`upsertBrowserDomForRerenderDiffItem` function](./lab//24-react-sim-refactoring/meact-dom/upsertDomElement.js)
