import express from "express";
import bodyParser from "body-parser";
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

// Create an Express application
const app = express();

// Serve static files from the "dist" directory
app.use(express.static(DIST_OUTPUT_DIRECTORY));

// https://expressjs.com/en/starter/static-files.html
// Serve static files like "robots.txt" and logo assets from the "public" directory
app.use(express.static(PUBLIC_ASSETS_DIRECTORY));

// middleware to parse incoming requests with URL-encoded payloads,
// which are typically sent by traditional HTML forms using the "application/x-www-form-urlencoded" content type
app.use(bodyParser.urlencoded({ extended: true }));

// middleware to parse incoming requests with JSON payloads,
// which are typically sent by APIs or applications using the "application/json" content type
// it makes parsed JSON object available on `req.body` as a JavaScript object
app.use(bodyParser.json());

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
  if (req.method === "GET") {
    await preparePageContentMiddleware(req, res, next);
  } else if (req.method === "POST") {
    await handleRouteActionMiddleware(req, res, next);
  }

  next();
});

/// GET HTML page requests
app.get(["/", "/:pageName"], async (req, res) => {
  // Access the generated content from the middleware
  const responseHtmlContent = req._preparedPageHtmlContent;
  const jsonRouteResponseContent = req._preparedRouteResponseContent;

  if (responseHtmlContent !== undefined && responseHtmlContent.length > 0) {
    if (jsonRouteResponseContent && jsonRouteResponseContent.meta) {
      // set response status
      res.status(jsonRouteResponseContent.meta.status);

      // set header properties, if any
      for (const [key, value] of Object.entries(
        jsonRouteResponseContent.meta.setInHeaders
      )) {
        // Manually set the header properties e.g. "Set-Cookie"
        res.setHeader(key, value);
      }
    }

    // Send the prepare page HTML as the response
    res.send(responseHtmlContent);
  } else {
    // If the page doesn't exist, return a 404 status
    res.status(404).send("Page not found");
  }
});

/// POST requests
app.post(["/register", "/login", "/logout"], async (req, res) => {
  // Access the generated content from the action
  const jsonRouteResponseContent = req._preparedRouteResponseContent;

  if (jsonRouteResponseContent && jsonRouteResponseContent.meta) {
    // set response status
    res.status(jsonRouteResponseContent.meta.status);

    // set header properties, if any
    for (const [key, value] of Object.entries(
      jsonRouteResponseContent.meta.setInHeaders
    )) {
      // Manually set the header properties e.g. "Set-Cookie"
      res.setHeader(key, value);
    }

    if (jsonRouteResponseContent.isRedirectResponse()) {
      res.redirect(jsonRouteResponseContent.meta.redirectToUrl!);
      return;
    } else {
      jsonRouteResponseContent.meta = null;
      res.json(jsonRouteResponseContent);
    }
  } else {
    res.status(500).send("Server failed to process this request");
  }
});

// Set the port
const PORT = process.env.PORT || 8080;

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
