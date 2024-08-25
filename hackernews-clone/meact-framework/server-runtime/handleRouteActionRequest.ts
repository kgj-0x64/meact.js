import { Request } from "express";
import { MeactJsonResponse, makeErrorResponse } from "./responses";
// @ts-ignore
import { mapOfComponentNameToServerSideHandlers } from "./build.js";

/**
 * call this on server to prepare index.html content in response to a page request
 */
export async function handleRouteActionRequest(req: Request): Promise<{
  routeActionData: MeactJsonResponse<any>;
}> {
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
      return {
        routeActionData: makeErrorResponse("Route does not exist", 404),
      };
    }

    const actionData: MeactJsonResponse<any> =
      await serverSideHandlersForThisPage.action({
        req,
      });

    return {
      routeActionData: actionData,
    };
  } catch (error) {
    console.error(
      `LOG: Error while handling route action on ${req.method} ${req.path} request`,
      error
    );
    return {
      routeActionData: makeErrorResponse(
        "Server failed to process this request, please try again",
        500
      ),
    };
  }
}
