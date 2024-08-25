import {
  makeDataResponse,
  makeErrorResponse,
  MeactJsonResponse,
  MeactLoader,
  MeactMeta,
} from "@meact-framework/server-runtime";
import {
  getUrlSearchParamsFromReq,
  URLSearchParamFields,
} from "../../app/utils/http-handlers";
import { userService } from "../bootstrap.server";
import { IUserPageLoader } from "app/pages/user";

export const componentName = "UserPage";

export const meta: MeactMeta<any> = (args) => {
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

export const loader: MeactLoader<IUserPageLoader | null> = async (
  args
): Promise<MeactJsonResponse<IUserPageLoader | null>> => {
  const { req } = args;

  const searchParams = getUrlSearchParamsFromReq(req);
  const userId = searchParams.get(URLSearchParamFields.ID);
  if (!userId) {
    return makeErrorResponse('"id" must be provided.');
  }

  const rawUser = await userService.getUser(userId);
  if (!rawUser) {
    return makeErrorResponse("No such user.");
  }

  const user = {
    id: rawUser.id,
    about: rawUser.about,
    creationTime: rawUser.creationTime,
    email: rawUser.email ? rawUser.email : "",
    karma: rawUser.karma,
  };

  return makeDataResponse({ user });
};
