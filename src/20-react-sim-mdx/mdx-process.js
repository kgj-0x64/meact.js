import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import compileMDX from "./mdx-compile.js";

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
const outputFile = path.join(outputDir, "mdx-output.js");

// Ensure the directory exists, create it if it doesn't
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true }); // Recursive allows creating nested directories
}

// Read the source MDX file
const mdxFile = "./example.mdx";
const mdxSource = fs.readFileSync(mdxFile, "utf-8");

// Compile the MDX source code into a JavaScript component
compileMDX(mdxSource)
  .then((code) => {
    // Write the compiled code to the output file
    fs.writeFileSync(outputFile, code);
    console.log(`MDX compiled and written to ${outputFile}`);
  })
  .catch((err) => {
    console.error("Error during MDX compilation:", err);
  });
