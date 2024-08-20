import type { JSX } from "@meact/jsx-runtime";
import { MainLayout } from "../layouts/main-layout";
import { NewsFeed } from "../components/news-feed";
import { usePageNumber } from "../custom-hooks/usePageNumber";
import { POSTS_PER_PAGE } from "../config";
import type { IStory } from "server/responses";
import { useLoaderData } from "app/custom-hooks/useLoaderData";

export interface IIndexPageLoader {
  stories: (IStory | void)[];
}

export default function IndexPage(): JSX.Element {
  const { stories } = useLoaderData<IIndexPageLoader>();
  const pageNumber: number = usePageNumber();

  return (
    <MainLayout>
      <NewsFeed
        stories={stories}
        pageNumber={pageNumber}
        postsPerPage={POSTS_PER_PAGE}
      />
    </MainLayout>
  );
}
