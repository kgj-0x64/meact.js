import express from "express";
import { readFileSync, existsSync } from "fs";
import { join } from "path";
import {
  BUILD_OUTPUT_DIRECTORY,
  PAGES_DIRECTORY_NAME,
  APP_DIRECTORY_NAME,
  PUBLIC_ASSETS_DIRECTORY_NAME,
  ROOT_DIRECTORY,
} from "./constants/fileAndDirectoryNameAndPaths.js";
import { prepareHtmlForPageRequest } from "#meact-csr/server.js";

// Create an Express application
const app = express();

// Serve static files from the "dist" directory
app.use(express.static(BUILD_OUTPUT_DIRECTORY));

// https://expressjs.com/en/starter/static-files.html
// Serve static files like "robots.txt" from the "public" directory
app.use(express.static(PUBLIC_ASSETS_DIRECTORY_NAME));

// Serve static index.html
const indexHtmlContent = readFileSync(
  join(ROOT_DIRECTORY, "index.html"),
  "utf-8"
);

// Middleware to check if the requested page exists
app.get("/:page", (req, res) => {
  const page = req.params.page;

  // Construct the expected paths for the JS and CSS bundles
  const scriptBundleRelativePath = `${APP_DIRECTORY_NAME}/${PAGES_DIRECTORY_NAME}/${page}.js`;
  const jsBundlePath = join(BUILD_OUTPUT_DIRECTORY, scriptBundleRelativePath);

  const stylesheetBundleRelativePath = `${APP_DIRECTORY_NAME}/${PAGES_DIRECTORY_NAME}/${page}.css`;
  const stylesheetBundlePath = join(
    BUILD_OUTPUT_DIRECTORY,
    stylesheetBundleRelativePath
  );

  // Check if both the JS and CSS files for the requested page exist
  if (existsSync(jsBundlePath)) {
    // Inject the correct JS and CSS files into the index.html content
    const responseHtmlContent = prepareHtmlForPageRequest(
      indexHtmlContent,
      scriptBundleRelativePath,
      existsSync(stylesheetBundleRelativePath)
        ? stylesheetBundleRelativePath
        : null
    );

    // Send the modified HTML as the response
    res.send(responseHtmlContent);
  } else {
    // If the page doesn't exist, return a 404 status
    res.status(404).send("Page not found");
  }
});

// Default route to handle the root ("/") and redirect to a specific page, e.g., page1
app.get("/", (_, res) => {
  res.redirect("/home");
});

// Set the port
const PORT = process.env.PORT || 8080;

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
