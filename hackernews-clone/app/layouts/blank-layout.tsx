import { JSX } from "@meact/jsx-runtime";

export interface IBlankLayoutProps {
  children?: JSX.Node;
}

export function BlankLayout(props: IBlankLayoutProps): JSX.Element {
  const { children } = props;

  return <div class="WordSection1">{...children}</div>;
}
