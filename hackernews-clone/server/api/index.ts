import type { MeactMeta, MeactLoader } from "@meact-framework/server";
import { POSTS_PER_PAGE } from "../../app/config";
import { IIndexPageLoader } from "../../app/pages";
import { getUrlSearchParamsFromReq } from "app/utils/http-handlers";
import { getPageNumberFromSearchParams } from "../../app/utils/news-page-number";
import { feedService } from "../bootstrap.server";
import { getSession, SessionCookieProperties } from "../cookies";
import { FeedType } from "../models";

export const componentName = "IndexPage";

export const meta: MeactMeta = () => [
  {
    meta: {
      name: "description",
      content:
        "The top stories from technology and startup business hackers around the world.",
    },
  },
];

export const loader: MeactLoader<IIndexPageLoader> = async (
  args
): Promise<IIndexPageLoader> => {
  const { req } = args;

  const session = await getSession(req.headers.cookie);
  const userId = session.get(SessionCookieProperties.USER_ID);

  const searchParams = getUrlSearchParamsFromReq(req);
  const pageNumber: number = getPageNumberFromSearchParams(searchParams);

  const first = POSTS_PER_PAGE;
  const skip = POSTS_PER_PAGE * (pageNumber - 1);

  const stories = await feedService.getForType(
    FeedType.TOP,
    first,
    skip,
    userId
  );

  return {
    stories,
  };
};
