const redirectStatusCodes = new Set([301, 302, 303, 307, 308]);

export class MeactJsonResponse {
  data: any;
  setInHeaders: Record<string, any>;
  status: number;
  redirectToUrl?: string;

  constructor(
    data: any,
    setInHeaders: Record<string, any>,
    status: number,
    redirectToUrl?: string
  ) {
    this.data = data;
    this.setInHeaders = setInHeaders;
    this.status = status;
    this.redirectToUrl = redirectToUrl;
  }

  isRedirectResponse(): boolean {
    return (
      this.redirectToUrl !== undefined && redirectStatusCodes.has(this.status)
    );
  }
}

export class MeactErrorResponse {
  message: string;
  status: number;

  constructor(message: string, status: number) {
    this.message = message;
    this.status = status;
  }
}

/**
 * This is a shortcut for creating `application/json` responses.
 * Converts `data` to JSON and sets the `Content-Type` header.
 */
export function makeJsonResponse<T>(
  data: T,
  updateInHeaders?: Record<string, any>
): MeactJsonResponse {
  const jsonContentType = { "Content-Type": "application/json; charset=utf-8" };
  const setInHeaders =
    updateInHeaders === undefined
      ? jsonContentType
      : {
          ...updateInHeaders,
          ...jsonContentType,
        };

  return new MeactJsonResponse(data, setInHeaders, 200);
}

/**
 * A redirect response. Sets the status code and the `Location` header.
 * Defaults to "302 Found".
 */
export function makeRedirectResponse(
  url: string,
  updateInHeaders?: Record<string, any>,
  statusCode: number = 302
): MeactJsonResponse {
  const setInHeaders = updateInHeaders === undefined ? {} : updateInHeaders;

  return new MeactJsonResponse(null, setInHeaders, statusCode, url);
}
