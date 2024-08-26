import {
  MeactAction,
  MeactJsonResponse,
  getSession,
  SessionCookieProperties,
  makeErrorResponse,
  commitSession,
  makeRedirectResponse,
  destroySession,
} from "@meact-framework/server-runtime";
import {
  getErrorMessageForLoginErrorCode,
  UserLoginErrorCode,
} from "../../app/utils/user-login-error-code";
import { userService } from "../bootstrap.server";
import {
  getUrlSearchParamsFromReq,
  URLSearchParamFields,
} from "../../app/utils/http-handlers";

export const componentName = null;

export const action: MeactAction<null> = async (
  args
): Promise<MeactJsonResponse<null>> => {
  const { req } = args;

  const session = await getSession(req.headers.cookie);

  const loggedInUserId = session.data[SessionCookieProperties.USER_ID];
  const loggedInUser = loggedInUserId
    ? await userService.getRegisteredUser(loggedInUserId)
    : null;

  if (loggedInUser) {
    const errorMessage =
      "Logged in user must logout before registering a new user.";
    return makeErrorResponse(errorMessage, 403);
  }

  // ! Reset dangling "userId", if any, in this cookie session's data object to make sure `commitSession(...)` gets correct argument
  session.data[SessionCookieProperties.USER_ID] = undefined;

  try {
    const { id, password } = req.body as {
      id: string;
      password: string;
    };

    const errors: Record<string, boolean> = {};
    if (!id) errors.id = true;
    if (!password) errors.password = true;
    if (Object.keys(errors).length > 0) {
      const errorCode = UserLoginErrorCode.MISSING_CREDENTIALS;
      session.data.error = getErrorMessageForLoginErrorCode(errorCode);

      return makeRedirectResponse(`/login?how=${errorCode}`, {
        "Set-Cookie": await destroySession(),
      });
    }

    await userService.registerUser({ id, password });

    // Successful login, clear any previous error
    session.data.error = undefined;
    session.data[SessionCookieProperties.USER_ID] = id;

    const searchParams = getUrlSearchParamsFromReq(req);
    const gotoQueryParam = searchParams.get(URLSearchParamFields.GOTO);
    const gotoRoute: string = gotoQueryParam
      ? gotoQueryParam
      : `/user?id=${id}`;

    return makeRedirectResponse(gotoRoute, {
      "Set-Cookie": await commitSession(session),
    });
  } catch (err) {
    const errorCode = UserLoginErrorCode.USERNAME_TAKEN;
    session.data.error = getErrorMessageForLoginErrorCode(errorCode);

    return makeRedirectResponse(`/login?how=${errorCode}`, {
      "Set-Cookie": await destroySession(),
    });
  }
};
