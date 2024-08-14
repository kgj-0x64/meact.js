import { useState, useMemo } from "@meact";

type MutationStatus = "idle" | "loading" | "error" | "success";

interface UseMutationOptions<T> {
  onSuccess?: (data: T) => void;
  onError?: (error: string) => void;
}

interface UseMutationState<T> {
  status: MutationStatus;
  data: T | null;
  error: string | null;
}

interface UseMutationResult<T, V> {
  mutate: (variables: V) => void;
  status: MutationStatus;
  data: T | null;
  error: string | null;
}

export function useMutation<T, V>(
  url: string,
  method: "POST" | "PUT" | "PATCH" | "DELETE",
  options: UseMutationOptions<T> = {}
): UseMutationResult<T, V> {
  const { onSuccess, onError } = options;

  const [state, setState] = useState<UseMutationState<T>>({
    status: "idle",
    data: null,
    error: null,
  });

  const mutate = async (variables: V) => {
    setState({
      status: "loading",
      data: null,
      error: null,
    });

    try {
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(variables),
      });

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

  return useMemo(
    () => ({
      mutate,
      status: state.status,
      data: state.data,
      error: state.error,
    }),
    [state]
  );
}
