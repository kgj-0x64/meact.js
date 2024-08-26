import {
  commitSession,
  getSession,
  makeRedirectResponse,
  MeactAction,
  SessionCookieProperties,
} from "@meact-framework/server-runtime";
import {
  getErrorMessageForLoginErrorCode,
  UserLoginErrorCode,
} from "../../app/utils/user-login-error-code";
import { userService } from "../bootstrap.server";

export const componentName = null;

/**
 * xuser endpoint is to update the user information
 */
export const action: MeactAction<any> = async (args) => {
  const { req } = args;

  const session = await getSession(req.headers.cookie);

  const loggedInUserId = session.data[SessionCookieProperties.USER_ID];
  const loggedInUser = loggedInUserId
    ? await userService.getRegisteredUser(loggedInUserId)
    : undefined;

  if (!loggedInUser) {
    const errorCode = UserLoginErrorCode.LOGIN_PROFILE;
    session.data.error = getErrorMessageForLoginErrorCode(errorCode);

    return makeRedirectResponse(`/login?how=${errorCode}`, {
      "Set-Cookie": await commitSession(session),
    });
  }

  const { about } = req.body as {
    about: string;
  };

  await userService.updateUser({ id: loggedInUserId, about });

  return makeRedirectResponse(`/user?id=${loggedInUserId}`);
};
