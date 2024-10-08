import type { JSX } from "@meact/jsx-runtime";
import { MainLayout } from "../layouts/main-layout.js";
import { NewsFeed } from "../components/news-feed.js";
import { usePageNumber } from "../custom-hooks/usePageNumber.js";
import { POSTS_PER_PAGE } from "../config.js";
import type { IStory } from "../../server/responses/index.js";
import { useLoaderData } from "@meact-framework/client-runtime";

export interface IIndexPageLoader {
  stories: (IStory | void)[];
}

export default function IndexPage(): JSX.Element {
  const loaderData = useLoaderData<IIndexPageLoader>();
  const stories = loaderData?.stories;

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
