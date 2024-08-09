# MDX

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
