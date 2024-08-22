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

export function getUrlSearchParamsFromReq(req: Request): URLSearchParams {
  // Convert req.query to a query string
  const queryString = new URLSearchParams(req.query as any).toString();

  // Create a URLSearchParams object from the query string
  const params = new URLSearchParams(queryString);

  return params;
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
