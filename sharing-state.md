# Sharing State Between Components

## Lift the state up

Sometimes, _you want the state of two or more components to always change together_. To do it, remove the relevant state from them, **move it to their closest common parent**, and then pass it down to them via props. Finally, pass the event handlers down so that the children can change the parent’s state.

That is, when you want to coordinate two components, move their state to their common parent. [This is known as lifting state up, and it’s one of the most common things you will do writing React code.](https://react.dev/learn/sharing-state-between-components)

## Move the state down

When a parent component is large or complex, re-rendering it frequently can be costly in terms of performance. **If only a small part of the component actually depends on a particular piece of state, it's often beneficial to move that state down to a child component.**

_Moving state down in a React component tree is a common optimization technique to prevent unnecessary re-renders of parent components._

### When?

This approach is particularly useful in scenarios where:

#### 1. Independent sub-components

If a part of your UI is relatively independent and _doesn't need to share its state with siblings or ancestors, it's a good candidate for moving state down_. This encapsulation can lead to more maintainable code and better performance.

#### 2. Frequently updating state

_When a piece of state updates frequently_ (e.g., from user input or real-time data), keeping it in a lower-level component can prevent those updates from triggering re-renders of the entire parent component and its other children.

#### 3. Localized UI interactions

For _UI elements that have self-contained logic and don't affect the rest of the application_ (like a toggle, a local form, or an expandable section), moving the state to control these elements into their own components can be beneficial.

#### 4. Performance bottlenecks:

If you've _identified through profiling that a particular component is causing performance issues due to frequent re-renders_, and those re-renders are caused by state changes that only affect a small part of the component, moving that state down can help.

### Example

```jsx
const ParentComponent = () => {
  const [count, setCount] = useState(0);
  const [username, setUsername] = useState("");

  return (
    <div>
      <h1>Welcome, {username}</h1>
      <input value={username} onChange={(e) => setUsername(e.target.value)} />
      <ExpensiveComponent />
      <button onClick={() => setCount(count + 1)}>Clicked {count} times</button>
    </div>
  );
};
```

can be changed into:

```jsx
const ParentComponent = () => {
  return (
    <div>
      <UserGreeting />
      <ExpensiveComponent />
      <CounterButton />
    </div>
  );
};

const UserGreeting = () => {
  const [username, setUsername] = useState("");
  return (
    <>
      <h1>Welcome, {username}</h1>
      <input value={username} onChange={(e) => setUsername(e.target.value)} />
    </>
  );
};

const CounterButton = () => {
  const [count, setCount] = useState(0);
  return (
    <button onClick={() => setCount(count + 1)}>Clicked {count} times</button>
  );
};
```
