import {
  MeactMeta,
  MeactLoader,
  MeactAction,
  SessionCookieProperties,
  getSession,
  commitSession,
  makeJsonResponse,
  makeRedirectResponse,
} from "@meact-framework/server-runtime";
import { userService } from "server/bootstrap.server";

export const componentName = "LoginPage";

export const meta: MeactMeta = () => [
  {
    title: {
      text: "Login | Hacker News Clone",
    },
  },
];

export const loader: MeactLoader<Response> = async (args) => {
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
  const data = { error: session.data.error || null };

  // Once the error is retrieved (e.g., when displaying the login page again),
  // it should be cleared from the session so that it doesn’t persist unnecessarily.
  session.data.error = undefined;

  return makeJsonResponse(data, {
    "Set-Cookie": await commitSession(session),
  });
};

export const action: MeactAction = async (args) => {
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

    return makeJsonResponse(errors, {
      "Set-Cookie": await commitSession(session),
    });
  }

  const user = await userService.getUser(id);
  if (!user || !(await userService.validatePassword(id, password))) {
    session.data.error = "Invalid credentials";

    return makeRedirectResponse("/login?how=unsuccessful", {
      "Set-Cookie": await commitSession(session),
    });
  }

  // Successful login, clear any previous error
  session.data.error = undefined;
  session.data[SessionCookieProperties.USER_ID] = user.id;

  return makeRedirectResponse(goto || "/", {
    "Set-Cookie": await commitSession(session),
  });
};
