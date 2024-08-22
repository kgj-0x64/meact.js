import { MeactMeta, MeactLoader } from "@meact-framework/server";
import { commentService } from "../bootstrap.server";
import { getSession, SessionCookieProperties } from "../cookies";
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

  const userId = session.get(SessionCookieProperties.USER_ID);

  const comments = await commentService.getNewComments(userId);

  return { comments };
};
