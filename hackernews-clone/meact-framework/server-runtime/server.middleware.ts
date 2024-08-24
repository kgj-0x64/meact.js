import { Request, Response, NextFunction } from "express";
import { prepareHtmlOnPageRequest } from "./preparePageOnRequest";
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
    const preparedHtmlContent = await prepareHtmlOnPageRequest(req);

    // Attach the generated content to the `req` object
    req._preparedHtmlContent = preparedHtmlContent || "";

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
    const preparedJsonResponseContent = await handleRouteActionRequest(req);

    // Attach the generated content to the `req` object
    req._preparedJsonResponseContent =
      preparedJsonResponseContent.routeActionData;

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
