import type { JSX } from "@meact/jsx-runtime";
import { MeactMeta } from "@meact-csr";
import { MainLayout } from "../layouts/main-layout";

export const meta: MeactMeta = () => {
  const params = new URLSearchParams(window.location.search);
  const site = params.get("site") || "site";

  return [{ title: { text: `Submissions from ${site} | Hacker News Clone` } }];
};

export function FrontPage(): JSX.Element {
  return (
    <MainLayout>
      Hacker News API does not publicly provide this data!
    </MainLayout>
  );
}

export default FrontPage;
