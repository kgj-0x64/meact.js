const redirectStatusCodes = new Set([301, 302, 303, 307, 308]);

export class MeactJsonResponse<T> {
  data: T;
  meta: {
    setInHeaders: Record<string, any>;
    status: number;
    redirectToUrl?: string;
  } | null;

  constructor(
    data: T,
    setInHeaders: Record<string, any>,
    status: number,
    redirectToUrl?: string
  ) {
    this.data = data;
    this.meta = {
      setInHeaders,
      status,
      redirectToUrl,
    };
  }

  isRedirectResponse(): boolean {
    return (
      this.meta !== null &&
      this.meta.redirectToUrl !== undefined &&
      redirectStatusCodes.has(this.meta.status)
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
): MeactJsonResponse<T> {
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
): MeactJsonResponse<null> {
  const setInHeaders = updateInHeaders === undefined ? {} : updateInHeaders;

  return new MeactJsonResponse(null, setInHeaders, statusCode, url);
}
