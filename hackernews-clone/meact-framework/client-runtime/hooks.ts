import { useState } from "@meact";

export function useCurrComponent(): string {
  // @ts-ignore
  const meactAppNamespace: any = window.MeactApp;
  return meactAppNamespace["currExecutingComponentName"];
}

type UseLoaderDataState<T> = T | null;

export function useLoaderData<T>() {
  // getting currently executing component's function from the global `window` namespace
  // where it has been set by the Meact.js library
  const currExecutingComponentName = useCurrComponent();

  const targetScriptElement = document.getElementById("page-data");
  if (!targetScriptElement) return null;
  const pageData = targetScriptElement.textContent;
  if (!pageData) return null;

  const loaderDataObject = JSON.parse(pageData);

  const thisComponentLoaderData = loaderDataObject[currExecutingComponentName];

  const [data, _] = useState<UseLoaderDataState<T>>(thisComponentLoaderData);

  return data;
}
