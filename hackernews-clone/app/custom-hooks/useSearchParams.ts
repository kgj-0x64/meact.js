import { useState, useEffect } from "@meact";

/// https://stackoverflow.com/questions/901115/how-can-i-get-query-string-values-in-javascript

export function useSearchParams() {
  const [searchParams, setSearchParams] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    const entries = Array.from(params.entries());
    return Object.fromEntries(entries);
  });

  useEffect(() => {
    const handleUrlChange = () => {
      const params = new URLSearchParams(window.location.search);
      const entries = Array.from(params.entries());
      setSearchParams(Object.fromEntries(entries));
    };

    window.addEventListener("popstate", handleUrlChange);

    return () => {
      window.removeEventListener("popstate", handleUrlChange);
    };
  }, []);

  const getParam = (key: string) => {
    return searchParams[key] || null;
  };

  const setParam = (key: string, value: string) => {
    const params = new URLSearchParams(window.location.search);

    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }

    const newUrl = `${window.location.pathname}?${params.toString()}`;
    window.history.pushState({}, "", newUrl);
    setSearchParams(Object.fromEntries(params.entries()));
  };

  return {
    getParam,
    setParam,
    allParams: searchParams,
  };
}
