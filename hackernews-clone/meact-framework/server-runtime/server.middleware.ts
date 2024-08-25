import { Request, Response, NextFunction } from "express";
import { preparePageContentOnRequest } from "./handleRouteLoaderRequest";
import { handleRouteActionRequest } from "./handleRouteActionRequest";

export async function preparePageContentMiddleware(
  req: Request,
  _: Response,
  next: NextFunction
) {
  try {
    console.log(
      `LOG: Preparing HTML content for ${req.method} ${
        req.path
      } request at ${Date.now()}`
    );

    // Inject the correct JS and CSS files into the index.html content
    const preparedPageContent = await preparePageContentOnRequest(req);

    // Attach the generated content to the `req` object
    req._preparedPageHtmlContent = preparedPageContent.html || "";
    req._preparedRouteResponseContent = preparedPageContent.routeLoaderData;

    console.log(
      `LOG: Prepared HTML content for ${req.method} ${
        req.path
      } request at ${Date.now()}`
    );

    // Continue to the next middleware or route handler
    next();
  } catch (error) {
    // Pass any error to the next error-handling middleware
    next(error);
  }
}

export async function handleRouteActionMiddleware(
  req: Request,
  _: Response,
  next: NextFunction
) {
  try {
    console.log(
      `LOG: Preparing JSON content for ${req.method} ${
        req.path
      } request at ${Date.now()}`
    );

    // Get response data from route's action handler
    const preparedRouteResponseContent = await handleRouteActionRequest(req);

    // Attach the generated content to the `req` object
    req._preparedRouteResponseContent =
      preparedRouteResponseContent.routeActionData;

    console.log(
      `LOG: Prepared JSON content for ${req.method} ${
        req.path
      } request at ${Date.now()}`
    );

    // Continue to the next middleware or route handler
    next();
  } catch (error) {
    // Pass any error to the next error-handling middleware
    next(error);
  }
}
