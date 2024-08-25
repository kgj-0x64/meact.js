import {
  MeactMeta,
  MeactLoader,
  getSession,
  SessionCookieProperties,
  MeactJsonResponse,
  makeDataResponse,
} from "@meact-framework/server-runtime";
import { POSTS_PER_PAGE } from "../../app/config";
import { IIndexPageLoader } from "../../app/pages";
import { getUrlSearchParamsFromReq } from "app/utils/http-handlers";
import { getPageNumberFromSearchParams } from "../../app/utils/news-page-number";
import { feedService } from "../bootstrap.server";
import { FeedType } from "../models";

export const componentName = "IndexPage";

export const meta: MeactMeta<any> = () => [
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
): Promise<MeactJsonResponse<IIndexPageLoader>> => {
  const { req } = args;

  const session = await getSession(req.headers.cookie);
  const loggedInUserId = session.data[SessionCookieProperties.USER_ID];

  const searchParams = getUrlSearchParamsFromReq(req);
  const pageNumber: number = getPageNumberFromSearchParams(searchParams);

  const first = POSTS_PER_PAGE;
  const skip = POSTS_PER_PAGE * (pageNumber - 1);

  const stories = await feedService.getForType(
    FeedType.TOP,
    first,
    skip,
    loggedInUserId
  );

  return makeDataResponse<IIndexPageLoader>({ stories });
};
