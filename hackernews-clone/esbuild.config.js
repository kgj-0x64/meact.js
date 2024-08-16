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
  PUBLIC_ASSETS_DIRECTORY,
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
  // https://esbuild.github.io/api/#jsx-import-source
  jsx: "automatic",
  jsxImportSource: "@meact",
};

const staticContentLoaders = {
  // resolveExtensions: [".css", ".gif", ".png", ".jpg", ".jpeg", ".svg"],
  loader: {
    ".ts": "tsx",
    ".js": "jsx",
    ".css": "css",
    ".gif": "file",
    ".png": "file",
    ".jpg": "file",
    ".jpeg": "file",
    ".svg": "file",
  },
};

async function buildScriptBundles() {
  // bundle both of these entrypoint-patterns together
  // so as to get the benefit of code splitting between them as well
  await build({
    entryPoints: [
      `${APP_DIRECTORY_NAME}/${PAGES_DIRECTORY_NAME}/*.tsx`,
      `${MEACT_CSR_LIB_DIRECTORY}/${MEACT_CSR_CLIENT_FILE_NAME}`,
    ],
    outdir: BUILD_OUTPUT_DIRECTORY_NAME, // outdir is required when code splitting is active
    platform: "browser",
    // globalName: "page", // when format: "iife" - define a global name to access exported values from the compiled script
    ...jsxExtension,
    ...commonClientFacingBuildOptions,
    alias: meactLibAlias,
    ...staticContentLoaders,
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
    ...staticContentLoaders,
    publicPath: "/static/",
    alias: {
      static: join(PUBLIC_ASSETS_DIRECTORY, "static"),
    },
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

  await buildScriptBundles();
  await buildStylesheetBundles();

  console.log("Build completed...");
}

initBuild();
