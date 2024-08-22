import type { MeactLoader } from "@meact-framework/server";
import { getSession, SessionCookieProperties } from "../cookies/index.js";
import { userService } from "../bootstrap.server.js";
import { IMainLoader } from "../../app/layouts/main-layout.jsx";

export const componentName = "MainLayout";

export const loader: MeactLoader<IMainLoader> = async (
  args
): Promise<IMainLoader> => {
  const { req } = args;

  const session = await getSession(req.headers.cookie);
  const loggedInUserId = session.get(SessionCookieProperties.USER_ID);
  const loggedInUser = loggedInUserId
    ? await userService.getUser(loggedInUserId)
    : undefined;

  const me =
    loggedInUser !== undefined && loggedInUser
      ? { id: loggedInUser.id, karma: loggedInUser.karma }
      : undefined;

  return { me };
};
