import {
  MeactLoader,
  MeactMeta,
  getSession,
  SessionCookieProperties,
} from "@meact-framework/server-runtime";
import { POSTS_PER_PAGE } from "../../app/config";
import { INewestPageLoader } from "../../app/pages/newest";
import { getUrlSearchParamsFromReq } from "../../app/utils/http-handlers";
import { getPageNumberFromSearchParams } from "../../app/utils/news-page-number";
import { feedService } from "../bootstrap.server";
import { FeedType } from "../models";

export const componentName = "NewestPage";

export const meta: MeactMeta = () => [
  {
    title: {
      text: "New Links | Hacker News Clone",
    },
  },
];

export const loader: MeactLoader<INewestPageLoader> = async (args) => {
  const { req } = args;

  const session = await getSession(req.headers.cookie);
  const userId = session.data[SessionCookieProperties.USER_ID];

  const searchParams = getUrlSearchParamsFromReq(req);
  const pageNumber: number = getPageNumberFromSearchParams(searchParams);

  const first = POSTS_PER_PAGE;
  const skip = POSTS_PER_PAGE * (pageNumber - 1);

  const stories = await feedService.getForType(
    FeedType.NEW,
    first,
    skip,
    userId
  );

  return {
    stories,
  };
};
