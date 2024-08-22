import { build } from "esbuild";
import { existsSync, rmSync } from "fs";
import path from "path";
import mdx from "@mdx-js/esbuild";
import {
  DIST_OUTPUT_DIRECTORY,
  APP_DIRECTORY,
  PAGES_DIRECTORY_NAME,
  MEACT_LIB_DIRECTORY,
  MEACT_DOM_LIB_DIRECTORY,
  MEACT_FRAMEWORK_CLIENT_DIRECTORY,
  DIST_OUTPUT_DIRECTORY_NAME,
  STYLES_DIRECTORY_NAME,
} from "../constants/fileAndDirectoryNameAndPaths.js";

const meactLibAlias = {
  // Alias to ensure the path is correctly resolved
  "@meact": path.join(MEACT_LIB_DIRECTORY, "index.js"),
  "@meact/jsx-runtime": path.join(MEACT_LIB_DIRECTORY, "jsx-runtime.js"),
  "@meact-dom": path.join(MEACT_DOM_LIB_DIRECTORY, "index.js"),
  "@meact-framework/client": path.join(
    MEACT_FRAMEWORK_CLIENT_DIRECTORY,
    "index.js"
  ),
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
  resolveExtensions: [
    ".js",
    ".jsx",
    ".ts",
    ".tsx",
    ".css",
    ".gif",
    ".png",
    ".jpg",
    ".jpeg",
    ".svg",
  ],
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
      `${APP_DIRECTORY}/${PAGES_DIRECTORY_NAME}/*.tsx`,
      `${MEACT_FRAMEWORK_CLIENT_DIRECTORY}/client.js`,
    ],
    outdir: DIST_OUTPUT_DIRECTORY_NAME, // outdir is required when code splitting is active
    platform: "browser",
    // globalName: "page", // when format: "iife" - define a global name to access exported values from the compiled script
    ...jsxExtension,
    ...commonClientFacingBuildOptions,
    alias: meactLibAlias,
    ...staticContentLoaders,
    logLevel: "info", // Optional: Shows build logs
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

/// ! There is no point doing this because every page is getting its own tree-shaken CSS bundle
/// also, Esbuild is not the right tool to do this

// just pushing global styles like debugger.css into the public directory
async function buildStylesheetBundles() {
  await build({
    entryPoints: [`${APP_DIRECTORY}/${STYLES_DIRECTORY_NAME}/*.css`],
    outdir: `${DIST_OUTPUT_DIRECTORY_NAME}/${STYLES_DIRECTORY_NAME}`,
    bundle: true,
    minify: true, // Minifies the output CSS
    ...staticContentLoaders,
  });
}

/// ! Lost much time with this, need to understand Esbuild x Typescript relative path resolution better
/// Typescript+Esbuild makes the right thing harder: https://github.com/evanw/esbuild/issues/622
/// ! `memix.build.ts` gets this job done with the same logic without any drama!

// async function buildMemixServerSideHandlers() {
//   await build({
//     entryPoints: ["index.ts", "middleware.ts", "server/**/*.ts"], // No specific entry point since we are generating a file
//     outdir: BUILD_OUTPUT_DIRECTORY_NAME, // Or any other output directory
//     format: "esm",
//     platform: "node",
//     bundle: false, // Not bundling since we are generating a single file
//     logLevel: "info", // Optional: Shows build logs
//     ...staticContentLoaders,
//     plugins: [
//       {
//         name: "build-memix-build-map-plugin",
//         setup(build) {
//           build.onEnd(buildMemixServerSideHandlersMap);
//         },
//       },
//     ],
//   });
// }

async function initBuild() {
  console.log("Build started...");

  // Delete the dist directory if it exists
  if (existsSync(DIST_OUTPUT_DIRECTORY)) {
    rmSync(DIST_OUTPUT_DIRECTORY, { recursive: true, force: true });
    console.log(`Deleted ${DIST_OUTPUT_DIRECTORY}`);
  }

  console.log(`Populating ${DIST_OUTPUT_DIRECTORY}`);
  await buildScriptBundles();
  await buildStylesheetBundles();
  console.log(`Build completed for ${DIST_OUTPUT_DIRECTORY}`);

  console.log("Build completed...");
}

initBuild();
