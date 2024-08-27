import { JSX } from "@meact/jsx-runtime";

interface FormProps<T> {
  method: "POST" | "PUT" | "DELETE";
  action: string;
  onSubmit?: (e: any) => void;
  className?: string;
  style?: Record<string, any>;
}

export function Form<T>(props: JSX.PropsWithChildren<FormProps<T>>) {
  const { action, onSubmit, className, style, children } = props;

  const handleSubmit = (/** e: React.FormEvent<HTMLFormElement> */ e: any) => {
    // HTML `form` element's default behavior is enough here
    if (onSubmit !== undefined) {
      onSubmit(e);
    }
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
