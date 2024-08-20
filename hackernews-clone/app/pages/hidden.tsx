import type { JSX } from "@meact/jsx-runtime";
import { MainLayout } from "../layouts/main-layout";

export function HiddenPage(): JSX.Element {
  return (
    <MainLayout>
      Hacker News API does not publicly provide this data!
    </MainLayout>
  );
}

export default HiddenPage;
