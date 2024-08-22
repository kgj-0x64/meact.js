import { JSX } from "@meact/jsx-runtime";

export function BlankLayout(props: JSX.PropsWithChildren<{}>): JSX.Element {
  const { children } = props;

  return <div className="WordSection1">{children}</div>;
}
