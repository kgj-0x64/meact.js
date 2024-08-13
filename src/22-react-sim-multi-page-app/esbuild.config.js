import mdx from "@mdx-js/esbuild";
import { build } from "esbuild";
import { readdirSync, existsSync, rmSync } from "fs";
import { join, parse } from "path";
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
  CONSTANTS_DIRECTORY,
} from "./constants/fileAndDirectoryNameAndPaths.js";
import { MEACT_CSR_CLIENT_NAMESPACE } from "./constants/globalNamespacesOnClient.js";

const meactLibAlias = {
  // Alias to ensure the path is correctly resolved
  "@meact": join(MEACT_LIB_DIRECTORY, "index.js"),
  "@meact/render-tree": join(MEACT_LIB_RENDER_TREE_DIRECTORY, "index.js"),
  "@meact/jsx-runtime": join(MEACT_LIB_DIRECTORY, "jsx-runtime.js"),
  "@meact-dom": join(MEACT_DOM_LIB_DIRECTORY, "index.js"),
};

const commonClientFacingBuildOptions = {
  format: "iife", // Use IIFE format for direct execution of code in browsers when the script is loaded, without needing a module system
  target: "esnext", // Target modern JavaScript
  write: true, // Write the result to the output file
  bundle: true,
  splitting: false, // Splitting currently only works with the "esm" format
  treeShaking: true,
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

async function buildPage(page) {
  const entryPoint = join(APP_DIRECTORY, PAGES_DIRECTORY_NAME, page);
  const pageName = parse(page).name;

  const buildOutputPagesDirectory = join(
    BUILD_OUTPUT_DIRECTORY,
    PAGES_DIRECTORY_NAME
  );

  await build({
    entryPoints: [entryPoint],
    // outfile,
    outdir: buildOutputPagesDirectory, // outdir is required when code splitting is active
    globalName: pageName, // Define a global name to access exported values from the compiled script
    ...jsxExtension,
    ...commonClientFacingBuildOptions,
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
    alias: meactLibAlias,
  });
}

async function buildMeactCsrClient() {
  const entryPoint = join(MEACT_CSR_LIB_DIRECTORY, MEACT_CSR_CLIENT_FILE_NAME);
  const outdir = join(BUILD_OUTPUT_DIRECTORY, MEACT_CSR_LIB_DIRECTORY_NAME);

  await build({
    entryPoints: [entryPoint],
    outdir, // outdir is required when code splitting is active
    globalName: MEACT_CSR_CLIENT_NAMESPACE, // Define a global name to access exported values from the compiled script
    ...commonClientFacingBuildOptions,
    ...jsxExtension,
    alias: meactLibAlias,
  });
}

async function buildClientSideGlobalNamespaces() {
  const entryPoint = join(CONSTANTS_DIRECTORY, "globalNamespacesOnClient.js");
  const outfile = join(BUILD_OUTPUT_DIRECTORY, "globals.js");

  await build({
    entryPoints: [entryPoint],
    outfile,
    globalName: "namespaces", // Define a global name to access exported values from the compiled script
    ...commonClientFacingBuildOptions,
  });
}

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

async function initBuild() {
  console.log("Build started...");

  // Delete the dist directory if it exists
  if (existsSync(BUILD_OUTPUT_DIRECTORY)) {
    rmSync(BUILD_OUTPUT_DIRECTORY, { recursive: true, force: true });
    console.log(`Deleted ${BUILD_OUTPUT_DIRECTORY}`);
  }

  console.log(`Populating ${BUILD_OUTPUT_DIRECTORY}`);
  const appPagesDirectory = join(APP_DIRECTORY, PAGES_DIRECTORY_NAME);
  const pages = readdirSync(appPagesDirectory).filter((file) =>
    file.endsWith(".js")
  );
  await Promise.all(pages.map((item) => buildPage(item)));
  await buildStylesheets();
  await buildMeactCsrClient();
  await buildClientSideGlobalNamespaces();

  console.log("Build completed...");
}

initBuild();
