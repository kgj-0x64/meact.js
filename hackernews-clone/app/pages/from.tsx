import { MeactElement } from "@meact";
import { MeactMeta } from "@meact-csr";
import { MainLayout } from "../layouts/main-layout";

export const meta: MeactMeta = () => {
  const params = new URLSearchParams(window.location.search);
  const site = params.get("site") || "site";

  return [{ title: { text: `Submissions from ${site} | Hacker News Clone` } }];
};

export function FrontPage(): MeactElement {
  return (
    <MainLayout>
      Hacker News API does not publicly provide this data!
    </MainLayout>
  );
}

export default FrontPage;
