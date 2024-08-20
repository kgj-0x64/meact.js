import type { JSX } from "@meact/jsx-runtime";
import { MeactMeta } from "@meact-csr";
import { MainLayout } from "../layouts/main-layout";

export const meta: MeactMeta = () => [
  { title: { text: "Hidden | Hacker News Clone" } },
];

export function HiddenPage(): JSX.Element {
  return (
    <MainLayout>
      Hacker News API does not publicly provide this data!
    </MainLayout>
  );
}

export default HiddenPage;
