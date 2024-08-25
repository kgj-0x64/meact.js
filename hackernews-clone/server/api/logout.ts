import {
  MeactAction,
  makeRedirectResponse,
  getSession,
  destroySession,
} from "@meact-framework/server-runtime";

export const componentName = null; // no component for this route

export const action: MeactAction<null> = async (args) => {
  const { req } = args;

  return makeRedirectResponse("/login", {
    "Set-Cookie": await destroySession(),
  });
};
