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
