# JSX

## Fragment

To mimic React.js's `Fragment` using plain JavaScript, you can use a `DocumentFragment` object. A `DocumentFragment` is a lightweight, minimalistic document object that can hold and manipulate a group of nodes.

When you append a `DocumentFragment` to the DOM, its children are appended, but the fragment itself is not, similar to how a React Fragment works. That is, just like a React `Fragment`, a `DocumentFragment` doesn’t create an extra node in the DOM tree, and only its child elements are added.

# MDX

https://www.telerik.com/blogs/asts-markdown-and-mdx

## Steps

### 1. JSX Runtime

A JSX runtime is a set of functions that a compiler (like Babel) uses to transform JSX syntax into JavaScript function calls. Instead of just a single `createElement` function, modern JSX runtimes usually define:

- `jsx`: For handling JSX elements.
- `jsxs`: For handling JSX elements with multiple children (used for optimization).
- `jsxDEV`: A version of jsx with additional development features (like better error messages).
- `Fragment`: A component used to group multiple elements without adding extra nodes to the DOM.

In the React ecosystem, these are provided by the @jsx-runtime/react package. However, since you're building your own UI library (meact.js), you'll need to provide your own implementation of these functions.

Create a `jsx-runtime` definition at `./meact/jsx-runtime.js` which will be used for for JSX processing by the compiler of MDX.js library.

### 2. Compile MDX

mdx-compile.js

mdx-compiled.json contains the output from the compilation step
which is a stringified version of common JSX definition
starting with this comment: `/*@jsxRuntime automatic*/\n/*@jsxImportSource meact*/`

### 3. MDX

mdx-process.js

node mdx-process.js

###

Comment out import/export statements - build-copy

Add all scripts whose functions are being called to index.html
--> node esbuild-config.js generates `build/components.js`

require() is a Node.js module system function, not supported in browsers.
When you import a script via a <script> tag, the code is expected to be directly executable in the browser without any additional environment.

<script type="module" > is required when using ES format
ES Modules (ESM):
ES Modules are a standardized module system in JavaScript. They use import and export statements and are supported by modern browsers.
However, for the browser to recognize and correctly parse a JavaScript file that uses ES Modules, you need to indicate this with the type="module" attribute in the <script> tag.

BUT type="module" causes another ISSUE:
Access to script at 'file:///D:/fundamentals/advanced-react/src/20-react-sim-mdx/build/components.js' from origin 'null' has been blocked by CORS policy: Cross origin requests are only supported for protocol schemes: http, data, isolated-app, chrome-extension, chrome, https, chrome-untrusted.

NOT WORKING

---

When you compile MDX that includes imports from other JSX components, you need to handle those dependencies properly. The issue you’re encountering is that esbuild is including require statements, which are not understood by the browser. Instead, you need to ensure that all imported components are included in the final output in a way that’s compatible with the IIFE format.

Here’s how to adjust the compileMDX function to handle such scenarios:

1. `bundle: true`: This option ensures that all imported modules are included in the final output. It will bundle all dependencies into a single file, so you won't see require statements in the final output.
2. Format as IIFE: By using format: "iife", you ensure that the output is wrapped in an Immediately Invoked Function Expression, which allows it to run directly in the browser.

---

Now I am left with the following error on running compileMDX function:

```
X [ERROR] Could not resolve "./src/components.jsx"

    build/temp.mdx.js:4:26:
      4 │ import {GreetingApp} from "./src/components.jsx";
        ╵                           ~~~~~~~~~~~~~~~~~~~~~~

X [ERROR] Could not resolve "meact/jsx-runtime"

    build/temp.mdx.js:5:30:
      5 │ export const Local = props => <span style={{
```

That is, `temp.mdx.js` is copying import path as it is which eventually leads to error during esbuild's build call.

--> The issue arises because the paths in the temporary temp.mdx.js file are not automatically resolved relative to the project structure when using esbuild. This causes esbuild to fail when trying to resolve imports like ./src/components.jsx and meact/jsx-runtime.

To resolve this issue, you need to do the following:

Resolve Import Paths: Make sure the paths in the temporary file are correct and can be resolved by esbuild.
Provide a jsxImportSource Alias: Make sure meact/jsx-runtime is correctly referenced during the compilation.
