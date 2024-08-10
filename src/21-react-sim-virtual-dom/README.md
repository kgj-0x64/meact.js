# JSX

## Fragment

To mimic React.js's `Fragment` using plain JavaScript, you can use a `DocumentFragment` object. A `DocumentFragment` is a lightweight, minimalistic document object that can hold and manipulate a group of nodes.

When you append a `DocumentFragment` to the DOM, its children are appended, but the fragment itself is not, similar to how a React Fragment works. That is, just like a React `Fragment`, a `DocumentFragment` doesn’t create an extra node in the DOM tree, and only its child elements are added.

## Why do we need a virtual DOM

We need to maintain a data structure containing information about parent-children relations with positional info.

Because if we don't add corresponding DOM elements for "ReactComponent" or "Fragment" type render tree nodes, then their children get added to an appropriate DOM element
