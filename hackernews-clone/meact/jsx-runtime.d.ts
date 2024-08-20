import type Meact from "./index.d.ts";
import type { TMeactElement } from "./element.d.ts";

declare module "@meact/jsx-runtime" {
  type Element = TMeactElement;

  // `Fragment` function allows grouping elements without adding extra DOM nodes
  export function Fragment(props: {
    children?: Element[];
  }): undefined | Element[];

  // `jsx` function is used for creating elements with no or one child
  export function jsx(
    type: null | string | Function,
    props: {
      children?: any;
      [key: string]: any;
    },
    key?: string | number
  ): ReturnType<Meact["createElement"]>;

  // `jsxs` function is used for creating elements with multiple children
  export function jsxs(
    type: null | string | Function,
    props: {
      children?: any;
      [key: string]: any;
    },
    key?: string | number
  ): ReturnType<Meact["createElement"]>;
}

declare namespace JSX {
  export type Element = TMeactElement;
  export type Node = Element | Element[];
  interface IntrinsicElements {
    [elemName: string]: any; // or provide specific types for intrinsic elements if known
  }
}
