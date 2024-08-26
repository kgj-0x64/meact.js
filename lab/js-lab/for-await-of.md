# Iterables and `for...of` Syntax

Both `for...of` and `for await...of` are syntactic sugar and idiomatic ways of writing loops in JavaScript, designed to simplify the process of iterating over iterable objects and asynchronous iterables.

They provide a clean and concise way to loop through each value yielded by the iterable by removing boilerplate code needed to handle the iteration protocol manually.

## `for...of` Loop

The `for...of` loop is used for iterating over iterable objects such as arrays, strings, maps, sets, and other objects that implement the iterable protocol.

### Example

```javascript
function* syncGenerator() {
  yield "First value";
  yield "Second value";
  yield "Third value";
}

function processSyncGenerator() {
  const iterator = syncGenerator();
  while (true) {
    const { value, done } = iterator.next();
    if (done) break;
    console.log("Processing:", value);
    // Perform asynchronous processing with each value
  }
}

function processSyncGeneratorWithForOfLoop() {
  for (const value of syncGenerator()) {
    console.log("Processing:", value);
    // Perform some synchronous processing with each value
  }
}

async function processSyncGeneratorWithAsyncOps() {
  for (const value of syncGenerator()) {
    await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate async work
    console.log("Processing:", value);
    // Perform asynchronous processing with each value
  }
}
```

## `for await...of`

The `for await...of` loop is used specifically for iterating over asynchronous iterables (like streams of data, async generators, or APIs that provide data over time) that conform to the asynchronous iteration protocol and yield promises or values asynchronously. It simplifies the process of handling asynchronous data streams or async generators, automatically waiting for each promise to resolve before proceeding to the next iteration.

### Example

```javascript
// Simulating an API that sends data in chunks asynchronously

/**
 * Foolowing is an `async` generator function, which means it returns an `async` iterator when called, not a single value or promise.
 * When you call it, you don't get a data chunk directly.
 * Instead, you get an iterator that you need to iterate over to get each piece of data.
 */
async function* asyncGenerator() {
  yield new Promise((resolve) =>
    setTimeout(() => resolve("First async value"), 1000)
  );
  yield new Promise((resolve) =>
    setTimeout(() => resolve("Second async value"), 1000)
  );
  yield new Promise((resolve) =>
    setTimeout(() => resolve("Third async value"), 1000)
  );
}

async function processStream() {
  // ! Following is incorrect because the function returns an iterator, not a promise.
  // const dataChunk = await asyncGenerator();

  const iterator = asyncGenerator();

  while (true) {
    // manually advance the async iterator and retrieve the next chunk of data (wrapped in a { value, done } object)
    const { value: dataChunk, done } = await iterator.next();
    if (done) break;

    console.log("Processing:", dataChunk.message);
    // Perform some processing with each data chunk
  }
}

async function processStreamWithForAwaitOfLoop() {
  /**
   * The `for await...of` loop automatically calls the `.next()` method on the `async` iterator returned by `asyncGenerator()`
   * and awaits the resolution of each promise produced by the generator.
   */
  for await (const dataChunk of asyncGenerator()) {
    console.log("Processing:", dataChunk.message);
    // Perform some processing with each data chunk
  }
}
```
