# State Change

## Set State

A few important points to keep in mind:

- `useState` function does not take any component ID in its arguments
- `setState` is a funciton called from some handler in a rendered DOM, so we can access it using a reference ID created on a render
- While doing DOM manipulation, this updated state value is used to re-evaluate the DOM and rerender it

## Component Identifier across Rerenders

Q. How do we know that it's the same component across rerenders?

A. The component must meet the following conditions:

1. It should be the same element as last time e.g. Stopwatch, "div", "span" etc.
2. It should be at the same position among siblings as last time (so conditional render must return `null` to not affect a change on positions of following siblings).
3. The above two conditions should hold true for all its ancestors.
