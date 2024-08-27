import {
  getSession,
  makeDataResponse,
  makeRedirectResponse,
  MeactAction,
  MeactLoader,
  MeactMeta,
  SessionCookieProperties,
} from "@meact-framework/server-runtime";
import { newsItemService, userService } from "../bootstrap.server";
import { ISubmitPageAction } from "../../app/pages/submit";
import { isValidStoryUrl } from "../../app/utils/is-valid-url";

export const componentName = "SubmitPage";

export const meta: MeactMeta<any> = () => [
  { title: { text: "Submit | Hacker News Clone" } },
];

export const loader: MeactLoader<null> = async (args) => {
  const { req } = args;

  const session = await getSession(req.headers.cookie);

  const loggedInUserId = session.data[SessionCookieProperties.USER_ID];
  const loggedInUser = loggedInUserId
    ? await userService.getRegisteredUser(loggedInUserId)
    : undefined;

  // Check if the user is already logged in
  if (!loggedInUser) {
    return makeRedirectResponse("/login?how=submit&goto=submit");
  }

  return makeDataResponse(null);
};

export const action: MeactAction<any> = async (args) => {
  const { req } = args;

  const session = await getSession(req.headers.cookie);

  const loggedInUserId = session.data[SessionCookieProperties.USER_ID];
  const loggedInUser = loggedInUserId
    ? await userService.getRegisteredUser(loggedInUserId)
    : undefined;

  if (!loggedInUser) {
    return makeRedirectResponse("/login?how=submit&goto=submit");
  }

  const { title, text, url } = req.body as {
    title: string;
    text: string;
    url: string;
  };

  const errors: ISubmitPageAction = {};
  if (!title) errors.title = true;
  if (!text && !url) errors.textOrUrl = true;
  if (url && !isValidStoryUrl(url as string)) errors.url = true;

  if (Object.keys(errors).length > 0) {
    return makeDataResponse(errors);
  }

  const newsItem = await newsItemService.submitStory({
    submitterId: loggedInUserId,
    title,
    text,
    url,
  });

  // not doing `makeRedirectResponse` here since that sends an Express.js redirect instruction to the browser/client
  // while "subbmit" action/mutation handler would find JSON data in response as consisteent
  return makeDataResponse({
    redirectToUrl: `/item?id=${newsItem.id}`,
  });
};
