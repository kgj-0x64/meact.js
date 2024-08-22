import { useLoaderData } from "@meact-framework/client";
import { JSX } from "@meact/jsx-runtime";
import { NewsFeed } from "../components/news-feed.js";
import { POSTS_PER_PAGE } from "../config.js";
import { usePageNumber } from "../custom-hooks/usePageNumber.js";
import { MainLayout } from "../layouts/main-layout.js";
import { IStory } from "server/responses/index.js";

export interface IAskPageLoader {
  stories: (IStory | undefined)[];
}

export function AskPage(): JSX.Element {
  const loaderData = useLoaderData<IAskPageLoader>();
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

export default AskPage;
