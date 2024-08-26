# Concurrent Async Operations in JavaScript

## `Promise.all`

`Promise.all` **takes an iterable of promises and returns a new promise** that resolves when all input promises have resolved, or rejects if any input promise rejects.

In other words, `Promise.all` is used to execute multiple promises concurrently and wait for all of them to resolve (or for the first one to reject).

```javascript
const urls = [
  "https://api.example.com/data1",
  "https://api.example.com/data2",
  "https://api.example.com/data3",
];

Promise.all(urls.map((url) => fetch(url)))
  .then((responses) => Promise.all(responses.map((res) => res.json())))
  .then((data) => console.log(data))
  .catch((error) => console.error("Error:", error));
```

OR

```javascript
async function fetchData() {
  try {
    const urls = [
      "https://api.example.com/data1",
      "https://api.example.com/data2",
      "https://api.example.com/data3",
    ];

    const responses = await Promise.all(urls.map((url) => fetch(url)));
    const data = await Promise.all(responses.map((res) => res.json()));

    console.log(data);
  } catch (error) {
    console.error("Error:", error);
  }
}

// Call the function
fetchData();
```

### When to use `Promise.all`

When you need to wait for several promises to resolve (or to combine results from them) before proceeding and they can be executed simultaneously (e.g., API calls, file operations), since it waits for all promises to settle and returns an array of results in the same order as the input.

_It is ideal when you don't care about the order of completion and want to get all the data as quickly as possible._

#### Practical Example: Parallel API Calls

Let's fetch user data and their posts concurrently:

```javascript
async function getUserWithPosts(userId) {
  const [user, posts] = await Promise.all([
    fetch(`https://api.example.com/users/${userId}`).then((res) => res.json()),
    fetch(`https://api.example.com/users/${userId}/posts`).then((res) =>
      res.json()
    ),
  ]);

  return { ...user, posts };
}

// Usage
getUserWithPosts(1).then((data) => console.log(data));
```

### Alternatives

- Use `Promise.allSettled` when you need results from all promises, regardless of their settled state.
- Use `Promise.race` when you only need the result of the first resolved promise.

## Concurrency for independent `async` operations

Here's how the code might look with a `for` loop:

```javascript
async function fetchDataSequentially() {
  const urls = [
    "https://api.example.com/data1",
    "https://api.example.com/data2",
    "https://api.example.com/data3",
  ];

  const data = [];
  try {
    for (const url of urls) {
      const response = await fetch(url);
      const json = await response.json();
      data.push(json);
    }
    console.log(data);
  } catch (error) {
    console.error("Error:", error);
  }
}

fetchDataSequentially();
```

Key differences:

1. Sequential vs. Parallel Execution:

   - With `Promise.all`, all fetch requests are initiated concurrently.
   - With a `for` loop, each fetch waits for the previous one to complete before starting.

2. Performance:

   - `Promise.all` is generally faster, especially with multiple independent requests.
   - The `for` loop approach will take approximately the sum of all individual request times.

3. Error Handling:

   - `Promise.all` fails fast: if any promise rejects, the entire operation fails.
   - With a `for` loop, you can handle errors for each request individually.

4. Code Complexity:

   - `Promise.all` can lead to more concise code when dealing with multiple promises.
   - The `for` loop approach might be more intuitive for sequential operations.

5. Result Ordering:

   - `Promise.all` maintains the order of results based on the input array.
   - The `for` loop naturally maintains order as it processes sequentially.

6. Memory Usage:
   - `Promise.all` initiates all requests at once, which might use more memory momentarily.
   - The `for` loop uses less memory as it processes one request at a time.

In your specific example:

- If the API calls are independent, `Promise.all` is more efficient.
- If there are many API calls, `Promise.all` could significantly reduce total execution time.
- If the order of execution matters (e.g., each call depends on the previous one), then a `for` loop would be necessary.

In most cases where you're dealing with independent `async` operations, `Promise.all` is the better choice for performance reasons. However, the `for` loop approach can be more appropriate when you need fine-grained control over each operation or when the operations must be performed in a specific order.

This approach is more efficient than sequential fetches, especially when the API calls are independent.
