import { Request } from "express";
import { MeactJsonResponse, MeactErrorResponse } from "./responses";
// @ts-ignore
import { mapOfComponentNameToServerSideHandlers } from "./build.js";

/**
 * call this on server to prepare index.html content in response to a page request
 */
export async function handleRouteActionRequest(
  req: Request
): Promise<MeactJsonResponse | MeactErrorResponse> {
  try {
    // Get the page name (path)
    const pathName = req.path === "/" ? "/index" : req.path; // starts with "/"
    const pageName = pathName.substring(1);

    const serverSideHandlersForThisPage =
      mapOfComponentNameToServerSideHandlers.get(pageName);

    if (
      serverSideHandlersForThisPage === undefined ||
      serverSideHandlersForThisPage.action === undefined
    ) {
      return new MeactErrorResponse("Route does not exist", 404);
    }

    const actionData = await serverSideHandlersForThisPage.action({
      req,
    });

    return actionData;
  } catch (error) {
    console.error(
      `LOG: Error while handling route action on ${req.method} ${req.path} request`,
      error
    );
    return new MeactErrorResponse(
      "Server failed to process this request, please try again",
      500
    );
  }
}
