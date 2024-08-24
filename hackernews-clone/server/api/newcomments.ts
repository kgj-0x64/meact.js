import {
  MeactMeta,
  MeactLoader,
  getSession,
  SessionCookieProperties,
} from "@meact-framework/server-runtime";
import { commentService } from "../bootstrap.server";
import { INewCommentsPageLoader } from "../../app/pages/newcomments";

export const componentName = "NewCommentsPage";

export const meta: MeactMeta = () => [
  {
    title: {
      text: "New Comments | Hacker News Clone",
    },
  },
];

export const loader: MeactLoader<INewCommentsPageLoader> = async (args) => {
  const { req } = args;

  const session = await getSession(req.headers.cookie);

  const userId = session.data[SessionCookieProperties.USER_ID];

  const comments = await commentService.getNewComments(userId);

  return { comments };
};
