import express from "express";
import { readFileSync, existsSync } from "fs";
import { join } from "path";
import {
  BUILD_OUTPUT_DIRECTORY,
  MEACT_CSR_LIB_DIRECTORY,
  MEACT_CSR_INDEX_HTML_FILE_NAME,
  GLOBAL_STYLES_FILE_NAME,
  STYLES_DIRECTORY_NAME,
  PAGES_DIRECTORY_NAME,
} from "./constants/fileAndDirectoryNameAndPaths.js";
import { prepareHtmlForPageRequest } from "#meact-csr/server.js";

// Create an Express application
const app = express();

// Serve static files from the "dist" directory
app.use(express.static(BUILD_OUTPUT_DIRECTORY));

// Serve static index.html
const indexHtmlContent = readFileSync(
  join(MEACT_CSR_LIB_DIRECTORY, MEACT_CSR_INDEX_HTML_FILE_NAME),
  "utf-8"
);

// Middleware to check if the requested page exists
app.get("/:page", (req, res) => {
  const page = req.params.page;

  // Construct the expected paths for the JS and CSS bundles
  const stylesheetBundleRelativePath = `${STYLES_DIRECTORY_NAME}/${GLOBAL_STYLES_FILE_NAME}`;
  const globalCssBundlePath = join(
    BUILD_OUTPUT_DIRECTORY,
    STYLES_DIRECTORY_NAME,
    GLOBAL_STYLES_FILE_NAME
  );

  const scriptBundleRelativePath = `${PAGES_DIRECTORY_NAME}/${page}.js`;
  const jsBundlePath = join(
    BUILD_OUTPUT_DIRECTORY,
    PAGES_DIRECTORY_NAME,
    `${page}.js`
  );

  // Check if both the JS and CSS files for the requested page exist
  if (existsSync(jsBundlePath) && existsSync(globalCssBundlePath)) {
    // Inject the correct JS and CSS files into the index.html content
    const responseHtmlContent = prepareHtmlForPageRequest(
      indexHtmlContent,
      stylesheetBundleRelativePath,
      scriptBundleRelativePath
    );

    // Send the modified HTML as the response
    res.send(responseHtmlContent);
  } else {
    // If the page doesn't exist, return a 404 status
    res.status(404).send("Page not found");
  }
});

// Default route to handle the root ("/") and redirect to a specific page, e.g., page1
app.get("/", (req, res) => {
  res.redirect("/home");
});

// Set the port
const PORT = process.env.PORT || 8080;

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
