import { build } from "esbuild";

build({
  entryPoints: ["src/**/*.jsx", "meact/**/*.js"], // Include multiple entry points
  outdir: "build",
  bundle: false, // Don't bundle so that each file remains separate
  format: "iife", // Use IIFE to create global functions
  target: ["esnext"], // Target modern JS environments
  jsx: "transform", // Handle JSX transformation
  jsxFactory: "createElement",
  jsxFragment: "Fragment",
  loader: { ".js": "jsx" },
}).catch(() => process.exit(1));
