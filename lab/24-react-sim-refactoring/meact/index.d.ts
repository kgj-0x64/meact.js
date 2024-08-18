declare module "@meact" {
  // createElement - similar to React.createElement
  export function createElement(
    type: string | Function,
    props?: { [key: string]: any },
    ...children: any[]
  ): any;

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

  // Meact - similar to React default export
  const Meact: {
    createElement: typeof createElement;
  };

  export default Meact;
}
