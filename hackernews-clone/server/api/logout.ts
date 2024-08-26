import {
  MeactAction,
  makeRedirectResponse,
  destroySession,
  getSession,
  SessionCookieProperties,
  makeErrorResponse,
} from "@meact-framework/server-runtime";
import { userService } from "../bootstrap.server";

export const componentName = null; // no component for this route

export const action: MeactAction<null> = async (args) => {
  const { req } = args;

  const session = await getSession(req.headers.cookie);

  const loggedInUserId = session.data[SessionCookieProperties.USER_ID];
  const loggedInUser = loggedInUserId
    ? await userService.getRegisteredUser(loggedInUserId)
    : null;

  if (!loggedInUser) {
    const errorMessage = "User must be logged in to perform logout action.";
    return makeErrorResponse(errorMessage, 403);
  }

  return makeRedirectResponse("/login", {
    "Set-Cookie": await destroySession(),
  });
};
