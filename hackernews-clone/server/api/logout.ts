import {
  MeactAction,
  makeRedirectResponse,
  getSession,
  destroySession,
} from "@meact-framework/server-runtime";

export const componentName = null; // no component for this route

export const action: MeactAction = async (args) => {
  const { req } = args;

  const session = await getSession(req.headers.cookie);

  return makeRedirectResponse("/login", {
    "Set-Cookie": await destroySession(),
  });
};
