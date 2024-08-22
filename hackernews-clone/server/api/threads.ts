import type { MeactMeta } from "@meact-framework/server";
import { getUrlSearchParamsFromReq } from "app/utils/http-handlers";

export const componentName = "ThreadsPage";

export const meta: MeactMeta = (args) => {
  const req = args && args.req ? args.req : null;
  if (!req) return [];

  const searchParams = getUrlSearchParamsFromReq(req);

  return [
    {
      title: {
        text: `${searchParams.get("id")}'s comments | Hacker News Clone`,
      },
    },
  ];
};
