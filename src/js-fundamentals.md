# Fundamentals

## Reference Variables in JavaScript

In JavaScript, a reference variable is used to refer to objects and arrays. Unlike primitive data types (such as numbers, strings, and booleans) that are stored directly in the variable, reference variables store a reference (or address) to the location in memory where the object or array is stored.

[One of the fundamental differences of objects versus primitives is that](https://javascript.info/object-copy) **objects are stored and copied "by reference", whereas primitive values**: strings, numbers, booleans, etc – **are always copied "as a whole value"**.

### Storage and Copying

- **Storage**: When an object or array is created in JavaScript, it is allocated a space in memory. The reference variable holds the address to this memory location.
- **Copying**: When you assign a reference variable to another variable, you are copying the reference, not the actual object. This means both variables now point to the same object in memory.

#### Copying

```javascript
let obj1 = { key: "value" };
let obj2 = obj1; // obj2 now holds the reference to the same object as obj1

obj2.key = "newValue";
console.log(obj1.key); // Output: "newValue"
```

In this example, changing `obj2` also changes `obj1` because both are references to the same object.

#### Passing in Functions

When you pass an object or array to a function, you are passing the reference to the object or array, not a copy of it. Therefore, any changes made to the object or array within the function affect the original object or array.

```javascript
function modifyObj(obj) {
  obj.newKey = "newValue";
}

let myObj = { key: "value" };
modifyObj(myObj);
console.log(myObj.newKey); // Output: "newValue"
```

### Immutability

- `const` ensures that the reference variable value is immutable, but the object it references remains mutable. This means you cannot reassign this `const` reference variable to a different object, but you can still modify the properties of the object that the reference points to.
- `Object.freeze()` can be used to make an object immutable, but it only applies to the object's immediate properties. That is, it is a shallow freeze, meaning it does not affect nested objects.
- For deep immutability, a custom deep freeze function is needed to recursively freeze all nested objects.

### Comparison with Java Reference Variables

Java and JavaScript handle reference variables similarly but with some differences in implementation and control:

| **Aspect**                             | **Java**                                                                                                                                                                                                                              | **JavaScript**                                                                                                                                                                                                               |
| -------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Reference and Pointer Control**      | Reference variables in Java are similar to pointers in that they hold the address of an object, but Java does not allow direct manipulation of memory addresses (no pointer arithmetic). This makes references safer and more secure. | Like Java, JavaScript reference variables do not allow pointer arithmetic. References are managed by the JavaScript engine, and developers cannot directly manipulate memory addresses.                                      |
| **Pass-by-Value vs Pass-by-Reference** | In Java, all objects are passed by value, but the value passed is the reference to the object, not the actual object itself.                                                                                                          | In JavaScript, objects and arrays are passed by reference, meaning the reference to the object or array is passed to functions, not a copy of the object or array.                                                           |
| **Immutability**                       | Java has built-in support for immutability through final keyword and immutable classes like `String`. Once created, immutable objects cannot be modified.                                                                             | **JavaScript**: JavaScript does not have built-in immutability for objects and arrays. However, immutability can be enforced using libraries like Immutable.js or by using ES6 features such as `const` and `Object.freeze`. |

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

### Closures capture variables by reference, not by value

This means that when a closure is created, it remembers the variable itself, not the value it had at that time. If the variable changes later, the closure sees the new value.

In `.\10-react-sim-rerender\react.js`, see the intersting behavior of `setStateValue` inside `useState` function.

If we were directly using the global reference variable `reactComponentForHooks` inside the inner function `setStateValue`, then:

> Due to closure, the `setStateValue` function captures a reference to the variable `reactComponentForHooks` and not its value.
>
> That is, at the time `setStateValue` is defined, `setStateValue` holds a reference to the `reactComponentForHooks` variable itself, not just its value at the time `setStateValue` is defined.
>
> Therefore, any updates to the `reactComponentForHooks` variable after `setStateValue` is defined will be reflected when `setStateValue` is called.

The solution is:

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
> So, it will always refer to the same `ReactElement` object within a specific `useState` call's context.

#### Examples

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

#### How to Avoid This Pitfall

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
