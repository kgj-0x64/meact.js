import { Request } from "express";

/**
 * Enum with values for the URL search param fields, which are unique and global across the site
 */
export enum URLSearchParamFields {
  HOW = "how",
  GOTO = "goto",
  PAGE = "p",
  ID = "id",
}

export enum URLSearchParamHowValue {
  UPVOTE = "up",
  UNVOTE = "un",
}

// export function getSearchParamsFromRequest(request: Request) {
//   return new URL(request.url).searchParams;
// }

/**
 *
 * In Express.js, the `req` object in a GET route handler represents the incoming HTTP request.
 * The `req` object is an instance of `http.IncomingMessage` (from Node.js), extended by Express to include additional functionality.
 *
 * However, the `req` object is not directly compatible with the `Request` interface
 * that is typically used in environments like fetch or in frameworks that use the Fetch API, such as Remix or service workers.
 */

export function getSearchParamsFromRequest(req: Request) {
  // Construct the full URL using the protocol and host from the request
  const fullUrl = `${req.protocol}://${req.get("host")}${req.url}`;

  // Create a URL object and return the search params
  return new URL(fullUrl).searchParams;
}

/**
 * Remix-like Response throwers for CatchBoundary rendering
 */
function isAsserted(value: any): boolean {
  return value === undefined || value === null || value === false;
}

export function checkBadRequest(value: any, message: string): asserts value {
  if (isAsserted(value)) {
    throw new Response(message, { status: 400, statusText: "Bad Request" });
  }

  return;
}

export function checkUnauthorized(value: any, message: string): asserts value {
  if (isAsserted(value)) {
    throw new Response(message, { status: 401, statusText: "Not Authorized" });
  }

  return;
}

export function checkForbidden(value: any, message: string): asserts value {
  if (isAsserted(value)) {
    throw new Response(message, { status: 403, statusText: "Forbidden" });
  }

  return;
}

export function checkNotFound(value: any, message: string): asserts value {
  if (isAsserted(value)) {
    throw new Response(message, { status: 404, statusText: "Not Found" });
  }

  return;
}
