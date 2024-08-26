import { Request } from "express";
import { MeactJsonResponse } from "./responses";

declare global {
  namespace Express {
    interface Request {
      _preparedPageHtmlContent?: string; // custom property
      _preparedRouteResponseContent?: MeactJsonResponse<any>;
    }
  }
}
