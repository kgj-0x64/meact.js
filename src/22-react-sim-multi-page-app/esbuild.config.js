import mdx from "@mdx-js/esbuild";
import { build } from "esbuild";
import { readdirSync } from "fs";
import { join, parse } from "path";
import {
  meactLibDirectory,
  appPagesDirectory,
  buildOutputDirectory,
  buildOutputPagesDirectory,
} from "./constants.js";

async function buildPage(page) {
  const entryPoint = join(appPagesDirectory, page);
  const pageName = parse(page).name;

  await build({
    entryPoints: [entryPoint],
    // outfile,
    outdir: buildOutputPagesDirectory, // outdir is required when code splitting is active
    bundle: true, // Bundle all dependencies into the output
    format: "iife", // Use IIFE format for direct execution of code in browsers when the script is loaded, without needing a module system
    target: "esnext", // Target modern JavaScript
    globalName: pageName, // Define a global name to access the compiled component
    loader: { ".js": "jsx" }, // To be able to parse JSX syntax
    jsxFactory: "createElement", // JSX factory function
    jsxFragment: "Fragment", // JSX fragment function
    write: true, // Write the result to the output file
    splitting: false, // Splitting currently only works with the "esm" format
    treeShaking: true,
    sourcemap: false,
    // minify: true,
    plugins: [
      mdx({
        /* compile options */
        jsx: false, // produce code which uses jsx-runtime instead of JSX syntax
        jsxImportSource: "@meact", // Use 'meact/jsx-runtime' for JSX processing
        jsxRuntime: "automatic",
        outputFormat: "program",
        elementAttributeNameCase: "html",
        stylePropertyNameCase: "css",
      }),
    ],
    alias: {
      // Alias for meact and meact/jsx-runtime to ensure it's correctly resolved
      "@meact": meactLibDirectory,
      "@meact/jsx-runtime": join(meactLibDirectory, "jsx-runtime.js"),
    },
    inject: [], // Avoid injecting anything extra
  });
}

async function buildServer() {
  // Build server
  await build({
    entryPoints: ["index.js"],
    outdir: buildOutputDirectory,
    bundle: true,
    platform: "node",
    format: "esm",
    write: true, // Write the result to the output file
    splitting: true,
    treeShaking: true,
    sourcemap: false,
    minify: true,
  });
}

async function initBuild() {
  console.log("Build started...");

  const pages = readdirSync(appPagesDirectory).filter((file) =>
    file.endsWith(".js")
  );
  await Promise.all(pages.map((item) => buildPage(item)));

  await buildServer();

  console.log("Build completed...");
}

initBuild();
