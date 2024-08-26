import { JSX } from "@meact/jsx-runtime";
import { useMutation } from "../custom-hooks/useMutation.js";

interface FormProps<T> {
  method: "POST" | "PUT" | "DELETE";
  action: string;
  onSubmit?: (e: any) => void;
  onSuccess?: (data: T) => void;
  onError?: (error: string) => void;
  className?: string;
  style?: Record<string, any>;
}

export function Form<T>(props: JSX.PropsWithChildren<FormProps<T>>) {
  const {
    method,
    action,
    onSubmit,
    onSuccess,
    onError,
    className,
    style,
    children,
  } = props;

  const { mutate } = useMutation<T, any>(action, method, {
    onSuccess,
    onError,
  });

  const handleSubmit = (/** e: React.FormEvent<HTMLFormElement> */ e: any) => {
    if (onSubmit !== undefined) {
      onSubmit(e);
    }

    // e.preventDefault();

    // // Create an object to gather data from each child
    // // since each child is meant to maintain its own state with onChange handlers, if any
    // const formDataObjectRef: Record<string, any> = {};
    // buildFormData(children, formDataObjectRef);
    // mutate(formDataObjectRef);
  };

  return (
    <form
      method="post"
      action={action}
      className={className}
      style={style}
      prop:onSubmit={handleSubmit}
    >
      {children}
    </form>
  );
}

function buildFormData(
  children: JSX.Node | undefined,
  formDataObjectRef: Record<string, any>
) {
  let childrenArray: JSX.Element[] = [];
  if (!Array.isArray(children)) {
    childrenArray = [children];
  } else {
    childrenArray = children;
  }

  childrenArray.forEach((child) => {
    if (child.props.name) {
      formDataObjectRef[child.props.name] = child.props["prop:value"]; // Assuming each child passes its value prop
    }
    buildFormData(child.children, formDataObjectRef);
  });
}
