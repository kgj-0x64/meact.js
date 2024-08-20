import type { JSX } from "@meact/jsx-runtime";
import { MainLayout } from "../layouts/main-layout.js";

export function FrontPage(): JSX.Element {
  return (
    <MainLayout>
      Hacker News API does not publicly provide this data!
    </MainLayout>
  );
}

export default FrontPage;
