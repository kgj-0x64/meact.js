# Memoization

## `useCallback`

`useCallback` is a React Hook that lets you cache a function definition between re-renders.

### Where should it be used?

- Caching a function with useCallback is only valuable in a few cases:

1. You pass it as a prop to a component wrapped in `memo`. You want to skip re-rendering if the value hasn’t changed. Memoization lets your component re-render only if dependencies changed.

2. The function you’re passing is later used as a dependency of some Hook. For example, another function wrapped in `useCallback` depends on it, or you depend on this function from `useEffect`.

### Caution

- Note that `useCallback` does not prevent creating the function. You’re always creating a function (and that’s fine!), but React ignores it and gives you back a cached function if nothing changed.

## `usememo`

`useMemo` is a React Hook that lets you cache the result of a calculation between re-renders.

### Versus `useCallback`

[Memoizing functions is common enough that React has a built-in Hook specifically for that. Wrap your functions into `useCallback` instead of `useMemo` to avoid having to write an extra nested function.](https://react.dev/reference/react/useMemo#memoizing-a-function)

- The only benefit to `useCallback` is that it lets you avoid writing an extra nested function inside. It doesn’t do anything else.

If you’re already familiar with `useMemo`, you might find it helpful to think of `useCallback` as this:

```js
// Simplified implementation (inside React)
function useCallback(fn, dependencies) {
  return useMemo(() => fn, dependencies);
}
```

## Examples

### `useMemo` and `useCallback`

```jsx
import { useMemo, useCallback } from "react";

function ProductPage({ productId, referrer }) {
  const product = useData("/product/" + productId);

  const requirements = useMemo(() => {
    // Calls your function and caches its result
    return computeRequirements(product);
  }, [product]);

  const handleSubmit = useCallback(
    (orderDetails) => {
      // Caches your function itself
      post("/product/" + productId + "/buy", {
        referrer,
        orderDetails,
      });
    },
    [productId, referrer]
  );

  return (
    <div className={theme}>
      <ShippingForm requirements={requirements} onSubmit={handleSubmit} />
    </div>
  );
}
```

### `useMemo` and `memo()`

```jsx
import { memo, useState, useMemo } from "react";

export default function MyApp() {
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");

  return (
    <>
      <label>
        Name{": "}
        <input value={name} onChange={(e) => setName(e.target.value)} />
      </label>
      <label>
        Address{": "}
        <input value={address} onChange={(e) => setAddress(e.target.value)} />
      </label>
      <MemoizedGreeting name={name} />
      <UseMemoizedGreeting name={name} />
    </>
  );
}

const UseMemoizedGreeting = ({ name }) => {
  console.log("UseMemoizedGreeting was rendered");
  const Child = useMemo(() => <Greeting name={name} />, [name]);
  return Child;
};

const Greeting = ({ name }) => {
  console.log("Greeting was rendered at", new Date().toLocaleTimeString());
  const [greeting, setGreeting] = useState("Hello");
  return (
    <>
      <h3>
        {greeting}
        {name && ", "}
        {name}!
      </h3>
      <GreetingSelector value={greeting} onChange={setGreeting} />
    </>
  );
};
const MemoizedGreeting = memo(Greeting);

function GreetingSelector({ value, onChange }) {
  return (
    <>
      <label>
        <input
          type="radio"
          checked={value === "Hello"}
          onChange={(e) => onChange("Hello")}
        />
        Regular greeting
      </label>
      <label>
        <input
          type="radio"
          checked={value === "Hello and welcome"}
          onChange={(e) => onChange("Hello and welcome")}
        />
        Enthusiastic greeting
      </label>
    </>
  );
}
```
