import { MeactLoader, MeactMeta } from "@meact-framework/server-runtime";
import {
  checkBadRequest,
  checkNotFound,
  getUrlSearchParamsFromReq,
  URLSearchParamFields,
} from "../../app/utils/http-handlers";
import { userService } from "../bootstrap.server";
import { IUserPageLoader } from "app/pages/user";

export const componentName = "UserPage";

export const meta: MeactMeta = (args) => {
  let idParam: string | null | undefined = "";

  const req = args?.req;
  const searchParams =
    req !== undefined ? getUrlSearchParamsFromReq(req) : null;
  idParam = searchParams?.get("id");
  const idParamValue = idParam !== undefined && idParam ? idParam : "";

  return [
    {
      title: {
        text: `Profile: ${idParamValue} | Hacker News Clone`,
      },
    },
  ];
};

export const loader: MeactLoader<IUserPageLoader> = async (args) => {
  const { req } = args;

  const searchParams = getUrlSearchParamsFromReq(req);
  const userId = searchParams.get(URLSearchParamFields.ID);
  checkBadRequest(userId, '"id" must be provided.');

  const rawUser = await userService.getUser(userId);
  checkNotFound(rawUser, "No such user.");

  const user = {
    id: rawUser.id,
    about: rawUser.about,
    creationTime: rawUser.creationTime,
    email: rawUser.email ? rawUser.email : "",
    karma: rawUser.karma,
  };

  return { user };
};
