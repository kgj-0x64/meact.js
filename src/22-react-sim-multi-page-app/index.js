import express from "express";
import { readFileSync, existsSync } from "fs";
import { join } from "path";
import {
  indexHtmlPath,
  buildOutputDirectory,
  buildOutputPagesDirectory,
} from "./constants.js";

// Create an Express application
const app = express();

// Serve static files from the "dist" directory
app.use(express.static(buildOutputDirectory));

// Serve static index.html
const indexHtml = readFileSync(indexHtmlPath, "utf-8");

// Middleware to check if the requested page exists
app.get("/:page", (req, res) => {
  const page = req.params.page;

  // Construct the expected paths for the JS and CSS bundles
  const jsBundlePath = join(buildOutputPagesDirectory, `${page}.js`);
  const cssBundlePath = join(buildOutputDirectory, "global.css");

  // Check if both the JS and CSS files for the requested page exist
  if (existsSync(jsBundlePath) && existsSync(cssBundlePath)) {
    // Inject the correct JS and CSS files into the index.html content
    const responseHtml = indexHtml
      .replace("</head>", `<link rel="stylesheet" href="/global.css">\n</head>`)
      .replace(
        "</body>",
        `<script type="module" src="/${page}.js"></script>\n</body>`
      );

    // Send the modified HTML as the response
    res.send(responseHtml);
  } else {
    // If the page doesn't exist, return a 404 status
    res.status(404).send("Page not found");
  }
});

// Default route to handle the root ("/") and redirect to a specific page, e.g., page1
app.get("/", (req, res) => {
  res.redirect("/index");
});

// Set the port
const PORT = process.env.PORT || 8080;

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
