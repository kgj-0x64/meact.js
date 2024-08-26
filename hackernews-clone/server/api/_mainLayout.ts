import {
  MeactLoader,
  getSession,
  SessionCookieProperties,
  MeactJsonResponse,
  makeDataResponse,
} from "@meact-framework/server-runtime";
import { userService } from "../bootstrap.server.js";
import { IMainLoader } from "../../app/layouts/main-layout.jsx";

export const componentName = "MainLayout";

export const loader: MeactLoader<IMainLoader> = async (
  args
): Promise<MeactJsonResponse<IMainLoader>> => {
  const { req } = args;

  const session = await getSession(req.headers.cookie);

  const loggedInUserId = session.data[SessionCookieProperties.USER_ID];
  const loggedInUser = loggedInUserId
    ? await userService.getRegisteredUser(loggedInUserId)
    : undefined;

  const me =
    loggedInUser !== undefined && loggedInUser
      ? { id: loggedInUser.id, karma: loggedInUser.karma }
      : undefined;

  return makeDataResponse<IMainLoader>({ me });
};
