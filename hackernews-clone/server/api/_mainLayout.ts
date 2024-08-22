import { Request } from "express";
import { getSession, SessionCookieProperties } from "../cookies/index.js";
import { userService } from "../bootstrap.server.js";
import { IMainLoader } from "../../app/layouts/main-layout.jsx";

export const componentName = "MainLayout";

export const loader = async ({
  request,
}: {
  request: Request;
}): Promise<IMainLoader> => {
  const session = await getSession(request.headers.cookie);

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
