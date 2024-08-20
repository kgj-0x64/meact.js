import express from "express";
import { prepareHtmlOnPageRequest } from "./middleware";
import {
  BUILD_OUTPUT_DIRECTORY,
  PUBLIC_ASSETS_DIRECTORY_NAME,
} from "./constants/fileAndDirectoryNameAndPaths.js";

// Create an Express application
const app = express();

// Serve static files from the "dist" directory
app.use(express.static(BUILD_OUTPUT_DIRECTORY));

// https://expressjs.com/en/starter/static-files.html
// Serve static files like "robots.txt" from the "public" directory
app.use(express.static(PUBLIC_ASSETS_DIRECTORY_NAME));

// Middleware to check if the requested page exists
app.get("/:pageName", async (req, res) => {
  const pageName = req.params.pageName;

  // Inject the correct JS and CSS files into the index.html content
  const responseHtmlContent = await prepareHtmlOnPageRequest(
    pageName ? pageName : "index",
    req
  );

  if (responseHtmlContent) {
    // Serve static index.html
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
