import type { JSX } from "@meact/jsx-runtime";
import { MainLayout } from "../layouts/main-layout";
import { NewsFeed } from "../components/news-feed";
import { usePageNumber } from "../custom-hooks/usePageNumber";
import { POSTS_PER_PAGE } from "../config";
import type { IStory } from "server/responses";
import { useLoaderData } from "memix/client/useLoaderData";
import sGif from "public/static/s.gif";

export interface IJobsPageLoader {
  stories: (IStory | void)[];
}

export default function JobsPage(): JSX.Element {
  const { stories } = useLoaderData<IJobsPageLoader>();
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
