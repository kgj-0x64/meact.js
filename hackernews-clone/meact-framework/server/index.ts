import express from "express";
import { preparePageContentMiddleware } from "./server.middleware.ts";
import {
  DIST_OUTPUT_DIRECTORY,
  PUBLIC_ASSETS_DIRECTORY,
} from "../constants/fileAndDirectoryNameAndPaths.js";

// ! Userland (user of framework) plug of server for initialization of resources
import "../../app.server.ts";

// import types to export
import type { MeactMeta, MeactLoader } from "./types.ts";
export { MeactMeta, MeactLoader };

// Create an Express application
const app = express();

// Serve static files from the "dist" directory
app.use(express.static(DIST_OUTPUT_DIRECTORY));

// https://expressjs.com/en/starter/static-files.html
// Serve static files like "robots.txt" and logo assets from the "public" directory
app.use(express.static(PUBLIC_ASSETS_DIRECTORY));

// Middleware that applies to all routes except those starting with /api/ or /_
app.use((req, res, next) => {
  console.log(`LOG: Got ${req.method} request on ${req.path} at ${Date.now()}`);

  if (!req.path.startsWith("/app") && !req.path.startsWith("/_")) {
    return preparePageContentMiddleware(req, res, next);
  }

  next();
});

// check if the requested page exists
app.get(["/", "/:pageName"], async (req, res) => {
  // Access the generated content from the middleware
  const responseHtmlContent = req.preparedHtmlContent;

  if (responseHtmlContent !== undefined && responseHtmlContent.length > 0) {
    // Send the modified HTML as the response
    res.send(responseHtmlContent);
  } else {
    // If the page doesn't exist, return a 404 status
    res.status(404).send("Page not found");
  }
});

// Default route to handle the root ("/") and redirect to a specific page, e.g., page1
// app.get("/", (_, res) => {
//   res.redirect("/index");
// });

// Set the port
const PORT = process.env.PORT || 8080;

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
