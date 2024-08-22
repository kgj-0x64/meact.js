import { MeactMeta } from "@meact-framework/client";
import { IItemPageLoader } from "../../app/pages/item.js";
import {
  checkBadRequest,
  checkNotFound,
  getSearchParamsFromRequest,
  URLSearchParamFields,
} from "../../app/utils/http-handlers.js";
import { getSession, SessionCookieProperties } from "../cookies/index.js";
import { newsItemService, commentService } from "../bootstrap.server.js";
import { MeactLoader } from "meact-framework/client/types.js";

export const componentName = "ItemPage";

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
  console.log("LOADER request args", args.req === undefined, args.req.path);
  const searchParams = getSearchParamsFromRequest(request);
  console.log("searchParams", searchParams);
  const newsItemId = searchParams.get(URLSearchParamFields.ID);
  console.log("newsItemId", newsItemId);
  checkBadRequest(newsItemId, '"id" is required.');

  const newsItem = await newsItemService.getStory(+newsItemId);
  console.log("newsItem", newsItem);
  checkNotFound(newsItem, "News Item not found");

  const session = await getSession(request.headers.cookie);
  const userId = session.get(SessionCookieProperties.USER_ID);
  console.log("userId", userId);

  const comments = await commentService.getCommentTree(
    newsItem.comments,
    userId
  );
  newsItem.comments = comments;

  return { newsItem };
};
