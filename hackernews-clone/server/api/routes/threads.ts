import { MeactMeta } from "@meact-csr";

export const componentName = "ThreadsPage";

export const meta: MeactMeta = () => {
  const params = new URLSearchParams(window.location.search);

  return [
    { title: { text: `${params.get("id")}'s comments | Hacker News Clone` } },
  ];
};
