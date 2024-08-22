import { Request, Response, NextFunction } from "express";
import { prepareHtmlOnPageRequest } from "./preparePageOnRequest";

export async function preparePageContentMiddleware(
  req: Request,
  _: Response,
  next: NextFunction
) {
  try {
    console.log(`LOG: Preparing content for ${req.path}`);

    // Inject the correct JS and CSS files into the index.html content
    const preparedHtmlContent = await prepareHtmlOnPageRequest(req);

    // Attach the generated content to the `req` object
    req.preparedHtmlContent = preparedHtmlContent || "";

    console.log(`LOG: Prepared content for ${req.path} at ${Date.now()}`);

    // Continue to the next middleware or route handler
    next();
  } catch (error) {
    // Pass any error to the next error-handling middleware
    next(error);
  }
}
