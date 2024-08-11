# Intro to re-renders

> Pitfall: The names of React components (functions returning JSX) must start with a capital letter or they won’t work! For instance, `<section>` is lowercase, so React thinks we refer to an HTML tag.

## Unidirectionally downwards

**When a state update occurs in a React component, it causes that component and all of its child components to re-render. React's rendering is unidirectional, meaning it flows downwards from the point of state update through the tree of components.**

React does not automatically re-render parent components when a child component re-renders. That is, if a state update happens in a child component, it does not trigger a re-render of its parent component or any component higher up in the hierarchy unless explicitly handled.

## Is it possible for a child component to re-render parent components?

_The only way for a component to affect its parent or ancestor components is for them either to explicitly call state update in the ancestor components or to pass components as functions._

### 1. Explicit State Updates

To affect a component higher in the tree from a lower component, you can explicitly update the state of the top component. This can be done by passing functions (callbacks) from the top component down to the child components as props. When these functions are called within the child components, they can update the state in the parent component, which will then trigger a re-render of the parent and potentially other components down the tree. For example:

```jsx
const Parent = () => {
  const [count, setCount] = useState(0);
  return <Child onIncrement={() => setCount(count + 1)} />;
};

const Child = ({ onIncrement }) => {
  return <button onClick={onIncrement}>Increment</button>;
};
```

### 2. Components as Functions

Another way is to pass components as functions (render props or children as functions). This technique allows the child component to control how the parent component behaves or what it renders by passing dynamic content or behavior back up the tree.

For example: When the `Child` component rerenders due to its state change, then it calls the function passed as its `children` prop (`children(value)`), which is defined in the `Parent` component. This function creates a new `div` element with the updated `value`. React detects that the output of the `Parent` component has changed (because the `div` content has changed), so it re-renders the `Parent` component as well.

```jsx
const Parent = () => {
  return (
   <Child>
     {(value) => <div>Value from child: {value}</div>}
   </Child>
  );
};

const Child = ({ children }) => {
  const [value, setValue] = useState(0);
  return (
   <div>
     <button onClick={() => setValue(value + 1)>
       Increment
     </button>
     {children(value)}
   </div>
  );
};
```

> This pattern (known as render props) allows the `Parent` to decide how to use the `value` without needing to manage it. The `Child` component can be reused in different contexts where the `value` might be used differently.
