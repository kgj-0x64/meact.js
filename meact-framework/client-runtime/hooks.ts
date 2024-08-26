import { MeactJsonResponse } from "meact-framework/server-runtime/responses";

export function useCurrComponent(): string {
  // @ts-ignore
  const meactAppNamespace: any = window.MeactApp;
  return meactAppNamespace["currExecutingComponentName"];
}

export function useLoaderData<T>() {
  // getting currently executing component's function from the global `window` namespace
  // where it has been set by the Meact.js library
  const currExecutingComponentName = useCurrComponent();

  const targetScriptElement = document.getElementById("page-loader-data");
  if (!targetScriptElement) return null;
  const pageData = targetScriptElement.textContent;
  if (!pageData) return null;

  const loaderDataObject: Record<string, MeactJsonResponse<any>> = JSON.parse(
    pageData
  );

  const thisComponentLoaderData: MeactJsonResponse<T> =
    loaderDataObject[currExecutingComponentName];

  return thisComponentLoaderData.data;
}
