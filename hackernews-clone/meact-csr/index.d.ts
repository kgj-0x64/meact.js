declare module "@meact-csr" {
  type MetaTagType = "meta" | "link" | "title";

  interface MetaTagAttributes {
    [key: string]: string;
  }

  /// Type Issue:
  // An index signature parameter type cannot be a literal type or generic type. Consider using a mapped object type instead.
  // interface MetaTagObject {
  //   [key: MetaTagType]: MetaTagAttributes;
  // }
  /// FIX:
  interface MetaTagObject {
    title?: MetaTagAttributes;
    link?: MetaTagAttributes;
    meta?: MetaTagAttributes;
  }

  export type MeactMeta = () => MetaTagObject[];

  export function hydrate(): Promise<void>;
}
