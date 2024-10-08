import { Request } from "express";
import { MeactJsonResponse } from "./responses";

interface MetaTagAttributes {
  [key: string]: string;
}

/// Type Issue:
// An index signature parameter type cannot be a literal type or generic type.
// Consider using a mapped object type instead.

// type MetaTagType = "meta" | "link" | "title";
// interface MetaTagObject {
//   [key: MetaTagType]: MetaTagAttributes;
// }

/// so, doing this:

interface MetaTagObject {
  title?: MetaTagAttributes;
  link?: MetaTagAttributes;
  meta?: MetaTagAttributes;
}

type IMeactMetaArgs<T> =
  | undefined
  | {
      req?: Request;
      pageLoaderData?: MeactJsonResponse<T>;
    };

export type MeactMeta<T> = (args: IMeactMetaArgs<T>) => MetaTagObject[];

interface IMeactLoaderArgs {
  req: Request;
}

export type MeactLoader<T> = (
  args: IMeactLoaderArgs
) => Promise<MeactJsonResponse<T>>;

interface IMeactActionArgs {
  req: Request;
}

export type MeactAction<T> = (
  args: IMeactActionArgs
) => Promise<MeactJsonResponse<T>>;
