# Fundamentals

## Closure

### What is a Closure?

In simple terms, a closure is a function that remembers the variables from the place where it was created, even after that place is gone.

### Example of a Closure

Let's look at a simple example:

```javascript
function makeCounter() {
  let count = 0;

  return function () {
    count++;
    return count;
  };
}

const counter = makeCounter();
console.log(counter()); // 1
console.log(counter()); // 2
console.log(counter()); // 3
```

In this example, `makeCounter` creates a function that keeps track of the `count` variable. Even after `makeCounter` has finished running, the returned function still has access to `count`.

## Where did it trouble me?

### Closures capture variables by reference, not by value

This means that when a closure is created, it remembers the variable itself, not the value it had at that time. If the variable changes later, the closure sees the new value.

In `.\10-react-sim-rerender\react.js`, see the intersting behavior of `setStateValue` inside `useState` function.

If we were directly using the global reference variable `reactComponentForHooks` inside the inner function `setStateValue`, then:

> Due to closure, the `setStateValue` function captures a reference to the variable `reactComponentForHooks` and not its value.
>
> That is, at the time `setStateValue` is defined, `setStateValue` holds a reference to the `reactComponentForHooks` variable itself, not just its value at the time `setStateValue` is defined.
>
> Therefore, any updates to the `reactComponentForHooks` variable after `setStateValue` is defined will be reflected when `setStateValue` is called.

My solution is:

1. to simply create a copy of the global reference avriable inside the lexical scope of `useState` function and not change it, or
2. use a different global variable like a stack (array of references)

> Simply doing `const reactComponentForThisHook = reactComponentForHooks;` and using `reactComponentForThisHook` inside the defintioon of the inner function `setStateValue` solves the issue because:
>
> Copying an object reference variable creates one more reference to the same object.
> So, this local variable is assigned the value of global reference variable `reactComponentForHooks` at the time `useState` is called.
>
> Now, this inner function `setStateValue` captures `reactComponentForThisHook` by reference,
> which is local to and constant in the scope of `useState` function.
>
> So, it will always refer to the same `MeactElement` object within a specific `useState` call's context.

## Complex Example

Consider this example:

```javascript
function createFunctions() {
  const functions = [];

  for (var i = 0; i < 3; i++) {
    functions.push(function () {
      console.log(i);
    });
  }

  return functions;
}

const funcs = createFunctions();
funcs[0](); // 3
funcs[1](); // 3
funcs[2](); // 3
```

Here, we might expect to see `0`, `1`, and `2`. But instead, all functions log `3`. This happens because `i` is captured by reference, and by the time the functions are called, the loop has finished, and `i` is `3`.

### How to Avoid This Pitfall

To fix this, we can use `let` instead of `var`. `let` creates a new variable for each iteration of the loop:

```javascript
function createFunctions() {
  const functions = [];

  for (let i = 0; i < 3; i++) {
    functions.push(function () {
      console.log(i);
    });
  }

  return functions;
}

const funcs = createFunctions();
funcs[0](); // 0
funcs[1](); // 1
funcs[2](); // 2
```

Another way to fix it is by using an immediately-invoked function expression (IIFE):

```javascript
function createFunctions() {
  const functions = [];

  for (var i = 0; i < 3; i++) {
    (function (i) {
      functions.push(function () {
        console.log(i);
      });
    })(i);
  }

  return functions;
}

const funcs = createFunctions();
funcs[0](); // 0
funcs[1](); // 1
funcs[2](); // 2
```
