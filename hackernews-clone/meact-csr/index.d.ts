declare module "@meact-csr" {
  type MetaTagType = "meta" | "link" | "title";

  interface MetaTagAttributes {
    [key: string]: string;
  }

  interface MetaTagObject {
    [key: MetaTagType]: MetaTagAttributes;
  }

  export type MeactMeta = () => MetaTagObject[];

  export function generateMetaTags(metaArray: MetaTagObject[]): void;

  export function hydrate(): Promise<void>;
}
