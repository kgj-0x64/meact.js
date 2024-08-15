# Declarative UI Composition

## [Browser Window and HTML/CSS Document](https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Client-side_web_APIs/Manipulating_documents)

Following represents the main parts of a browser directly involved in viewing web pages:

1. The navigator represents the state and identity of the browser (i.e. the `user-agent`) as it exists on the web.

   - In JavaScript, this is represented by the `Navigator` object. You can use this object to retrieve things like the user's preferred language, a media stream from the user's webcam, etc.

2. The window is the browser tab that a web page is loaded into; this is represented in JavaScript by the `Window` object.

   - Using methods available on this object you can do things like return the window's size (see `Window.innerWidth` and `Window.innerHeight`), manipulate the document loaded into that window, store data specific to that document on the client-side (for example using a local database or other storage mechanism), attach an event handler to the current window, and more.

3. The document (represented by the DOM in browsers) is the actual page loaded into the window, and is represented in JavaScript by the `Document` object.

   - You can use this object to return and manipulate information on the HTML and CSS that comprises the document, for example get a reference to an element in the DOM, change its text content, apply new styles to it, create new elements and add them to the current element as children, or even delete it altogether.

### DOM

When a user visits a web page, the server returns an HTML file to the browser. The browser then reads the HTML and constructs the Document Object Model (DOM).

[HTML represents the initial page content, whereas the DOM represents the updated page content which was changed by the JavaScript code you wrote.](https://nextjs.org/learn/react-foundations/updating-ui-with-javascript)

### Manipulating DOM

Document Object Model (DOM) is an object representation of the HTML elements. _It is a "tree structure" representation created by the browser that enables the HTML structure to be easily accessed by programming languages_ — for example the browser itself uses it to apply styling and other information to the correct elements as it renders a page, and developers like you can manipulate the DOM with JavaScript after the page has been rendered.

DOM manipulation allows you to not only target specific elements, but also change their style and content. You can use DOM methods and JavaScript, to listen to user events and manipulate the DOM by selecting, adding, updating, and deleting specific elements in the user interface.

#### Simple interactive UI examples

- See [a dynamic shopping list using DOM manipulation](./lab/0-objective/shopping-list.html)
- See [a simple form with input area and submit button using DOM manipulation](./lab/0-objective/form-handler.html)

#### Same examples using React.js

- See [a dynamic shopping list using React.js](./lab/0-objective/shopping-list-react.html)
- See [a simple form with input area and submit button using React.js](./lab/0-objective/form-handler-react.html)

  - React is a JavaScript library for building interactive user interfaces.
  - Babel is a JavaScript compiler​. Browsers don't understand JSX out of the box, so most React users rely on a compiler like Babel or TypeScript to transform JSX code into regular JavaScript.

Updating the DOM with plain JavaScript is very powerful but verbose. With this approach, developers spend a lot of time writing instructions to tell the computer how it should do things. [But wouldn't it be nice to describe what you want to show and let the computer figure out how to update the DOM?](https://nextjs.org/learn/react-foundations/updating-ui-with-javascript)

## Declarative Frameworks

[Declarative programming means describing the UI for each visual state rather than micromanaging the UI (imperative).](https://react.dev/learn/reacting-to-input-with-state)

**Q. Is it technically fair and correct to say that "in a declarative framework like React or Jetpack Compose, the compiler is doing a lot of work that the programmer was required to do in an imperative setup like JQuery or Android with XML views"?**

Yes!

In declarative frameworks, the programmer specifies "what" the UI should look like for a given state, and the framework handles the "how" of updating the UI on your behalf efficiently. This involves complex diffing algorithms, state reconciliation, and re-rendering only what is necessary, which are managed by the compiler or runtime environment of the framework.

In contrast, in an imperative setup, the programmer manually specifies how to update the UI, handling state changes and DOM manipulation directly, often resulting in more boilerplate code and increased potential for errors.

> React provides a declarative way to manipulate the UI. Instead of manipulating individual pieces of the UI directly, you describe the different states that your component can be in, and switch between them in response to the user input. [This is similar to how designers think about the UI.](https://react.dev/learn/reacting-to-input-with-state)

### Comparison

| **Aspect**           | **Imperative Model**                                                                                                         | **Declarative Model**                                                                                                                                                                                                                |
| -------------------- | ---------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| _Approach_           | How to achieve the result (step-by-step instructions)                                                                        | What the UI should look like (declarative syntax)                                                                                                                                                                                    |
| _UI Updates_         | Developers manually manage state and ensure the UI reflects the state changes using manual DOM manipulation or view updates. | Abstracted through state representations. State is managed through framework-provided constructs (e.g., React's state and props, Jetpack Compose's state) and the framework efficiently updates the UI by reconciling state changes. |
| _Event Handling_     | Developers manually add event listeners and handle events to update the UI.                                                  | Event handling often leads to state changes that automatically trigger UI updates.                                                                                                                                                   |
| _Reusability_        | Lower. Reusing code and components can be more cumbersome and require significant boilerplate.                               | Higher. Encourages the creation of reusable components, improving code modularity and reusability.                                                                                                                                   |
| _Debugging_          | Can be complex. Debugging requires tracing through detailed control flow and manual state management.                        | Often simpler. Frameworks provide better tools and abstractions for tracing state and UI updates.                                                                                                                                    |
| _Performance Tuning_ | Manual optimization. Developers need to manually optimize performance, handle DOM updates, and minimize reflows.             | Framework-optimized. The framework often includes built-in optimizations like virtual DOM diffing (React) or efficient recomposition (Jetpack Compose).                                                                              |
| _Examples_           | jQuery, Android with XML views                                                                                               | React, Jetpack Compose                                                                                                                                                                                                               |

### State reconciliation

[You can trigger state updates in response to two kinds of inputs](https://react.dev/learn/reacting-to-input-with-state#step-2-determine-what-triggers-those-state-changes):

1. Human inputs, like clicking a button, typing in a field, navigating a link.
2. Computer inputs, like a network response arriving, a timeout completing, an image loading.

State reconciliation is a core concept that enables declarative frameworks to manage UI updates efficiently and correctly by making the minimal necessary updates to bring the actual UI into alignment with the desired state.

#### **Key Points about State Reconciliation**

1. _Comparison (Diffing)_: The framework compares the current UI representation (e.g., virtual DOM in React) with the new UI representation resulting from the updated state.

2. _Identification of Changes_: The framework identifies which parts of the UI have changed by comparing the old and new representations.

3. _Efficient Updates_: Only the parts of the UI that have changed are updated in the actual UI, minimizing performance costs.

4. _Automatic Process_: This process is managed automatically by the framework, freeing the developer from manual DOM or view manipulation.

5. _Re-rendering_: Only the components or composables that need to reflect state changes are re-rendered or re-composed.

#### Comparison Table: React vs. Jetpack Compose

| Aspect                      | React                                               | Jetpack Compose                                 |
| --------------------------- | --------------------------------------------------- | ----------------------------------------------- |
| _Comparison (Diffing)_      | Uses virtual DOM to compare current and new UI      | Compares current and new tree of composables    |
| _Identification of Changes_ | Diffing algorithm identifies changes in virtual DOM | Identifies changes in the tree of composables   |
| _Efficient Updates_         | Updates only the changed parts of the real DOM      | Re-composes only the changed parts of the UI    |
| _Re-rendering_              | Re-renders only components with state changes       | Re-composes only composables with state changes |
| _Automatic Process_         | Managed by React framework                          | Managed by Jetpack Compose framework            |
