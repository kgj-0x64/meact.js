import { MeactElement } from "@meact";
import { MeactMeta } from "@meact-csr";
import { MainLayout } from "../layouts/main-layout";

export const meta: MeactMeta = () => [
  { title: { text: "Leaders | Hacker News Clone" } },
];

export function LeadersPage(): MeactElement {
  return (
    <MainLayout>
      Hacker News API does not publicly provide this data!
    </MainLayout>
  );
}

export default LeadersPage;
