import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { build } from "esbuild";
import compileMDX from "./mdx-compile.js";

// Compile the MDX source code into a JavaScript component
async function transformMdxIntoJsx(mdxFile) {
  /**
   * ERROR: ReferenceError: __dirname is not defined in ES module scope
   *
   * The error occurs because __dirname is not available in ES module (ESM) syntax,
   * which is the default if you have "type": "module" in your package.json.
   * This is different from CommonJS, where __dirname is readily available.
   */
  // // Define the path where the compiled MDX output will be saved
  // const outputDir = path.resolve(__dirname, "build");
  // const outputFile = path.join(outputDir, "mdx-output.js");

  /**
   * FIX:
   *
   * import.meta.url: This gives the full URL of the current module, including the file:// protocol prefix.
   * fileURLToPath(import.meta.url): Converts the module URL to a file path.
   * path.dirname(__filename): Extracts the directory name from the file path.
   */

  // Get the current file path and directory using import.meta.url
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);

  // Define the path where the compiled MDX output will be saved
  const outputDir = path.resolve(__dirname, "build");

  // Define a temporary file to hold the compiled JSX code
  const tempFilePath = path.resolve(outputDir, "temp.mdx.js");

  const outputFile = path.join(outputDir, "bundle.js");

  // Ensure the directory exists, create it if it doesn't
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true }); // Recursive allows creating nested directories
  }

  // Read the source MDX file
  const mdxSource = fs.readFileSync(mdxFile, "utf-8");

  // get the compiled value using MDX.js library
  const compiledValue = await compileMDX(mdxSource);
  const sanitizedCompiledValue = compiledValue.replaceAll(`\"\\n\",`, "");

  // Write the compiled JSX code to the temporary file
  fs.writeFileSync(tempFilePath, sanitizedCompiledValue);

  // Instead of using transform, which is intended for transforming code without bundling,
  // you should use the build function from esbuild directly to handle both the transformation and bundling in one go.
  await build({
    entryPoints: [tempFilePath], // Entry point is the temporary file
    outfile: outputFile, // Output file
    bundle: true, // Bundle all dependencies into the output
    format: "iife", // Use IIFE format for direct execution of code in browsers when the script is loaded, without needing a module system
    target: "esnext", // Target modern JavaScript
    loader: { ".js": "jsx" }, // To be able to parse JSX syntax
    jsxFactory: "createElement", // JSX factory function
    jsxFragment: "Fragment", // JSX fragment function
    write: true, // Write the result to the output file
    alias: {
      // Alias for meact/jsx-runtime to ensure it's correctly resolved
      "@meact/jsx-runtime": path.resolve(process.cwd(), "meact/jsx-runtime.js"),
      // Alias for any other local paths if needed
      "@src": path.resolve(process.cwd(), "src"),
    },
    globalName: "MdxToJsxBuild", // Define a global name to access exported values from the compiled script
    inject: [], // Avoid injecting anything extra
  });

  // Clean up the temporary file
  // await fs.unlink(tempFilePath);
}

const mdxFile = "./example.mdx";
transformMdxIntoJsx(mdxFile);
