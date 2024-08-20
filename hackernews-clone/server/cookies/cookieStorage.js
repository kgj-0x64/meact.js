/**
 * Copied from
 * @remix-run/server-runtime v1.2.0
 *
 * Copyright (c) Remix Software Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.md file in the root directory of this source tree.
 *
 * @license MIT
 */

import { createCookie, isCookie } from "./cookies";
import { createSession, warnOnceAboutSigningSessionCookie } from "./sessions";

/**
 * Creates and returns a SessionStorage object that stores all session data
 * directly in the session cookie itself.
 *
 * This has the advantage that no database or other backend services are
 * needed, and can help to simplify some load-balanced scenarios. However, it
 * also has the limitation that serialized session data may not exceed the
 * browser's maximum cookie size. Trade-offs!
 *
 * @see https://remix.run/api/remix#createcookiesessionstorage
 */
function createCookieSessionStorage({ cookie: cookieArg } = {}) {
  let cookie = isCookie(cookieArg)
    ? cookieArg
    : createCookie(
        (cookieArg === null || cookieArg === void 0
          ? void 0
          : cookieArg.name) || "__session",
        cookieArg
      );
  warnOnceAboutSigningSessionCookie(cookie);
  return {
    async getSession(cookieHeader, options) {
      return createSession(
        (cookieHeader && (await cookie.parse(cookieHeader, options))) || {}
      );
    },

    async commitSession(session, options) {
      return cookie.serialize(session.data, options);
    },

    async destroySession(_session, options) {
      return cookie.serialize("", { ...options, expires: new Date(0) });
    },
  };
}

export { createCookieSessionStorage };
