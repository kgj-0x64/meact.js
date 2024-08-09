import { compile } from "@mdx-js/mdx";
import { transform } from "esbuild";

async function compileMDX(mdxSource) {
  // Compile MDX into JSX code with your custom JSX runtime
  const compiled = await compile(mdxSource, {
    jsx: true, // Enable JSX transformation
    jsxImportSource: "meact", // Use 'meact/jsx-runtime' for JSX processing
  });

  console.log(JSON.stringify(compiled, 2));

  // Optional: Transform the compiled JSX into JavaScript for better compatibility
  // Transform the compiled JSX into an IIFE (Immediately Invoked Function Expression)
  // This means the code will run directly when the script is loaded in the browser, without needing a module system.
  const transformed = await transform(compiled.value, {
    loader: "jsx", // Handle JSX syntax
    target: "esnext", // Target modern JavaScript (ESNext)
    format: "iife", // Output format as IIFE for direct execution in browsers
    globalName: "MDXContent", // Define a global name to access the compiled component
  });

  return transformed.code; // Return the final JavaScript code
}

export default compileMDX;
