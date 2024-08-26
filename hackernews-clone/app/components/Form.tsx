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

  // HTMl `form` element's default behavior is enough here
  const handleSubmit = (/** e: React.FormEvent<HTMLFormElement> */ e: any) => {
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
