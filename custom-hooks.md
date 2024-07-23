# Chapter 2.1

## Custom Hooks

**React applications are built from components. Components are built from Hooks, whether built-in or custom.**

- You’ll likely often use custom Hooks created by others (e.g. `useQuery` from `@tanstack/react-query` library), but occasionally you might write one yourself!

_Hooks may return arbitrary values._

### What custom hooks? Why?

**Custom hooks in React are a way to reuse stateful logic across different components without duplicating code.**

- _It seems like even though they those components have different visual appearances, you want to reuse the state logic between them._

They are JavaScript functions that utilize React's hooks (like `useState`, `useEffect`, etc.) to encapsulate and manage state and side effects. Hook names must start with `use` followed by a capital letter, like `useState` (built-in) or `useOnlineStatus` (custom).

- This convention guarantees that you can always look at a component and know where its state, Effects, and other React features might “hide”. For example, if you see a `getColor()` function call inside your component, you can be sure that it can’t possibly contain React state inside because its name doesn’t start with `use`. However, a function call like `useOnlineStatus()` will most likely contain calls to other Hooks inside!

### [So, it's like sharing state?](https://react.dev/learn/reusing-logic-with-custom-hooks#custom-hooks-let-you-share-stateful-logic-not-state-itself)

**Custom hooks let you share stateful logic but not state itself**. Each call to a Hook is completely independent from every other call to the same Hook.

For instance: when the `Form` component calls `useFormInput` two times, it works like declaring two separate state variables!

```jsx
function Form() {
  const firstNameProps = useFormInput('Mary');
  const lastNameProps = useFormInput('Poppins');
  // ...
```

### When to Use Custom Hooks

> _Custom hooks are suitable when you need to reuse stateful logic across multiple components or when you want to decouple complex logic from the component's rendering logic. They also promote better code organization and reuse._

You should consider using custom hooks to extract state from a component in the following scenarios:

#### 1. Reusability

When you find yourself needing the same stateful logic across multiple components, _a custom hook can encapsulate this logic in one place and be reused across your application_.

#### 2. Separation of Concerns

Custom hooks help in separating concerns by _decoupling complex logic from the component's rendering logic_, making your components simpler and easier to manage.

> _When you extract logic into custom Hooks, you can hide the gnarly details of how you deal with some external system or a browser API. The code of your components expresses your intent, what you want to do, not the implementation._

#### 3. Testing

Custom hooks can be _easier to test in isolation_ compared to testing stateful logic within components.

### Examples

#### [Encapsulating network connectivity state](https://react.dev/learn/reusing-logic-with-custom-hooks)

Suppose that you want to warn the user if their network connection has accidentally gone off while they were using your app. It seems like you’ll need two things in your component:

1. A piece of state that tracks whether the network is online
2. An Effect that subscribes to the global online and offline events, and updates that state.

Now imagine you also want to use the same logic in a different components. Imagine for a moment that, similar to `useState` and `useEffect`, there was a built-in `useOnlineStatus` Hook. Then all of these components could be simplified and you could remove the duplication between them. Although there is no such built-in Hook, you can write it yourself. Declare a function called `useOnlineStatus` and move all the duplicated code into it from the components you wrote earlier.

_Now your components don’t have as much repetitive logic. More importantly, the code inside them describes what they want to do (use the online status!) rather than how to do it (by subscribing to the browser events)._

#### [`useMutation`](https://tanstack.com/router/latest/docs/framework/react/examples/kitchen-sink-file-based)

```jsx
import * as React from 'react'

export function useMutation<TVariables, TData, TError = Error>(opts: {
  fn: (variables: TVariables) => Promise<TData>
  onSuccess?: (ctx: { data: TData }) => void | Promise<void>
}) {
  const [submittedAt, setSubmittedAt] = React.useState<number | undefined>()
  const [variables, setVariables] = React.useState<TVariables | undefined>()
  const [error, setError] = React.useState<TError | undefined>()
  const [data, setData] = React.useState<TData | undefined>()
  const [status, setStatus] = React.useState<
    'idle' | 'pending' | 'success' | 'error'
  >('idle')

  const mutate = React.useCallback(
    async (variables: TVariables): Promise<TData | undefined> => {
      setStatus('pending')
      setSubmittedAt(Date.now())
      setVariables(variables)
      //
      try {
        const data = await opts.fn(variables)
        await opts.onSuccess?.({ data })
        setStatus('success')
        setError(undefined)
        setData(data)
        return data
      } catch (err: any) {
        setStatus('error')
        setError(err)
      }
    },
    [opts.fn],
  )

  return {
    status,
    variables,
    submittedAt,
    mutate,
    error,
    data,
  }
}
```
