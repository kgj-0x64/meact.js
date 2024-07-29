# Fundamentals

## `this` Keyword

In JavaScript, the behavior of this inside a function can vary based on whether the function is defined as an arrow function or a traditional function.

## Where did it trouble me?

### `this` is bound to the `class` and not to the enclosing object

```js
class ReactElement {
  constructor() {
    this.id = getnewElementId(name);
    this.stateManager =
      type === "ReactComponent"
        ? {
            values: [],
            updateValue: (index, newValue) => {
              console.log("this.values", this.values);
              console.log("this.stateManager.values", this.stateManager.values);
              this.stateManager.values[index] = newValue;
              // TODO: updateSubtreeForElement(this);
            },
          }
        : null;
  }
```

Console log:
"""
this.values undefined
react.js:65 this.stateManager.values (2) [1, 1]
"""

### `this` is bound to the enclosing object

Whereas, I get this error on the console for this second example:

```js
class ReactElement {
  constructor() {
    this.id = getnewElementId(name);
    this.stateManager =
      type === "ReactComponent"
        ? {
            values: [],
            updateValue(index, newValue) {
              console.log("this.values", this.values);
              console.log("this.stateManager.values", this.stateManager.values);
              this.stateManager.values[index] = newValue;
              // TODO: updateSubtreeForElement(this);
            },
          }
        : null;
  }
```

Console log:
"""
this.values (2) [1, 1]
react.js:65 Uncaught TypeError: Cannot read properties of undefined (reading 'values')
at Object.updateValue (example.js:65:73)
"""

## Behavior

### Traditional Functions

Traditional functions have their own `this` context, which is determined by how the function is called. In my case, the object calling `updateValue` is the `stateManager` object.
Therefore, `this` inside `updateValue` refers to the `stateManager` object, not the `ReactElement` instance.

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

Arrow functions do not have their own `this` context. Instead, they inherit `this` from the surrounding lexical scope, which in my case is the instance of `ReactElement`.

```js
const arrowFunction = () => {
  console.log(this);
};

const obj = {
  method: arrowFunction,
};

obj.method(); // 'this' does NOT refer to obj, but to `Window` object in browser's console
```

## Complex Example

In the `traditionalMethod`, the inner function creates a new `this` context. In the `arrowMethod`, the arrow function captures the `this` value from its surrounding scope.

This behavior of arrow functions can be particularly useful in callback scenarios or when you want to preserve the `this` context from the enclosing scope.

```js
const obj = {
  traditionalMethod: function () {
    console.log(this); // refers to obj
    setTimeout(function () {
      console.log(this); // refers to global object or undefined in strict mode
    }, 100);
  },

  arrowMethod: function () {
    console.log(this); // refers to obj
    setTimeout(() => {
      console.log(this); // still refers to obj
    }, 100);
  },
};

obj.traditionalMethod();
obj.arrowMethod();
```
