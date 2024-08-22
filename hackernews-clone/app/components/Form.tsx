import { JSX } from "@meact/jsx-runtime";
import { useMutation } from "../custom-hooks/useMutation";

interface FormProps<T> {
  method: "POST" | "PUT" | "DELETE";
  action: string;
  onSubmit?: (e: any) => void;
  onSuccess?: (data: T) => void;
  onError?: (error: string) => void;
  style: Record<string, any>;
}

export function Form<T>(props: JSX.PropsWithChildren<FormProps<T>>) {
  const { method, action, onSubmit, onSuccess, onError, style, children } =
    props;

  const { mutate } = useMutation<T, any>(action, method, {
    onSuccess,
    onError,
  });

  const handleSubmit = (/** e: React.FormEvent<HTMLFormElement> */ e: any) => {
    if (onSubmit !== undefined) {
      onSubmit(e);
    }

    e.preventDefault();

    // Create an object to gather data from each child
    // since each child is meant to maintain its own state with onChange handlers, if any
    const formData: Record<string, any> = {};

    let childrenArray: JSX.Element[] = [];
    if (!Array.isArray(children)) {
      childrenArray = [children];
    } else {
      childrenArray = children;
    }

    childrenArray.forEach((child) => {
      if (child.props.name) {
        formData[child.props.name] = child.props.value; // Assume each child passes its value prop
      }
    });

    mutate(formData);
  };

  return (
    <form style={style} onSubmit={handleSubmit}>
      {children}
    </form>
  );
}
