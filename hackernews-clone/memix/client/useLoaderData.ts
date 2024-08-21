import { useState } from "@meact";
import { useCurrComponent } from "./useCurrComponent.js";

type UseLoaderDataState<T> = T | null;

export function useLoaderData<T>() {
  // getting currently executing component's function from the global `window` namespace
  // where it has been set by the Meact.js library
  const currExecutingComponentName = useCurrComponent();

  const loaderDataObject = window.__INITIAL_PAGE_DATA_MAP__;
  const thisComponentLoaderData = loaderDataObject[currExecutingComponentName];

  const [data, _] = useState<UseLoaderDataState<T>>(thisComponentLoaderData);

  return data;
}
