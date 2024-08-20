import { MeactMeta } from "@meact-csr";

export const componentName = "SubmittedPage";

export const meta: MeactMeta = () => {
  const params = new URLSearchParams(window.location.search);

  return [
    {
      title: { text: `${params.get("id")}'s submissions | Hacker News Clone` },
    },
  ];
};
