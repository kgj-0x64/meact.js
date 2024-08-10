import { compile } from "@mdx-js/mdx";

async function compileMDX(mdxSource) {
  // Compile MDX into JSX code with your custom JSX runtime
  const compiled = await compile(mdxSource, {
    jsx: false, // produce code which uses jsx-runtime instead of JSX syntax
    jsxImportSource: "@meact", // Use 'meact/jsx-runtime' for JSX processing
    jsxRuntime: "automatic",
    outputFormat: "program",
    elementAttributeNameCase: "html",
    stylePropertyNameCase: "css",
  });

  console.log(JSON.stringify(compiled, 2));

  return compiled.value;
}

export default compileMDX;
