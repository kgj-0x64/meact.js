import express from "express";
import {
  preparePageContentMiddleware,
  handleRouteActionMiddleware,
} from "./server.middleware.ts";
import {
  DIST_OUTPUT_DIRECTORY,
  PUBLIC_ASSETS_DIRECTORY,
} from "../constants/fileAndDirectoryNameAndPaths.ts";

// ! Userland (user of framework) plug of server for initialization of resources
import "../../app.server.ts";
import { MeactErrorResponse, MeactJsonResponse } from "./responses.ts";

// Create an Express application
const app = express();

// Serve static files from the "dist" directory
app.use(express.static(DIST_OUTPUT_DIRECTORY));

// https://expressjs.com/en/starter/static-files.html
// Serve static files like "robots.txt" and logo assets from the "public" directory
app.use(express.static(PUBLIC_ASSETS_DIRECTORY));

// custom middleware
app.use(async (req, res, next) => {
  console.log(`LOG: Got ${req.method} ${req.path} request at ${Date.now()}`);

  // Middleware that will only be applied to paths matching the pattern "/*" and not to "/**/*"
  const pathParts = req.path.split("/").filter(Boolean);

  if (req.path !== "/" && pathParts.length !== 1) {
    // Pass to the next middleware/route handler
    next();
    return;
  }

  // Handle the request with exactly one path segment
  if (req.method === "GET" && !req.path.startsWith("/_")) {
    await preparePageContentMiddleware(req, res, next);
  } else if (req.method === "POST" && !req.path.startsWith("/_")) {
    await handleRouteActionMiddleware(req, res, next);
  }

  next();
});

/// GET HTML page requests
app.get(["/", "/:pageName"], async (req, res) => {
  // Access the generated content from the middleware
  const responseHtmlContent = req._preparedHtmlContent;

  if (responseHtmlContent !== undefined && responseHtmlContent.length > 0) {
    // Send the modified HTML as the response
    res.send(responseHtmlContent);
  } else {
    // If the page doesn't exist, return a 404 status
    res.status(404).send("Page not found");
  }
});

/// POST requests
app.post(["/login", "/logout"], async (req, res) => {
  // Access the generated content from the middleware
  const jsonResponseContent: MeactJsonResponse | MeactErrorResponse =
    req._preparedJsonResponseContent;
  console.log("jsonResponseContent", jsonResponseContent);

  if (jsonResponseContent instanceof MeactErrorResponse) {
    res.status(jsonResponseContent.status).send(jsonResponseContent.message);
    return;
  }

  for (const [key, value] of Object.entries(jsonResponseContent)) {
    console.log(`Key: ${key}, Value: ${value}`);
    // Manually set the header properties e.g. "Set-Cookie"
    res.setHeader(key, value);
  }

  if (jsonResponseContent.isRedirectResponse()) {
    res.redirect(jsonResponseContent.redirectToUrl!);
    return;
  }

  res.status(jsonResponseContent.status).json(jsonResponseContent.data);
});

// Set the port
const PORT = process.env.PORT || 8080;

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
