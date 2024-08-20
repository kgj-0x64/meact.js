import type { JSX } from "@meact/jsx-runtime";
import { MeactMeta } from "@meact-csr";
import { MainLayout } from "../layouts/main-layout";

export const meta: MeactMeta = () => {
  const params = new URLSearchParams(window.location.search);

  return [
    {
      title: { text: `${params.get("id")}'s submissions | Hacker News Clone` },
    },
  ];
};

export function SubmittedPage(): JSX.Element {
  return (
    <MainLayout>
      Hacker News API does not publicly provide this data!
    </MainLayout>
  );
}

export default SubmittedPage;
