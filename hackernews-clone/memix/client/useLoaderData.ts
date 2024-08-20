import { useState } from "@meact";
import { useCurrComponent } from "./useCurrComponent";

type UseLoaderDataState<T> = T;

export function useLoaderData<T>() {
  // getting currently executing component's function from the global `window` namespace
  // where it has been set by the Meact.js library
  const currExecutingComponentName = useCurrComponent();
  console.log("currExecutingComponentName", currExecutingComponentName);

  // ! TODO
  const [data, setData] = useState<UseLoaderDataState<T>>(() => {
    // Check if data is available on the window object
    return <T>{};
  });

  return data;
}
