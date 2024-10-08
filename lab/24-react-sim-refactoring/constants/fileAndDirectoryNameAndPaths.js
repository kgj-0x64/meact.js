import { join } from "path";
import { __dirname } from "../config.js";

export const ROOT_DIRECTORY = __dirname;

// absolute path of constants directory
const CONSTANTS_DIRECTORY_NAME = "constants";
export const CONSTANTS_DIRECTORY = join(__dirname, CONSTANTS_DIRECTORY_NAME);

// absolute path of pages directory
export const APP_DIRECTORY_NAME = "app";
export const PAGES_DIRECTORY_NAME = "pages";
export const STYLES_DIRECTORY_NAME = "styles";

// absolute path where the build output is saved
export const BUILD_OUTPUT_DIRECTORY_NAME = "dist";
export const BUILD_OUTPUT_DIRECTORY = join(
  __dirname,
  BUILD_OUTPUT_DIRECTORY_NAME
);

// absolute path of meact library's directory
const MEACT_LIB_DIRECTORY_NAME = "meact";
export const MEACT_LIB_DIRECTORY = join(__dirname, MEACT_LIB_DIRECTORY_NAME);

// absolute path of meact-dom library's directory
const MEACT_DOM_LIB_DIRECTORY_NAME = "meact-dom";
export const MEACT_DOM_LIB_DIRECTORY = join(
  __dirname,
  MEACT_DOM_LIB_DIRECTORY_NAME
);

// absolute path of CSR functionality directory
const MEACT_CSR_LIB_DIRECTORY_NAME = "meact-csr";
export const MEACT_CSR_LIB_DIRECTORY = join(
  __dirname,
  MEACT_CSR_LIB_DIRECTORY_NAME
);
