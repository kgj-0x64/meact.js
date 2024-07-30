# State Change

## Rendering State Diagram

1. Render for the first time

   - Create all element objects (i.e. null, HTML or React element objects) and thus a render tree
   - A React component's state should be initialized in the order of `useState` calls, so we should use an array

2. State update

   - When a state value is updated by calling `setX` function, this React component object's corresponding state value should be updated
   - Importantly, to handle rendering logic which is using this state (e.g. state as a value or conditional rendering logic),
     we need to re-create this component's children by running its function again

3. Rerender

   - Use the updated render tree to repaint the DOM

## Set State

A few important points to keep in mind:

- `useState` function does not take any component ID in its arguments.
- Enforce a constraint that `createElement` must only be called from within a return block so that `useState` and `setState` function calls
  from within that component must be executed before its return block is executed and hence its children elements are created.
- `setState` is a funciton called from some handler in a rendered DOM, so we can access it using a reference ID created on a render.
- While doing DOM manipulation, this updated state value is used to re-evaluate the DOM and rerender it.

## Component Identifier across Rerenders

Q. How do we know that it's the same component across rerenders?

A. The component must meet the following conditions:

1. It should be the same element as last time e.g. Stopwatch, "div", "span" etc.
2. It should be at the same position among siblings as last time (so conditional render must return `null` to not affect a change on positions of following siblings).
3. The above two conditions should hold true for all its ancestors.
