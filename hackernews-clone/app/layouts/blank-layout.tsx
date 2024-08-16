import { MeactElement, MeactNode } from "@meact";

export interface IBlankLayoutProps {
  children: MeactNode;
}

export function BlankLayout(props: IBlankLayoutProps): MeactElement {
  const { children } = props;

  return <div class="WordSection1">{...children}</div>;
}
