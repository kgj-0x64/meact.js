import {
  MeactMeta,
  MeactLoader,
  MeactAction,
  SessionCookieProperties,
  getSession,
  commitSession,
  makeDataResponse,
  makeRedirectResponse,
  MeactJsonResponse,
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

export const componentName = "LoginPage";

export const meta: MeactMeta<any> = () => [
  {
    title: {
      text: "Login | Hacker News Clone",
    },
  },
];

export const loader: MeactLoader<any> = async (
  args
): Promise<MeactJsonResponse<any>> => {
  const { req } = args;

  const session = await getSession(req.headers.cookie);

  const loggedInUserId = session.data[SessionCookieProperties.USER_ID];
  const loggedInUser = loggedInUserId
    ? await userService.getRegisteredUser(loggedInUserId)
    : undefined;

  // Check if the user is already logged in
  if (loggedInUser) {
    // If logged in, redirect to the home page
    return makeRedirectResponse("/");
  }

  // ! Reset dangling "userId", if any, in this cookie session's data object to make sure `commitSession(...)` gets correct argument
  session.data[SessionCookieProperties.USER_ID] = undefined;

  // During a login attempt, if the login fails (e.g., invalid credentials),
  // we should store an error message in the session
  // so that it can be retrieved on the next request
  // (e.g., when the user is redirected back to the login page)
  const responseData = { lastLoginError: session.data.error || null };

  // Once the error is retrieved (e.g., when displaying the login page again),
  // it should be cleared from the session so that it doesn’t persist unnecessarily.
  session.data.error = undefined;

  return makeDataResponse(responseData, {
    "Set-Cookie": await commitSession(session),
  });
};

export const action: MeactAction<null> = async (args) => {
  const { req } = args;

  const searchParams = getUrlSearchParamsFromReq(req);
  const gotoQueryParam = searchParams.get(URLSearchParamFields.GOTO) || "/";

  const session = await getSession(req.headers.cookie);

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
      "Set-Cookie": await commitSession(session),
    });
  }

  const user = await userService.getRegisteredUser(id);

  if (!user) {
    const errorCode = UserLoginErrorCode.REGISTRATION_PENDING;
    session.data.error = getErrorMessageForLoginErrorCode(errorCode);

    return makeRedirectResponse(`/login?how=${errorCode}`, {
      "Set-Cookie": await commitSession(session),
    });
  }

  const isPasswordValid = await userService.validatePassword(id, password);
  if (!user || !isPasswordValid) {
    const errorCode = UserLoginErrorCode.INCORRECT_PASSWORD;
    session.data.error = getErrorMessageForLoginErrorCode(errorCode);

    return makeRedirectResponse(`/login?how=${errorCode}`, {
      "Set-Cookie": await commitSession(session),
    });
  }

  // Successful login, clear any previous error
  session.data.error = undefined;
  session.data[SessionCookieProperties.USER_ID] = user.id;

  return makeRedirectResponse(gotoQueryParam, {
    "Set-Cookie": await commitSession(session),
  });
};
