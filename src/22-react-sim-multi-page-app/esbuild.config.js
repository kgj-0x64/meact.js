import mdx from "@mdx-js/esbuild";
import { build } from "esbuild";
import { readdirSync, existsSync, rmSync } from "fs";
import { join } from "path";
import {
  BUILD_OUTPUT_DIRECTORY,
  APP_DIRECTORY,
  PAGES_DIRECTORY_NAME,
  STYLES_DIRECTORY_NAME,
  GLOBAL_STYLES_FILE_NAME,
  MEACT_LIB_DIRECTORY,
  MEACT_LIB_RENDER_TREE_DIRECTORY,
  MEACT_DOM_LIB_DIRECTORY,
  MEACT_CSR_LIB_DIRECTORY_NAME,
  MEACT_CSR_LIB_DIRECTORY,
  MEACT_CSR_CLIENT_FILE_NAME,
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

async function buildStylesheets() {
  const entryPoint = join(
    APP_DIRECTORY,
    STYLES_DIRECTORY_NAME,
    GLOBAL_STYLES_FILE_NAME
  );
  const outfile = join(
    BUILD_OUTPUT_DIRECTORY,
    STYLES_DIRECTORY_NAME,
    GLOBAL_STYLES_FILE_NAME
  );

  await build({
    entryPoints: [entryPoint],
    outfile,
    bundle: true,
    treeShaking: true,
    minify: true,
  });
}

async function buildPages() {
  const appPagesDirectory = join(APP_DIRECTORY, PAGES_DIRECTORY_NAME);
  const pages = readdirSync(appPagesDirectory).filter((file) =>
    file.endsWith(".js")
  );

  const entryPoints = pages.map((page) =>
    join(APP_DIRECTORY, PAGES_DIRECTORY_NAME, page)
  );
  const buildOutputPagesDirectory = join(
    BUILD_OUTPUT_DIRECTORY,
    PAGES_DIRECTORY_NAME
  );

  await build({
    entryPoints,
    outdir: buildOutputPagesDirectory, // outdir is required when code splitting is active
    globalName: "page", // Define a global name to access exported values from the compiled script
    ...jsxExtension,
    ...commonClientFacingBuildOptions,
    alias: meactLibAlias,
    plugins: [
      mdx({
        /* compile options */
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

async function buildMeactCsrClient() {
  const entryPoint = join(MEACT_CSR_LIB_DIRECTORY, MEACT_CSR_CLIENT_FILE_NAME);
  const outdir = join(BUILD_OUTPUT_DIRECTORY, MEACT_CSR_LIB_DIRECTORY_NAME);

  await build({
    entryPoints: [entryPoint],
    outdir, // outdir is required when code splitting is active
    ...commonClientFacingBuildOptions,
    ...jsxExtension,
    alias: meactLibAlias,
  });
}

async function initBuild() {
  console.log("Build started...");

  // Delete the dist directory if it exists
  if (existsSync(BUILD_OUTPUT_DIRECTORY)) {
    rmSync(BUILD_OUTPUT_DIRECTORY, { recursive: true, force: true });
    console.log(`Deleted ${BUILD_OUTPUT_DIRECTORY}`);
  }

  console.log(`Populating ${BUILD_OUTPUT_DIRECTORY}`);

  await buildPages();
  await buildStylesheets();
  await buildMeactCsrClient();

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
