import { useState } from "@meact";

type UseLoaderDataState<T> = T;

export function useLoaderData<T>() {
  const [data, setData] = useState<UseLoaderDataState<T>>(() => {
    // Check if data is available on the window object
    return window.__INITIAL_PAGE_DATA__;
  });

  return data;
}
