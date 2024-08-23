import { Request } from "express";
import { MeactErrorResponse, MeactJsonResponse } from "./responses";

declare global {
  namespace Express {
    interface Request {
      _preparedHtmlContent?: string; // custom property
      _preparedJsonResponseContent: MeactJsonResponse | MeactErrorResponse;
    }
  }
}
