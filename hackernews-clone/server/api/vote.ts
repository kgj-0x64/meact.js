import {
  commitSession,
  getSession,
  makeErrorResponse,
  makeRedirectResponse,
  MeactAction,
  SessionCookieProperties,
} from "@meact-framework/server-runtime";
import {
  getUrlSearchParamsFromReq,
  URLSearchParamFields,
  URLSearchParamHowValue,
} from "../../app/utils/http-handlers";
import {
  getErrorMessageForLoginErrorCode,
  UserLoginErrorCode,
} from "../../app/utils/user-login-error-code";
import { itemService, userService } from "../bootstrap.server";

export const componentName = null;

/**
 * vote endpoint is to vote up a news item or comment
 */
export const action: MeactAction<null> = async (args) => {
  const { req } = args;

  const session = await getSession(req.headers.cookie);

  const searchParams = getUrlSearchParamsFromReq(req);
  const id = searchParams.get(URLSearchParamFields.ID);
  const how = searchParams.get(URLSearchParamFields.HOW);
  const goto = searchParams.get(URLSearchParamFields.GOTO);

  const loggedInUserId = session.data[SessionCookieProperties.USER_ID];
  const loggedInUser = loggedInUserId
    ? await userService.getRegisteredUser(loggedInUserId)
    : undefined;

  if (!loggedInUser) {
    const errorCode = UserLoginErrorCode.LOGIN_UPVOTE;
    session.data.error = getErrorMessageForLoginErrorCode(errorCode);

    return makeRedirectResponse(`/login?how=${errorCode}&goto=${goto}`, {
      "Set-Cookie": await commitSession(session),
    });
  }

  if (!id) {
    return makeErrorResponse('"id" must be provided.');
  }

  if (how === URLSearchParamHowValue.UNVOTE) {
    // Unvote
    return makeErrorResponse("Unvoting is not allowed");
  } else {
    await itemService.upvoteItem(+id, loggedInUserId);
    return makeRedirectResponse(goto || "/");
  }
};
