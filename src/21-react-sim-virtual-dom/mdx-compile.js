import { compile } from "@mdx-js/mdx";

async function compileMDX(mdxSource) {
  // Compile MDX into JSX code with your custom JSX runtime
  const compiled = await compile(mdxSource, {
    jsx: true, // Enable JSX transformation
    jsxImportSource: "meact", // Use 'meact/jsx-runtime' for JSX processing
  });

  console.log(JSON.stringify(compiled, 2));

  return compiled.value;
}

export default compileMDX;
