import { Request } from "express";

declare global {
  namespace Express {
    interface Request {
      preparedHtmlContent?: string; // custom property
    }
  }
}
