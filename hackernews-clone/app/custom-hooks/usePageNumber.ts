import { useSearchParams } from "./useSearchParams";
import { getPageNumberFromSearchParams } from "./news-page-number";

/**
 * Returns the current page number for news feed, default is 0
 */
export function usePageNumber(): number {
  const { searchParams } = useSearchParams();

  return getPageNumberFromSearchParams(searchParams);
}
