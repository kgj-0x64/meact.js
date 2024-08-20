import { useState, useEffect } from "@meact";

/**
 * A convenient wrapper for reading and writing search parameters via the
 * URLSearchParams interface.
 */
export function useSearchParams(): URLSearchParams {
  const [searchParams, setSearchParams] = useState(() => {
    return new URLSearchParams(window.location.search);
  });

  useEffect(() => {
    const handleUrlChange = () => {
      setSearchParams(new URLSearchParams(window.location.search));
    };

    window.addEventListener("popstate", handleUrlChange);

    return () => {
      window.removeEventListener("popstate", handleUrlChange);
    };
  }, []);

  return searchParams;
}
