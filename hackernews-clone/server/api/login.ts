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
  makeErrorResponse,
} from "@meact-framework/server-runtime";
import { userService } from "server/bootstrap.server";

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

  // Check if the user is already logged in
  if (session.data[SessionCookieProperties.USER_ID]) {
    // If logged in, redirect to the home page
    return makeRedirectResponse("/");
  }

  // During a login attempt, if the login fails (e.g., invalid credentials),
  // we should store an error message in the session
  // so that it can be retrieved on the next request
  // (e.g., when the user is redirected back to the login page)
  const data = { lastLoginError: session.data.error || null };

  // Once the error is retrieved (e.g., when displaying the login page again),
  // it should be cleared from the session so that it doesn’t persist unnecessarily.
  session.data.error = undefined;

  return makeDataResponse(data, {
    "Set-Cookie": await commitSession(session),
  });
};

export const action: MeactAction<null> = async (args) => {
  const { req } = args;

  const session = await getSession(req.headers.cookie);

  const { id, password, goto } = req.body as {
    id: string;
    password: string;
    goto?: string;
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

  const user = await userService.getUser(id);
  if (!user) {
    const errorMessage = "Unknown User ID";
    session.data.error = errorMessage;

    return makeRedirectResponse(
      "/login?how=unsuccessful",
      {
        "Set-Cookie": await commitSession(session),
      },
      303,
      errorMessage
    );
  }

  if (!(user.passwordSalt && user.hashedPassword)) {
    const errorMessage =
      "You must register for HackerNews clone separately for login to work";
    session.data.error = errorMessage;

    return makeRedirectResponse(
      "/login?how=unsuccessful",
      {
        "Set-Cookie": await commitSession(session),
      },
      303,
      errorMessage
    );
  }

  const isPasswordValid = await userService.validatePassword(id, password);

  if (!user || !isPasswordValid) {
    const errorMessage = "Password is incorrect";
    session.data.error = errorMessage;

    return makeRedirectResponse(
      "/login?how=unsuccessful",
      {
        "Set-Cookie": await commitSession(session),
      },
      303,
      errorMessage
    );
  }

  // Successful login, clear any previous error
  session.data.error = undefined;
  session.data[SessionCookieProperties.USER_ID] = user.id;

  return makeRedirectResponse(goto || "/", {
    "Set-Cookie": await commitSession(session),
  });
};
