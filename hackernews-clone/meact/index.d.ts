declare module "@meact" {
  export type MeactElement = any;
  export type MeactNode = MeactElement[];

  // createElement - similar to React.createElement
  export function createElement(
    type: null | string | Function,
    props: null | { [key: string]: any },
    ...children: (string | MeactElement)[]
  ): MeactElement;

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
  const Meact: {
    createElement: typeof createElement;
  };

  export default Meact;
}
