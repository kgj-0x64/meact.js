import type { MeactMeta } from "meact-framework/server-runtime";

export const componentName = "FromPage";

export const meta: MeactMeta = (args) => {
  const params = args && args.req ? args.req.query : null;
  const site = (params && params.site) || "site";

  return [{ title: { text: `Submissions from ${site} | Hacker News Clone` } }];
};
