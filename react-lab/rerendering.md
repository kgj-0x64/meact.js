# Intro to re-renders

> Pitfall: The names of React components (functions returning JSX) must start with a capital letter or they won't work! For instance, `<section>` is lowercase, so React thinks we refer to an HTML tag.

## Unidirectionally downwards

**When a state update occurs in a React component, it causes that component and all of its child components to re-render. React's rendering is unidirectional, meaning it flows downwards from the point of state update through the tree of components.**

React does not automatically re-render parent components when a child component re-renders. That is, if a state update happens in a child component, it does not trigger a re-render of its parent component or any component higher up in the hierarchy unless explicitly handled.

## Is it possible for a child component to re-render parent components?

_The only way for a component to affect its parent or ancestor components is for them either to explicitly call state update in the ancestor components._

### Explicit State Updates

To affect a component higher in the tree from a lower component, you can explicitly update the state of the top component. This can be done by passing functions (callbacks) from the top component down to the child components as `props`. When these functions are called within the child components, they can update the state in the parent component, which will then trigger a re-render of the parent and potentially other components down the tree. For example:

```jsx
const Parent = () => {
  const [count, setCount] = useState(0);
  return <Child onIncrement={() => setCount(count + 1)} />;
};

const Child = ({ onIncrement }) => {
  return <button onClick={onIncrement}>Increment</button>;
};
```
