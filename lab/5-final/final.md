You're asking a great question about how React handles event binding differently from our custom implementation. Let me explain the key differences:

In React, event handling is managed through a system called Synthetic Events. Here's how it works:

1. Event Delegation:
   React doesn't actually attach event listeners to DOM nodes. Instead, it uses a technique called event delegation. React attaches a single event listener to the root of the document for each event type (like 'click', 'change', etc.).

2. Synthetic Event Wrapping:
   When an event occurs, React wraps the native browser event in a SyntheticEvent object. This object has a consistent interface across different browsers, solving cross-browser compatibility issues.

3. JSX and Event Binding:
   In JSX, you pass functions as event handlers, not strings. For example:

   ```jsx
   <button onClick={handleClick}>Click me</button>
   ```

   Here, `handleClick` is a reference to a function, not a string to be evaluated.

4. Lexical Scoping:
   React preserves the lexical scope of the event handler. This means the `this` context and any variables in the component's scope are accessible inside the handler without needing to bind them explicitly.

5. Performance Optimization:
   React's event system is optimized for performance. It uses event pooling to reuse event objects, reducing memory usage.

6. Automatic Cleanup:
   React automatically takes care of cleaning up event listeners when components unmount, preventing memory leaks.

Here's a simple example of how you might handle a click event in React:

```jsx
function MyComponent() {
  const handleClick = (event) => {
    console.log("Button clicked!", event);
  };

  return <button onClick={handleClick}>Click me</button>;
}
```

In this React example:

- The `handleClick` function is defined within the component's scope.
- It's passed directly as a reference to the `onClick` prop.
- React takes care of binding this function to the button's click event.
- When the button is clicked, React will call this function with a synthetic event object.

This approach is more declarative and aligns with React's component-based architecture. It allows for easier reasoning about the code, better performance, and fewer bugs related to event handling.

In contrast, our custom implementation had to manually manage global scope and event binding, which is closer to how you might handle events in vanilla JavaScript. React's abstraction layer removes the need for these manual steps, making event handling more straightforward and less error-prone.
