import { MeactLoader, MeactMeta } from "@meact-framework/server";
import { POSTS_PER_PAGE } from "../../app/config";
import { IAskPageLoader } from "../../app/pages/ask";
import { getUrlSearchParamsFromReq } from "../../app/utils/http-handlers";
import { getPageNumberFromSearchParams } from "../../app/utils/news-page-number";
import { feedService } from "../bootstrap.server";
import { getSession, SessionCookieProperties } from "../cookies";
import { FeedType } from "../models";

export const componentName = "AskPage";

export const meta: MeactMeta = () => [
  {
    title: {
      text: "ask | Hacker News Clone",
    },
  },
];

export const loader: MeactLoader<IAskPageLoader> = async (args) => {
  const { req } = args;

  const session = await getSession(req.headers.cookie);
  const userId = session.get(SessionCookieProperties.USER_ID);

  const searchParams = getUrlSearchParamsFromReq(req);
  const pageNumber: number = getPageNumberFromSearchParams(searchParams);

  const first = POSTS_PER_PAGE;
  const skip = POSTS_PER_PAGE * (pageNumber - 1);

  const stories = await feedService.getForType(
    FeedType.ASK,
    first,
    skip,
    userId
  );

  return {
    stories,
  };
};
