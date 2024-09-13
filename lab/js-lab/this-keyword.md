# Fundamentals

## `this` Keyword

In JavaScript, the behavior of this inside a function can vary based on whether the function is defined as an arrow function or a traditional function.

## Where did it trouble me?

### `this` is bound to the `class` and not to the enclosing object

```js
class MeactElement {
  constructor() {
    this.id = getNewElementId(name);
    this.stateManager =
      type === "MeactComponent"
        ? {
            values: [],
            updateValue: (index, newValue) => {
              console.log("this.values", this.values);
              console.log("this.stateManager.values", this.stateManager.values);
              this.stateManager.values[index] = newValue;
            },
          }
        : null;
  }
```

Console log:
"""
this.values undefined
this.stateManager.values (2) [1, 1]
"""

### `this` is bound to the enclosing object

Whereas, I get this error on the console for this second example:

```js
class MeactElement {
  constructor() {
    this.id = getNewElementId(name);
    this.stateManager =
      type === "MeactComponent"
        ? {
            values: [],
            updateValue(index, newValue) {
              console.log("this.values", this.values);
              console.log("this.stateManager.values", this.stateManager.values);
              this.stateManager.values[index] = newValue;
            },
          }
        : null;
  }
```

Console log:
"""
this.values (2) [1, 1]
Uncaught TypeError: Cannot read properties of undefined (reading 'values')
"""

## Behavior

### Traditional Functions

Traditional functions have their own `this` context, which is determined by how the function is called. 

In my case, the object calling `updateValue` is the `stateManager` object.
Therefore, `this` inside `updateValue` refers to the `stateManager` object, not the `MeactElement` instance.

```js
function traditionalFunction() {
  console.log(this);
}

// As a method
const obj = {
  method: traditionalFunction,
};
obj.method(); // 'this' refers to obj

// As a standalone function
traditionalFunction(); // 'this' refers to global object (window in browsers, global in Node.js) or undefined in strict mode

// Using call or apply
traditionalFunction.call({ x: 10 }); // 'this' refers to {x: 10}
```

### Arrow Functions

Arrow functions do not have their own `this` context. Instead, they inherit `this` from the surrounding lexical scope, which in my case is the instance of `MeactElement`.

```js
const arrowFunction = () => {
  console.log(this);
};

const obj = {
  method: arrowFunction,
};

obj.method(); // 'this' does NOT refer to obj, but to `Window` object in browser's console
```

### Complex Example

In the `traditionalMethod`, the inner function creates a new `this` context. In the `arrowMethod`, the arrow function captures the `this` value from its surrounding scope.

This behavior of arrow functions can be particularly useful in callback scenarios or when you want to preserve the `this` context from the enclosing scope.

```js
const obj = {
  traditionalMethod: function () {
    console.log("TM THIS", this); // refers to obj
    setTimeout(function () {
      console.log("TM CB", this); // refers to global object or undefined in strict mode
    }, 100);
  },

  arrowMethod: () => {
    console.log("AM THIS", this); // refers to global object or undefined in strict mode
    setTimeout(() => {
      console.log("AM CB", this); // still refers to global object or undefined in strict mode
    }, 100);
  },
};

obj.traditionalMethod();
obj.arrowMethod();
```

```
TM THIS {traditionalMethod: ƒ, arrowMethod: ƒ}
AM THIS Window {0: Window, 1: global, 2: Window, window: Window, self: Window, document: document, name: '', location: Location, …}
TM CB Window {0: Window, 1: global, 2: Window, window: Window, self: Window, document: document, name: '', location: Location, …}
AM CB Window {0: Window, 1: global, 2: Window, window: Window, self: Window, document: document, name: '', location: Location, …}
```

## `bind`

Functions provide a built-in method `bind` that allows to fix this.

Method `func.bind(context, ...args)` returns a "bound variant" of function `func` that fixes the context `this` and first arguments if given. Usually we apply `bind` to fix `this` for an object method, so that we can pass it somewhere, e.g. to `setTimeout`.

```js
const module = {
  x: 42,
  getX: function () {
    return this.x;
  },
};

const unboundGetX = module.getX;
console.log(unboundGetX()); // The function gets invoked at the global scope
// Expected output: undefined

const boundGetX = unboundGetX.bind(module);
console.log(boundGetX());
// Expected output: 42
```

When you call `module.getX()`, the value of `this` inside `getX` refers to the `module` object because it's being called as a method of `module`. So when you call `module.getX()`, `this.x` is `42`.

When you are assigning the `getX` function to the variable `unboundGetX`, you've **disconnected** the function from the `module` object. So when you later call `unboundGetX()`, it's no longer called as a method of `module`. Instead, it's invoked in the **global scope**, and `this` now refers to the **global object** (in non-strict mode) or is `undefined` (in strict mode).

When you use `.bind(module)`, you're explicitly setting the value of `this` inside `unboundGetX` to the `module` object. Now, when `boundGetX` is called, `this` is locked to `module`, and `this.x` correctly refers to `module.x`, which is `42`.

