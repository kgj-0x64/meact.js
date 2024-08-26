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

/**
 * ! Simpley returning `new URL(fullUrl).searchParams` is dangerous because
 * client/user input might have sent `null` and `undefined` values in their stringified forms
 * which would pass the null check (being a valid string) and thus lead to side effects like sending "/null" in the redirect response
 *
 * This function addresses common issues with query parameters, such as:
 * - Converting "null" and "undefined" strings to null-like behavior by removing them.
 * - Removing empty or whitespace-only strings.
 *
 * Its goal is to sanitize query parameters to ensure they
 * align with expected data types and handle common pitfalls where certain string
 * values might be used incorrectly in URLs.
 *
 * @param {Request} req - The Express.js request object containing query parameters.
 * @returns {URLSearchParams} - A sanitized URLSearchParams object.
 */
export function getUrlSearchParamsFromReq(req: Request): URLSearchParams {
  const fullUrl = `${req.protocol}://${req.get("host")}${req.originalUrl}`;
  const myURL = new URL(fullUrl);

  const valuesToRemove = ["null", "undefined", "", " ", "\t"];

  for (const [key, value] of myURL.searchParams.entries()) {
    if (valuesToRemove.includes(value)) {
      myURL.searchParams.delete(key);
    }
  }

  return myURL.searchParams;
}
