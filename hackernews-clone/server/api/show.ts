import {
  MeactLoader,
  MeactMeta,
  getSession,
  SessionCookieProperties,
} from "@meact-framework/server-runtime";
import { IShowPageLoader } from "../../app/pages/show";
import { getUrlSearchParamsFromReq } from "../../app/utils/http-handlers";
import { getPageNumberFromSearchParams } from "../../app/utils/news-page-number";
import { feedService } from "../bootstrap.server";
import { FeedType } from "../models";
import { POSTS_PER_PAGE } from "../../app/config";

export const componentName = "ShowHNPage";

export const meta: MeactMeta = () => [
  {
    title: {
      text: "Show | Hacker News Clone",
    },
  },
];

export const loader: MeactLoader<IShowPageLoader> = async (args) => {
  const { req } = args;

  const session = await getSession(req.headers.cookie);
  const userId = session.data[SessionCookieProperties.USER_ID];

  const searchParams = getUrlSearchParamsFromReq(req);
  const pageNumber: number = getPageNumberFromSearchParams(searchParams);

  const first = POSTS_PER_PAGE;
  const skip = POSTS_PER_PAGE * (pageNumber - 1);

  return {
    stories: await feedService.getForType(FeedType.SHOW, first, skip, userId),
  };
};
