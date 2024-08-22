import type { MeactMeta, MeactLoader } from "@meact-framework/server";
import { IItemPageLoader } from "../../app/pages/item.js";
import {
  checkBadRequest,
  checkNotFound,
  getUrlSearchParamsFromReq,
  URLSearchParamFields,
} from "../../app/utils/http-handlers.js";
import { getSession, SessionCookieProperties } from "../cookies/index.js";
import { newsItemService, commentService } from "../bootstrap.server.js";

export const componentName = "ItemPage";

export type PageLoaderDataType = IItemPageLoader;

export const meta: MeactMeta = (args) => {
  if (args && args.data) {
    return [
      {
        title: {
          text: `${
            (args.data as IItemPageLoader).newsItem.title
          } | Hacker News Clone`,
        },
      },
    ];
  }

  return [{ title: { text: "Story not found | Hacker News Clone" } }];
};

export const loader: MeactLoader<IItemPageLoader> = async (
  args
): Promise<IItemPageLoader> => {
  const { req } = args;

  const searchParams = getUrlSearchParamsFromReq(req);
  const newsItemId = searchParams.get(URLSearchParamFields.ID);
  checkBadRequest(newsItemId, '"id" is required.');

  const newsItem = await newsItemService.getStory(+newsItemId);
  checkNotFound(newsItem, "News Item not found");

  const session = await getSession(req.headers.cookie);
  const userId = session.get(SessionCookieProperties.USER_ID);

  const comments = await commentService.getCommentTree(
    newsItem.comments,
    userId
  );
  newsItem.comments = comments;

  return { newsItem };
};
