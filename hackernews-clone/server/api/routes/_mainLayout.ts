import { Request } from "express";
import { getSession, SessionCookieProperties } from "server/cookies";
import { userService } from "server/bootstrap.server";
import { IMainLoader } from "app/layouts/main-layout";

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
