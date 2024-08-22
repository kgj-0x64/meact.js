import { MeactMeta } from "@meact-framework";

export const componentName = "FromPage";

export const meta: MeactMeta = () => {
  const params = new URLSearchParams(window.location.search);
  const site = params.get("site") || "site";

  return [{ title: { text: `Submissions from ${site} | Hacker News Clone` } }];
};
