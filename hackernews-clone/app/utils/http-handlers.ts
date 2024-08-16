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

export function getSearchParamsFromRequest(request: Request) {
  return new URL(request.url).searchParams;
}
