import {
  MeactMeta,
  MeactLoader,
  getSession,
  SessionCookieProperties,
  MeactJsonResponse,
  makeDataResponse,
  makeErrorResponse,
} from "@meact-framework/server-runtime";
import { IItemPageLoader } from "../../app/pages/item.js";
import {
  getUrlSearchParamsFromReq,
  URLSearchParamFields,
} from "../../app/utils/http-handlers.js";
import { newsItemService, commentService } from "../bootstrap.server.js";

export const componentName = "ItemPage";

export type PageLoaderDataType = IItemPageLoader;

export const meta: MeactMeta<IItemPageLoader | null> = (args) => {
  if (
    args &&
    args.pageLoaderData &&
    args.pageLoaderData.data &&
    args.pageLoaderData.data.newsItem
  ) {
    return [
      {
        title: {
          text: `${args.pageLoaderData.data.newsItem.title} | Hacker News Clone`,
        },
      },
    ];
  }

  return [{ title: { text: "Story not found | Hacker News Clone" } }];
};

export const loader: MeactLoader<IItemPageLoader | null> = async (
  args
): Promise<MeactJsonResponse<IItemPageLoader | null>> => {
  const { req } = args;

  const searchParams = getUrlSearchParamsFromReq(req);
  const newsItemId = searchParams.get(URLSearchParamFields.ID);
  if (!newsItemId) {
    return makeErrorResponse('"id" is required.');
  }

  const newsItem = await newsItemService.getStory(+newsItemId);
  if (!newsItem) {
    return makeErrorResponse("News Item not found");
  }

  const session = await getSession(req.headers.cookie);
  const loggedInUserId = session.data[SessionCookieProperties.USER_ID];

  const comments = await commentService.getCommentTree(
    newsItem.comments,
    loggedInUserId
  );
  newsItem.comments = comments;

  return makeDataResponse<IItemPageLoader>({ newsItem });
};
