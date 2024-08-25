import {
  MeactMeta,
  MeactLoader,
  getSession,
  SessionCookieProperties,
  makeDataResponse,
  MeactJsonResponse,
} from "@meact-framework/server-runtime";
import { commentService } from "../bootstrap.server";
import { INewCommentsPageLoader } from "../../app/pages/newcomments";

export const componentName = "NewCommentsPage";

export const meta: MeactMeta<any> = () => [
  {
    title: {
      text: "New Comments | Hacker News Clone",
    },
  },
];

export const loader: MeactLoader<INewCommentsPageLoader> = async (
  args
): Promise<MeactJsonResponse<INewCommentsPageLoader>> => {
  const { req } = args;

  const session = await getSession(req.headers.cookie);

  const loggedInUserId = session.data[SessionCookieProperties.USER_ID];

  const comments = await commentService.getNewComments(loggedInUserId);

  return makeDataResponse({ comments });
};
