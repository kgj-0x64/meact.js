import {
  MeactMeta,
  MeactLoader,
  MeactAction,
  makeJsonResponse,
  makeRedirectResponse,
} from "meact-framework/server-runtime";
import { commitSession, getSession, SessionCookieProperties } from "../cookies";
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

  const data = { error: session.get("error") };

  const newSerializedCookie = await commitSession(session);
  console.log("newSerializedCookie", newSerializedCookie);

  return makeJsonResponse(data, {
    "Set-Cookie": newSerializedCookie,
  });
};

export const action: MeactAction = async (args) => {
  const { req } = args;

  const session = await getSession(req.headers.cookie);

  const formData = await req.formData();
  const id = formData.get("id") as string | null;
  const password = formData.get("password") as string | null;
  const goto = formData.get("goto") as string | null;

  const errors = {};
  if (!id) errors.id = true;
  if (!password) errors.password = true;
  if (Object.keys(errors).length > 0) {
    return makeJsonResponse(errors);
  }

  const user = await userService.getUser(id as string);
  if (!user) {
    return makeRedirectResponse("/login?how=unsuccessful");
  }

  if (!(await userService.validatePassword(id as string, password as string))) {
    return makeRedirectResponse("/login?how=unsuccessful");
  }

  session.set(SessionCookieProperties.USER_ID, user.id);
  return makeRedirectResponse(goto || "/", {
    "Set-Cookie": await commitSession(session),
  });
};
