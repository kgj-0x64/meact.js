import {
  MeactAction,
  makeRedirectResponse,
} from "meact-framework/server-runtime";
import { getSession, destroySession } from "../cookies";

export const componentName = ""; // no component for this route

export const action: MeactAction = async (args) => {
  const { req } = args;

  console.log("LOGOUT req.headers.cookie", req.headers.cookie);
  const session = await getSession(req.headers.cookie);
  console.log("LOGOUT session", session);

  const newSerializedCookie = await destroySession(session);
  console.log("LOGOUT newSerializedCookie", newSerializedCookie);

  return makeRedirectResponse("/login", {
    "Set-Cookie": newSerializedCookie,
  });
};
