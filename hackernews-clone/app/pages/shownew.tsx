import { useLoaderData } from "@meact-framework/client-runtime";
import { JSX } from "@meact/jsx-runtime";
import { NewsFeed } from "../components/news-feed.js";
import { POSTS_PER_PAGE } from "../config.js";
import { usePageNumber } from "../custom-hooks/usePageNumber.js";
import { MainLayout } from "../layouts/main-layout.js";
import { IStory } from "../../server/responses/index.js";

export interface IShowNewPageLoader {
  stories: (void | IStory)[];
}

export function ShowNewPage(): JSX.Element {
  const loaderData = useLoaderData<IShowNewPageLoader>();
  const stories = loaderData?.stories;

  const pageNumber: number = usePageNumber();

  return (
    <MainLayout>
      <NewsFeed
        stories={stories}
        pageNumber={pageNumber}
        postsPerPage={POSTS_PER_PAGE}
        notice={
          <>
            <tr key="noticetopspacer" style={topSpacerStyle} />
            <tr key="notice">
              <td colSpan={2} />
              <td>
                Please read the{" "}
                <a href="/showhn">
                  <u>rules</u>
                </a>
                . You can also browse the{" "}
                <a href="/shownew">
                  <u>newest</u>
                </a>{" "}
                Show HNs.
              </td>
            </tr>
            <tr key="noticebottomspacer" style={bottomSpacerStyle} />
          </>
        }
      />
    </MainLayout>
  );
}

const topSpacerStyle = { height: "5px" };
const bottomSpacerStyle = { height: "10px" };

export default ShowNewPage;
