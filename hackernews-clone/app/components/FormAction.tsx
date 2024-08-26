import { MeactJsonResponse } from "@meact-framework/server-runtime";
import { JSX } from "@meact/jsx-runtime";
import { useMutation } from "app/custom-hooks/useMutation.js";

interface FormActionProps<T> {
  method: "POST" | "PUT" | "DELETE";
  action: string;
  onSubmit?: (e: any) => void;
  onSuccess?: (data: T) => void;
  onError?: (error: string) => void;
  className?: string;
  style?: Record<string, any>;
}

export function FormAction<T>(
  props: JSX.PropsWithChildren<FormActionProps<T>>
) {
  const { method, action, onSubmit, onSuccess, className, style, children } =
    props;

  const { mutate, data } = useMutation<MeactJsonResponse<T>, any>(
    action,
    method
  );

  const handleSubmit = (/** e: React.FormEvent<HTMLFormElement> */ e: any) => {
    e.preventDefault();

    if (onSubmit !== undefined) {
      onSubmit(e);
    }

    // Create an object to gather data from each child
    // since each child is meant to maintain its own state with onChange handlers, if any
    const formDataObjectRef: Record<string, any> = {};
    buildFormData(children, formDataObjectRef);
    mutate(formDataObjectRef);
  };

  if (data && onSuccess) {
    onSuccess(data.data);
  }

  console.log("HTML form children", children);

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
