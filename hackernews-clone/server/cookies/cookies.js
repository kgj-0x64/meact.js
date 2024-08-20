/**
 * @remix-run/server-runtime v1.2.0
 *
 * Copyright (c) Remix Software Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.md file in the root directory of this source tree.
 *
 * @license MIT
 */

import { cookie } from "cookie";

/**
 * Creates a logical container for managing a browser cookie from the server.
 *
 * @see https://remix.run/api/remix#createcookie
 */
function createCookie(name, cookieOptions = {}) {
  let { secrets, ...options } = {
    secrets: [],
    path: "/",
    ...cookieOptions,
  };
  return {
    get name() {
      return name;
    },

    get isSigned() {
      return secrets.length > 0;
    },

    get expires() {
      // Max-Age takes precedence over Expires
      return typeof options.maxAge !== "undefined"
        ? new Date(Date.now() + options.maxAge * 1000)
        : options.expires;
    },

    async parse(cookieHeader, parseOptions) {
      if (!cookieHeader) return null;
      let cookies = cookie.parse(cookieHeader, { ...options, ...parseOptions });
      return name in cookies
        ? cookies[name] === ""
          ? ""
          : await decodeCookieValue(cookies[name], secrets)
        : null;
    },

    async serialize(value, serializeOptions) {
      return cookie.serialize(
        name,
        value === "" ? "" : await encodeCookieValue(value, secrets),
        { ...options, ...serializeOptions }
      );
    },
  };
}
/**
 * Returns true if an object is a Remix cookie container.
 *
 * @see https://remix.run/api/remix#iscookie
 */

function isCookie(object) {
  return (
    object != null &&
    typeof object.name === "string" &&
    typeof object.isSigned === "boolean" &&
    typeof object.parse === "function" &&
    typeof object.serialize === "function"
  );
}

async function encodeCookieValue(value, secrets) {
  let encoded = encodeData(value);

  if (secrets.length > 0) {
    encoded = await sign(encoded, secrets[0]);
  }

  return encoded;
}

async function decodeCookieValue(value, secrets) {
  if (secrets.length > 0) {
    for (let secret of secrets) {
      let unsignedValue = await unsign(value, secret);

      if (unsignedValue !== false) {
        return decodeData(unsignedValue);
      }
    }

    return null;
  }

  return decodeData(value);
}

function encodeData(value) {
  return btoa(JSON.stringify(value));
}

function decodeData(value) {
  try {
    return JSON.parse(atob(value));
  } catch (error) {
    return {};
  }
}

export { createCookie, isCookie };
