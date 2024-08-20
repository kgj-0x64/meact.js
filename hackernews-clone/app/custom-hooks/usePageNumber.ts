import { useSearchParams } from "./useSearchParams.js";
import { getPageNumberFromSearchParams } from "../utils/news-page-number.js";

/**
 * Returns the current page number for news feed, default is 0
 */
export function usePageNumber(): number {
  const searchParams = useSearchParams();

  return getPageNumberFromSearchParams(searchParams);
}
