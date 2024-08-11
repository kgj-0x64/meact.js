# JSX

## Fragment

To mimic React.js's `Fragment` using plain JavaScript, we can use a `DocumentFragment` object. A `DocumentFragment` is a lightweight, minimalistic document object that can hold and manipulate a group of nodes.

When we append a `DocumentFragment` to the DOM, its children are appended, but the fragment itself is not, similar to how a React `Fragment` works. That is, just like a React `Fragment`, a `DocumentFragment` doesn’t create an extra node in the DOM tree, and only its child elements are added.

## Why do we need a virtual DOM

In order to do CRUD operations on the browser DOM for target `ReactElement` nodes, we need access to information about parent-children relations with positional info from the rendered browser DOM tree.

- The read-only `parentNode` property of the `Node` interface returns the parent of the specified node in the DOM tree. `Document` and `DocumentFragment` nodes can never have a parent, so `parentNode` will always return `null`. It also returns `null` if the node has just been created and is not yet attached to the tree.

## **Setup Issue**

- I keep forgetting to re-generate the bundle after editing code.

- Note: component's function definitions are not available in the global `window` namespace for them to be called directly during re-rendering, but they are available in the `MdxToJsxBuild` namespace.
