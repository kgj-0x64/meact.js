import Meact, { MeactElement } from "@meact";

declare module "@meact/jsx-runtime" {
  // `Fragment` function allows grouping elements without adding extra DOM nodes
  export function Fragment(props: {
    children?: MeactElement[];
  }): undefined | MeactElement[];

  // `jsx` function is used for creating elements with no or one child
  export function jsx(
    type: null | string | Function,
    props: {
      children?: any;
      [key: string]: any;
    },
    key?: string | number
  ): ReturnType<typeof Meact.createElement>;

  // `jsxs` function is used for creating elements with multiple children
  export function jsxs(
    type: null | string | Function,
    props: {
      children?: any;
      [key: string]: any;
    },
    key?: string | number
  ): ReturnType<typeof Meact.createElement>;
}

declare namespace JSX {
  interface IntrinsicElements {
    [elemName: string]: any; // or provide specific types for intrinsic elements if known
  }
}
