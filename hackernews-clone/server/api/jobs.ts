import {
  MeactMeta,
  MeactLoader,
  getSession,
  SessionCookieProperties,
} from "@meact-framework/server-runtime";
import { POSTS_PER_PAGE } from "../../app/config";
import { IJobsPageLoader } from "../../app/pages/jobs";
import { getUrlSearchParamsFromReq } from "app/utils/http-handlers";
import { getPageNumberFromSearchParams } from "../../app/utils/news-page-number";
import { feedService } from "../bootstrap.server";
import { FeedType } from "../models";

export const componentName = "JobsPage";

export const meta: MeactMeta = () => [
  {
    title: {
      text: "jobs | Hacker News Clone",
    },
  },
];

export const loader: MeactLoader<IJobsPageLoader> = async (
  args
): Promise<IJobsPageLoader> => {
  const { req } = args;

  const session = await getSession(req.headers.cookie);
  const userId = session.data[SessionCookieProperties.USER_ID];

  const searchParams = getUrlSearchParamsFromReq(req);
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
