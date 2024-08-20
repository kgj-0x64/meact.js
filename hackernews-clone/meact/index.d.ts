import type { TMeactElement } from "./element.d.ts";
import type { TMemoizedFunction } from "./memo.d.ts";

declare module "@meact" {
  type Element = TMeactElement;

  // useState - similar to React.useState
  export function useState<S>(
    initialState: S | (() => S)
  ): [S, (newState: S) => void];

  // useRef - similar to React.useRef
  export function useRef<T>(initialValue?: T): { current: T };

  // useEffect - similar to React.useEffect
  export function useEffect(
    effect: () => void | (() => void),
    deps?: any[]
  ): void;

  // useMemo - similar to React.useMemo
  export function useMemo<T>(factory: () => T, deps: any[]): T;

  // memo - similar to React.memo
  export function memo<P>(component: (props: P) => any): (props: P) => any;

  // context - similar to React.useContext and React.Proivder
  export function useContext<T>(contextObjectReference: any): T;
  export function createContext<T>(defaultValue: T): {
    Provider: Function;
  };

  // Meact - similar to React default export
  type Meact = {
    // createElement - similar to React.createElement
    createElement: (
      element: null | string | Function | TMemoizedFunction,
      props: null | { [key: string]: any },
      ...children: (string | Element)[]
    ) => Element;
  };
  export default Meact;
}
