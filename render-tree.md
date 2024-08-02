# Composition of React Components

## [UI as a tree](https://react.dev/learn/understanding-your-ui-as-a-tree)

In a React app, every piece of UI is a component (a reusable UI element) combining your markup, CSS, and JavaScript.

React components are regular JavaScript functions that return JSX markup. Just like with HTML tags, you can compose, order and nest components to design whole pages.

### Render Tree

**We can model the nested relationship between React components across a single render in a tree, known as the render tree.**

_A render tree represents a single render pass of a React application._ For instance, with conditional rendering, a parent component may render different children depending on the data passed.

Render trees help identify what the top-level and leaf components are. Top-level components affect the rendering performance of all components beneath them and leaf components are often re-rendered frequently. Identifying them is useful for understanding and debugging rendering performance.

### Module dependency tree

Dependency trees represent the module dependencies in a React app.

When building a React app for production, there is typically a build step that will bundle all the necessary JavaScript to ship to the client. The tool responsible for this is called a bundler, and bundlers will use the dependency tree to determine what modules should be included.

Dependency trees are useful for debugging large bundle sizes that slow time to paint and expose opportunities for optimizing what code is bundled.

## Preserving and resetting state

In React, each component on the screen has fully isolated state. When you give a component state, [you might think the state “lives” inside the component. But the state is actually held inside React](https://react.dev/learn/preserving-and-resetting-state).

React associates each piece of state it’s holding with the correct component by where that component sits in the render tree.

**As a rule of thumb, if you want to preserve the state between re-renders, the structure of your tree needs to “match up” from one render to another. If the structure is different, the state gets destroyed because React destroys state when it removes a component from the tree.**

- React will keep the state around for as long as you render the same component at the same position in the tree.
- When React removes a component, it destroys its state and that of the whole tree below it. That is, when you render a different component in the same position, it resets the state of its entire subtree.

### [Never nest component definitions](https://react.dev/learn/your-first-component#nesting-and-organizing-components)

Components are regular JavaScript functions, so you can keep multiple components in the same file. This is convenient when components are relatively small or tightly related to each other.

But you must never nest their definitions. Even when a child component needs some data from a parent, pass it by props instead of nesting definitions.

For example:

```jsx
export default function Gallery() {
  // 🔴 Never define a component inside another component!
  function Profile() {
    // ...
  }
  // ...
}
```

The snippet above is [very slow and causes bugs](https://react.dev/learn/preserving-and-resetting-state#different-components-at-the-same-position-reset-state).

Instead, define every component at the top level:

```jsx
export default function Gallery() {
  // ...
}

// ✅ Declare components at the top level
function Profile() {
  // ...
}
```
