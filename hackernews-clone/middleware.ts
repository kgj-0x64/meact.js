import { readFileSync, existsSync } from "fs";
import { join } from "path";
import { Request } from "express";
import {
  ROOT_DIRECTORY,
  BUILD_OUTPUT_DIRECTORY,
  APP_DIRECTORY_NAME,
  PAGES_DIRECTORY_NAME,
  SERVER_API_PAGES_DIRECTORY,
} from "./constants/fileAndDirectoryNameAndPaths.js";

/**
 * call this on server to prepare index.html content in response to a page request
 */
export async function prepareHtmlOnPageRequest(
  pageName: string,
  request: Request
): Promise<string | null> {
  try {
    let indexHtmlContent = readFileSync(
      join(ROOT_DIRECTORY, "index.html"),
      "utf-8"
    );

    // Construct the expected paths for the JS and CSS bundles
    const scriptBundleRelativePath = `${APP_DIRECTORY_NAME}/${PAGES_DIRECTORY_NAME}/${pageName}.js`;
    const jsBundlePath = join(BUILD_OUTPUT_DIRECTORY, scriptBundleRelativePath);

    const stylesheetBundleRelativePath = `${APP_DIRECTORY_NAME}/${PAGES_DIRECTORY_NAME}/${pageName}.css`;
    const stylesheetBundlePath = join(
      BUILD_OUTPUT_DIRECTORY,
      stylesheetBundleRelativePath
    );

    // Check if both the JS and CSS files for the requested page exist
    if (!existsSync(jsBundlePath)) {
      return null;
    }

    // Replace the placeholder values in the HTML
    indexHtmlContent = indexHtmlContent.replaceAll(
      "$scriptBundlePath",
      scriptBundleRelativePath
    );
    indexHtmlContent = indexHtmlContent.replaceAll(
      "$stylesheetBundlePath",
      existsSync(stylesheetBundlePath) ? stylesheetBundleRelativePath : ""
    );

    const data = await setPageLoaderData(pageName, request);
    indexHtmlContent = indexHtmlContent.replaceAll(
      "__PAGE_LOADER_DATA_JSON__",
      data ? JSON.stringify(data) : "{}"
    );

    return indexHtmlContent;
  } catch (error) {
    console.error("An error occurred while loading assets:", error);
    return null;
  }
}

async function setPageLoaderData(
  pageName: string,
  request: Request
): Promise<any> {
  const loaderModulePath = join(SERVER_API_PAGES_DIRECTORY, `${pageName}.ts`);

  if (!existsSync(loaderModulePath)) {
    return null;
  }

  // Dynamically import the loader function
  const loaderModule = require(`./api/pages/${pageName}.ts`);
  const loaderFn = loaderModule.loader;

  // Call the loader function and get the data
  return await loaderFn({ request });
}
