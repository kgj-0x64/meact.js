import mdx from "@mdx-js/esbuild";
import { build } from "esbuild";
import { existsSync, rmSync } from "fs";
import { join } from "path";
import {
  BUILD_OUTPUT_DIRECTORY,
  APP_DIRECTORY_NAME,
  PAGES_DIRECTORY_NAME,
  STYLES_DIRECTORY_NAME,
  MEACT_LIB_DIRECTORY,
  MEACT_LIB_RENDER_TREE_DIRECTORY,
  MEACT_DOM_LIB_DIRECTORY,
  MEACT_CSR_LIB_DIRECTORY,
  MEACT_CSR_CLIENT_FILE_NAME,
  BUILD_OUTPUT_DIRECTORY_NAME,
} from "./constants/fileAndDirectoryNameAndPaths.js";

const meactLibAlias = {
  // Alias to ensure the path is correctly resolved
  "@meact": join(MEACT_LIB_DIRECTORY, "index.js"),
  "@meact/render-tree": join(MEACT_LIB_RENDER_TREE_DIRECTORY, "index.js"),
  "@meact/jsx-runtime": join(MEACT_LIB_DIRECTORY, "jsx-runtime.js"),
  "@meact-dom": join(MEACT_DOM_LIB_DIRECTORY, "index.js"),
};

const commonClientFacingBuildOptions = {
  format: "esm", // Use IIFE format for direct execution of code in browsers when the script is loaded, without needing a module system
  target: "esnext", // Target modern JavaScript
  write: true, // Write the result to the output file
  bundle: true,
  // https://github.com/evanw/esbuild/blob/main/docs/architecture.md#tree-shaking
  treeShaking: true,
  // https://github.com/evanw/esbuild/blob/main/docs/architecture.md#code-splitting
  splitting: true, // Splitting currently only works with the "esm" format
  sourcemap: !process.env.NODE_ENV === "prod",
  minify: process.env.NODE_ENV === "prod",
  inject: [], // Avoid injecting anything extra
};

const jsxExtension = {
  loader: { ".js": "jsx" }, // To be able to parse JSX syntax
  // https://esbuild.github.io/api/#jsx-import-source
  jsx: "automatic",
  jsxImportSource: "@meact",
};

async function buildScriptBundles() {
  // bundle both of these entrypoint-patterns together
  // so as to get the benefit of code splitting between them as well
  await build({
    entryPoints: [
      `${APP_DIRECTORY_NAME}/${PAGES_DIRECTORY_NAME}/*.js`,
      `${MEACT_CSR_LIB_DIRECTORY}/${MEACT_CSR_CLIENT_FILE_NAME}`,
    ],
    outdir: BUILD_OUTPUT_DIRECTORY_NAME, // outdir is required when code splitting is active
    // globalName: "page", // when format: "iife" - define a global name to access exported values from the compiled script
    ...jsxExtension,
    ...commonClientFacingBuildOptions,
    alias: meactLibAlias,
    plugins: [
      mdx({
        /* MDX compile options */
        jsx: false, // produce code which uses jsx-runtime instead of JSX syntax
        jsxImportSource: "@meact", // Use '@meact/jsx-runtime' for JSX processing
        jsxRuntime: "automatic",
        outputFormat: "program",
        elementAttributeNameCase: "html",
        stylePropertyNameCase: "css",
      }),
    ],
  });
}

async function buildStylesheetBundles() {
  await build({
    entryPoints: [`${APP_DIRECTORY_NAME}/${STYLES_DIRECTORY_NAME}/*.css`],
    outdir: `${BUILD_OUTPUT_DIRECTORY_NAME}/${STYLES_DIRECTORY_NAME}`,
    bundle: true,
    minify: true, // Minifies the output CSS
    loader: { ".css": "css" }, // Ensures CSS files are handled correctly
  });
}

async function initBuild() {
  console.log("Build started...");

  await buildScriptBundles();
  await buildStylesheetBundles();

  console.log("Build completed...");
}

initBuild();

// async function buildServer() {
//   await build({
//     entryPoints: ["index.js"],
//     outdir: BUILD_OUTPUT_DIRECTORY,
//     bundle: true,
//     // use "platform: 'node'" to resolve packages built into Node.js runtime e.g. fs, path etc
//     platform: "node",
//     format: "esm",
//     write: true, // Write the result to the output file
//     splitting: false, // Splitting currently only works with the "esm" format
//     treeShaking: true,
//     sourcemap: false,
//     minify: true,
//   });
// }
