import { MeactMeta } from "@meact-framework";
import { Request } from "express";
import { POSTS_PER_PAGE } from "../../app/config";
import { IJobsPageLoader } from "../../app/pages/jobs";
import { getSearchParamsFromRequest } from "../../app/utils/http-handlers";
import { getPageNumberFromSearchParams } from "../../app/utils/news-page-number";
import { feedService } from "../bootstrap.server";
import { getSession, SessionCookieProperties } from "../cookies";
import { FeedType } from "../models";

export const componentName = "JobsPage";

export const meta: MeactMeta = () => [
  {
    title: {
      text: "jobs | Hacker News Clone",
    },
  },
];

export const loader = async ({
  request,
}: {
  request: Request;
}): Promise<IJobsPageLoader> => {
  const session = await getSession(request.headers.cookie);
  const userId = session.get(SessionCookieProperties.USER_ID);

  const searchParams = getSearchParamsFromRequest(request);
  const pageNumber: number = getPageNumberFromSearchParams(searchParams);

  const first = POSTS_PER_PAGE;
  const skip = POSTS_PER_PAGE * (pageNumber - 1);

  const stories = await feedService.getForType(
    FeedType.JOB,
    first,
    skip,
    userId
  );

  return {
    stories,
  };
};
