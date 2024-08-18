# Algorithm

The library works by inverting control of executing (invoking) component functions from its users to itself.

## Render Tree

The "Render Tree" is a DOM-like tree data structure created at runtime by this library where every node is an object (a "render object") of `MeactElement` class.

### `MeactElement` Node

Every call to the library's `createElement` function creates an object of `MeactElement` class to contain local data (e.g. state), useful methods to manipulate that state and its "children" `MeactElement` nodes.

The first `createElement` call by the library user creates the root node of this "Render Tree", and further nodes are created by recursively executing `createElement` function calls passed in the `children` argument by the library user.

For a component (i.e. a reusable element), the `createElement` function needs to invoke the corresponding function object (say, function definition) of that component and use the returned `MeactElement` node as a subtree.

### DOM Rendering

"Render Tree" is recursively scanned to create DOM nodes or elements using browser's `document` CRUD APIs.

"Render Tree" nodes of type `HtmlElement` are converted into corresponding DOM elements. And, a DOM node of type `DocumentFragment` is created for "Render Tree" nodes which are neither HTML elements nor `null` values.

### Reconciliation

The "Render Tree" is re-evaluated on a re-render trigger by updating persisted elements in-place and inserting freshly created (mounted) subtrees or deleting unmounted subtrees.

While doing this, I keep a track of changes in the `rerenderDiffForDomHandler` object. Finally, DOM is manipulated using `renderId` on DOM nodes from last render and this DIFF for changed elements and positions only.

## Hooks

Hooks are the library APIs which make the management of a component's local context (that is, data of an object of `MeactElement` class) very convenient for library users (i.e. component's function writers). Hooks are discovered by the library runtime when it is executing a component's function, it needs to remember which component's function it is currently running so that it can update the

### A Global Variable

This was being used until now, and it worked.

I just needed to be careful with the "Closure" while creating the inner `setState` function because the inner function gets a reference in a Closure and not the copy of the variable/reference from the outer scope. So, I needed to explictly make a copy of this global variable in that outer scope (i.e. `useState` function definition scope) to ensure that a change in the global value does not make a `setState` function lose track of its corresponding component object reference.

### Component Call Stack

I am shifting to using this since this could be useful in finding the parent or ancestors of the currently executing component's function for debugging purposes, if not for anything else.

## A Child depends on Ancestors

A component's function definition could depend on its direct parent component's function definition (i.e. its `return` block) for dynamic information which are "explicitly" passed as an object called "props" in the argument by our library users. So, we have already got access to this dynamic object when our `createElement` function is called to build this component.

But there are certain cases (such as the "Context Provider" API provided by our library) where a component's function definition could depend on dynamic information from any of its ancestors while the library design should allow its users to not pass that dynamic information explicitly and it still being accessible via a hook.

### `createElement` Call Stack

I need to ensure that a child component's function must be executed after

A child component's function is always invoked from the `return` block of a parent component's function. So, a child component's function can easily get whatever data it needs from its parent component's function body. But, not really!
