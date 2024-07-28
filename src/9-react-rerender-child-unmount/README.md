# Understanding Conditional Rendering In React.js

## Unmounting of Child Component and its State

Q.  
In React.js, what is the relation of state persistence of child components across rerenders due to a state change in a parent component? I am asking this in the context of conditional rendering where condition is dependent on that state? Explain all scenarios with code snippets

For instance:
`return state ? <ChildComponentA ... /> : <ChildComponentA ... />`
Will ChildComponentA be unmounted and lose its state when parent's state changes?

### Answer

```jsx
return state ? <ChildComponentA ... /> : <ChildComponentA ... />
```

In this case, `ChildComponentA` will not be unmounted and will not lose its state when the parent's state changes. React will see this as the same component type in the same position in the tree, so it will reuse the existing component instance, preserving its internal state.

However, if you add different keys to these components:

```jsx
return state ? <ChildComponentA key="a" ... /> : <ChildComponentA key="b" ... />
```

Then `ChildComponentA` will be unmounted and remounted, losing its internal state, when the parent's state changes.

The key takeaways are:

1. Different component types always cause unmounting and remounting.
2. The same component type with different keys causes unmounting and remounting.
3. The same component type without keys (or with the same key) preserves state across re-renders.

Remember, using keys judiciously can help you control when React should preserve or reset component state during re-renders.

### Example: `child-unmount.html`

Let's break this down and explore different scenarios with code snippets.

1. Same component type, different props (with keys):
   In the first scenario, we have a `ParentComponent` that renders a `ChildComponent` with different props based on a state condition. The key point here is the use of the `key` prop.

   When the `count` in the parent changes, React will unmount the previous `ChildComponent` and mount a new one, even though it's the same component type. This is because the `key` prop changes from "even" to "odd" or vice versa. As a result, the `ChildComponent` will lose its internal state and be re-mounted.

2. Different component types:
   In the second scenario, we're toggling between two different component types (`ComponentA` and `ComponentB`).

   When `showA` changes, React will unmount the current component (either A or B) and mount the other one. This means that each component will lose its state when it's unmounted, and start fresh when it's mounted again.

3. Same component, no key:
   In the third scenario, we're rendering the same component type (`ChildComponent`) without a `key` prop.

   In this case, when the `toggle` state changes in the parent, React will not unmount and remount the `ChildComponent`. Instead, it will reuse the existing component instance, preserving its internal state. This is because React sees it as the same component in the same position in the tree.

## Unmounting of Child Component and its Subtree

Q.  
And when a child component X is unmounted on state change, not only its state is destroyed but the subtree of components rooted at this child component X is also unmounted along with X. Am I correct in assuming that?

### Answer

You're absolutely correct in your assumption. When a component is unmounted, its entire subtree (all of its child components, grandchild components, and so on) is also unmounted. This is a crucial aspect of React's reconciliation process.

Key points to remember:

1. The unmounting process is recursive: when a parent component unmounts, all its children, grandchildren, etc., are unmounted as well.
2. The order of unmounting is from the deepest child to the parent.
3. When components are remounted, new instances are created, meaning all previous state is lost.
4. Effects with cleanup functions (return function in useEffect) are called during the unmounting process, allowing you to clean up any subscriptions, timers, or side effects.

This behavior ensures that React properly cleans up all resources and state associated with a component and its subtree when they're no longer needed. It's an important consideration when designing your component hierarchy and managing state, especially for larger and more complex applications.

### Example: `child-subtree-unmount.html`

In this example, we have a ParentComponent that toggles between ComponentA and ComponentB. ComponentA has a subtree of components:

ComponentA
├── NestedComponentA1
└── NestedComponentA2
└── DeepNestedComponentA

Here's what happens when you toggle the state:

1. Initially (showComponentA = true):

   - ComponentA mounts
   - NestedComponentA1 mounts
   - NestedComponentA2 mounts
   - DeepNestedComponentA mounts

2. After toggling (showComponentA = false):

   - DeepNestedComponentA unmounts
   - NestedComponentA2 unmounts
   - NestedComponentA1 unmounts
   - ComponentA unmounts
   - ComponentB mounts

3. Toggling back (showComponentA = true):
   - ComponentB unmounts
   - ComponentA mounts (new instance)
   - NestedComponentA1 mounts (new instance)
   - NestedComponentA2 mounts (new instance)
   - DeepNestedComponentA mounts (new instance)
