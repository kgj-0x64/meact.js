import {
  MeactLoader,
  MeactMeta,
  getSession,
  SessionCookieProperties,
  MeactJsonResponse,
  makeDataResponse,
} from "@meact-framework/server-runtime";
import { POSTS_PER_PAGE } from "../../app/config";
import { INewestPageLoader } from "../../app/pages/newest";
import { getUrlSearchParamsFromReq } from "../../app/utils/http-handlers";
import { getPageNumberFromSearchParams } from "../../app/utils/news-page-number";
import { feedService } from "../bootstrap.server";
import { FeedType } from "../models";

export const componentName = "NewestPage";

export const meta: MeactMeta<any> = () => [
  {
    title: {
      text: "New Links | Hacker News Clone",
    },
  },
];

export const loader: MeactLoader<INewestPageLoader> = async (
  args
): Promise<MeactJsonResponse<INewestPageLoader>> => {
  const { req } = args;

  const session = await getSession(req.headers.cookie);
  const loggedInUserId = session.data[SessionCookieProperties.USER_ID];

  const searchParams = getUrlSearchParamsFromReq(req);
  const pageNumber: number = getPageNumberFromSearchParams(searchParams);

  const first = POSTS_PER_PAGE;
  const skip = POSTS_PER_PAGE * (pageNumber - 1);

  const stories = await feedService.getForType(
    FeedType.NEW,
    first,
    skip,
    loggedInUserId
  );

  return makeDataResponse({
    stories,
  });
};
