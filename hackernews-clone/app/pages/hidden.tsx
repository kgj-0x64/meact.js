import { MeactElement } from "@meact";
import { MeactMeta } from "@meact-csr";
import { MainLayout } from "../layouts/main-layout";

export const meta: MeactMeta = () => [
  { title: { text: "Hidden | Hacker News Clone" } },
];

export function HiddenPage(): MeactElement {
  return (
    <MainLayout>
      Hacker News API does not publicly provide this data!
    </MainLayout>
  );
}

export default HiddenPage;
