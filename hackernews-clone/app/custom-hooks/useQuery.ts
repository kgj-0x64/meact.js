import { useState, useEffect, useMemo } from "@meact";

type QueryStatus = "idle" | "loading" | "error" | "success";

interface UseQueryOptions<T> {
  enabled?: boolean;
  onSuccess?: (data: T) => void;
  onError?: (error: string) => void;
}

interface UseQueryState<T> {
  status: QueryStatus;
  data: T | null;
  error: string | null;
}

export function useQuery<T>(
  url: string,
  options: UseQueryOptions<T> = {}
): UseQueryState<T> {
  const { enabled = true, onSuccess, onError } = options;

  const [state, setState] = useState<UseQueryState<T>>({
    status: "idle",
    data: null,
    error: null,
  });

  useEffect(() => {
    // defined so that the hook's "fetching" functionality is triggered by the component
    // and this is not bound to run when the Meact library is running that component while building the render tree
    if (!enabled) return;

    const fetchData = async () => {
      setState({
        status: "loading",
        data: null,
        error: null,
      });

      try {
        const response = await fetch(url);

        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }

        const result = await response.json();
        setState({
          status: "success",
          data: result,
          error: null,
        });
        onSuccess?.(result);
      } catch (err: any) {
        setState({
          status: "error",
          data: null,
          error: err.message,
        });
        onError?.(err.message);
      }
    };

    fetchData();
  }, [url, enabled]);

  return useMemo(() => state, [state]);
}
