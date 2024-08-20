import type { JSX } from "@meact/jsx-runtime";
import { MeactMeta } from "@meact-csr";
import { MainLayout } from "../layouts/main-layout";

export const meta: MeactMeta = () => [
  { title: { text: "Front | Hacker News Clone" } },
];

export function FrontPage(): JSX.Element {
  return (
    <MainLayout>
      Hacker News API does not publicly provide this data!
    </MainLayout>
  );
}

export default FrontPage;
