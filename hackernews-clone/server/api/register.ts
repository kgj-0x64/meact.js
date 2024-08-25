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
import { userService } from "server/bootstrap.server";

export const componentName = null;

export const action: MeactAction<null> = async (
  args
): Promise<MeactJsonResponse<null>> => {
  const { req } = args;

  const session = await getSession(req.headers.cookie);
  const currentUserId = session.data[SessionCookieProperties.USER_ID];

  if (!currentUserId) {
    try {
      const { id, password } = req.body as {
        id: string;
        password: string;
      };

      const errors: Record<string, boolean> = {};
      if (!id) errors.id = true;
      if (!password) errors.password = true;
      if (Object.keys(errors).length > 0) {
        session.data.error = "Missing credentials";

        return makeErrorResponse("Missing credentials", 400, {
          "Set-Cookie": await commitSession(session),
        });
      }

      await userService.registerUser({ id, password });

      session.data[SessionCookieProperties.USER_ID] = id;

      return makeRedirectResponse(`/user?id=${id}`, {
        headers: { "Set-Cookie": await commitSession(session) },
      });
    } catch (err) {
      return makeRedirectResponse(`/login?how=${(err as any).code}`, {
        headers: { "Set-Cookie": await destroySession() },
      });
    }
  } else {
    return makeRedirectResponse(
      "/login?how=user",
      {
        headers: { "Set-Cookie": await destroySession() },
      },
      303,
      "User is already logged in"
    );
  }
};
