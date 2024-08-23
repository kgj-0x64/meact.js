import { join } from "path";
import { __dirname } from "../../config.js";

const ROOT_DIRECTORY = __dirname;

/// ---------- MEACT LAND ---------- ///

// absolute path of framework's directory
const MEACT_FRAMEWORK_DIRECTORY_NAME = "meact-framework";
const MEACT_FRAMEWORK_DIRECTORY = join(
  ROOT_DIRECTORY,
  MEACT_FRAMEWORK_DIRECTORY_NAME
);

// absolute path of meact library's directory
const MEACT_LIB_DIRECTORY_NAME = "meact";
export const MEACT_LIB_DIRECTORY = join(
  MEACT_FRAMEWORK_DIRECTORY,
  MEACT_LIB_DIRECTORY_NAME
);

// absolute path of meact-dom library's directory
const MEACT_DOM_LIB_DIRECTORY_NAME = "meact-dom";
export const MEACT_DOM_LIB_DIRECTORY = join(
  MEACT_FRAMEWORK_DIRECTORY,
  MEACT_DOM_LIB_DIRECTORY_NAME
);

const MEACT_FRAMEWORK_CLIENT_DIRECTORY_NAME = "client-runtime";
export const MEACT_FRAMEWORK_CLIENT_DIRECTORY = join(
  MEACT_FRAMEWORK_DIRECTORY,
  MEACT_FRAMEWORK_CLIENT_DIRECTORY_NAME
);

const MEACT_FRAMEWORK_SERVER_DIRECTORY_NAME = "server-runtime";
export const MEACT_FRAMEWORK_SERVER_DIRECTORY = join(
  MEACT_FRAMEWORK_DIRECTORY,
  MEACT_FRAMEWORK_SERVER_DIRECTORY_NAME
);

/// ---------- USER LAND ---------- ///

/// ---- server-side code ---- ///

// absolute path of server directory
const SERVER_DIRECTORY_NAME = "server";
const SERVER_API_DIRECTORY_NAME = "api";
export const SERVER_API_DIRECTORY = join(
  ROOT_DIRECTORY,
  SERVER_DIRECTORY_NAME,
  SERVER_API_DIRECTORY_NAME
);

/// ---- client-facing code ---- ///

// absolute path where the build output of client-facing code is saved
export const DIST_OUTPUT_DIRECTORY_NAME = "dist";
export const DIST_OUTPUT_DIRECTORY = join(
  ROOT_DIRECTORY,
  DIST_OUTPUT_DIRECTORY_NAME
);

// absolute path of pages directory
export const APP_DIRECTORY_NAME = "app";
export const APP_DIRECTORY = join(ROOT_DIRECTORY, APP_DIRECTORY_NAME);

export const PAGES_DIRECTORY_NAME = "pages";
export const STYLES_DIRECTORY_NAME = "styles";

// absolute path of static assets directory
const PUBLIC_ASSETS_DIRECTORY_NAME = "public";
export const PUBLIC_ASSETS_DIRECTORY = join(
  ROOT_DIRECTORY,
  PUBLIC_ASSETS_DIRECTORY_NAME
);
