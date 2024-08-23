import type { JSX } from "@meact/jsx-runtime";
import { MainLayout } from "../layouts/main-layout.js";
import { NewsFeed } from "../components/news-feed.js";
import { usePageNumber } from "../custom-hooks/usePageNumber.js";
import { POSTS_PER_PAGE } from "../config.js";
import type { IStory } from "../../server/responses/index.js";
import { useLoaderData } from "@meact-framework/client-runtime";
import sGif from "../../public/static/s.gif";

export interface IJobsPageLoader {
  stories: (IStory | void)[];
}

export default function JobsPage(): JSX.Element {
  const loaderData = useLoaderData<IJobsPageLoader>();
  const stories = loaderData?.stories;
  const pageNumber: number = usePageNumber();

  return (
    <MainLayout>
      <NewsFeed
        isJobListing
        isRankVisible={false}
        isUpvoteVisible={false}
        stories={stories}
        pageNumber={pageNumber}
        postsPerPage={POSTS_PER_PAGE}
        notice={
          <>
            <tr key="noticetopspacer" style={{ height: "20px" }} />
            <tr key="notice">
              <td />
              <td>
                <img alt="" src={sGif} height="1" width="14" />
              </td>
              <td>
                These are jobs at startups that were funded by Y Combinator. You
                can also get a job at a YC startup through{" "}
                <a href="https://triplebyte.com/?ref=yc_jobs">
                  <u>Triplebyte</u>
                </a>
                .
              </td>
            </tr>
            <tr key="noticebottomspacer" style={{ height: "20px" }} />
          </>
        }
      />
    </MainLayout>
  );
}
