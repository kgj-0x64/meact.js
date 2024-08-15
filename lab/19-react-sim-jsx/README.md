# JSX Syntax

## Transform

React supports JSX syntax through transpilation using tools like Babel or TypeScript. To support JSX syntax in your custom UI library, you'll need to set up a build process that transforms JSX into calls to your `createElement` function.

### Babel

Here's how you can do it:

1. Set up a transpiler:
   You'll need to use a transpiler like Babel to transform JSX syntax into function calls. Babel has a plugin specifically for this purpose.

2. Configure the JSX transform:
   You'll need to tell Babel to use your custom `createElement` function instead of React's.

Here's a step-by-step guide to set this up:

1. Install necessary dependencies:

   ```bash
   npm install --save-dev @babel/core @babel/cli @babel/preset-env @babel/plugin-transform-react-jsx
   ```

2. Create a Babel configuration file (`.babelrc` or `babel.config.js`) in your project root:

   ```json
   {
     "presets": ["@babel/preset-env"],
     "plugins": [
       [
         "@babel/plugin-transform-react-jsx",
         {
           "pragma": "createElement", // Use your function name here
           "pragmaFrag": "'fragment'" // Use your fragment implementation if you have one
         }
       ]
     ]
   }
   ```

3. Update your code to use JSX syntax

4. Set up your build process:
   You'll need to run your code through Babel before executing it. You can do this in several ways:
   - Use Babel CLI directly
   - Integrate with a bundler like webpack or Rollup

For example, using Babel CLI:

```bash
npx babel src --out-dir build
```

This will transpile your JSX files in the `src` directory and output the result to the `build` directory.

Remember, you'll need to ensure that your `createElement` function and other custom hooks (`useState`, `useMemo`, etc.) are in scope where they're used. You might want to create a single entry point that exports all these functions, similar to how React does it.

By following these steps, you should be able to use JSX syntax with your custom UI library. The Babel plugin will transform the JSX into calls to your `createElement` function, allowing you to write more readable and React-like code while still using your own implementation under the hood.
