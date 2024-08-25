const redirectStatusCodes = new Set([301, 302, 303, 307, 308]);

export class MeactJsonResponse<T> {
  data: T;
  meta: {
    setInHeaders: Record<string, any>;
    status: number;
    redirectToUrl?: string;
  } | null;
  error: MeactErrorResponse | null;

  constructor(
    data: T,
    meta: {
      setInHeaders: Record<string, any>;
      status: number;
      redirectToUrl?: string;
    },
    error: MeactErrorResponse | null
  ) {
    this.data = data;
    this.meta = meta;
    this.error = error;
  }

  isRedirectResponse(): boolean {
    return (
      this.meta !== null &&
      this.meta.redirectToUrl !== undefined &&
      redirectStatusCodes.has(this.meta.status)
    );
  }
}

class MeactErrorResponse {
  message: string;

  constructor(message: string) {
    this.message = message;
  }
}

/**
 * This is a shortcut for creating `application/json` responses.
 * Converts `data` to JSON and sets the `Content-Type` header.
 */
export function makeDataResponse<T>(
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

  return new MeactJsonResponse(
    data,
    {
      setInHeaders,
      status: 200,
    },
    null
  );
}

/**
 * A redirect response.
 * Sets the status code and the `Location` header.
 * Defaults to "302 Found".
 */
export function makeRedirectResponse(
  url: string,
  updateInHeaders?: Record<string, any>,
  status: number = 302,
  errorMessage?: string
): MeactJsonResponse<null> {
  const setInHeaders = updateInHeaders === undefined ? {} : updateInHeaders;

  return new MeactJsonResponse(
    null,
    {
      setInHeaders,
      status,
      redirectToUrl: url,
    },
    errorMessage === undefined ? null : new MeactErrorResponse(errorMessage)
  );
}

/**
 * An Error response.
 * Sets the status code and the `Location` header.
 * Defaults to "500 server side error".
 */
export function makeErrorResponse(
  message: string,
  status: number = 500,
  updateInHeaders?: Record<string, any>
): MeactJsonResponse<null> {
  const jsonContentType = {
    "Content-Type": "application/json; charset=utf-8",
  };
  const setInHeaders =
    updateInHeaders === undefined
      ? jsonContentType
      : {
          ...updateInHeaders,
          ...jsonContentType,
        };

  return new MeactJsonResponse(
    null,
    {
      setInHeaders,
      status,
    },
    new MeactErrorResponse(message)
  );
}
