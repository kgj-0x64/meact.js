import { Request } from "express";
import { MeactMeta } from "@meact-csr";
import { POSTS_PER_PAGE } from "app/config";
import { IIndexPageLoader } from "app/pages";
import { getSearchParamsFromRequest } from "app/utils/http-handlers";
import { getPageNumberFromSearchParams } from "app/utils/news-page-number";
import { feedService } from "server/bootstrap.server";
import { getSession, SessionCookieProperties } from "server/cookies";
import { FeedType } from "server/models";

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

export const loader = async ({
  request,
}: {
  request: Request;
}): Promise<IIndexPageLoader> => {
  const session = await getSession(request.headers.cookie);
  const userId = session.get(SessionCookieProperties.USER_ID);

  const searchParams = getSearchParamsFromRequest(request);
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
