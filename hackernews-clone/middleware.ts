import { readFileSync, existsSync } from "fs";
import { join } from "path";
import { Request } from "express";
import { MeactMeta } from "@meact-csr";
import {
  ROOT_DIRECTORY,
  DIST_OUTPUT_DIRECTORY,
  APP_DIRECTORY_NAME,
  PAGES_DIRECTORY_NAME,
  SERVER_API_ROUTES_DIRECTORY_RELATIVE,
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
    const jsBundlePath = join(DIST_OUTPUT_DIRECTORY, scriptBundleRelativePath);

    const stylesheetBundleRelativePath = `${APP_DIRECTORY_NAME}/${PAGES_DIRECTORY_NAME}/${pageName}.css`;
    const stylesheetBundlePath = join(
      DIST_OUTPUT_DIRECTORY,
      stylesheetBundleRelativePath
    );

    // Check if both the JS and CSS files for the requested page exist
    if (!existsSync(jsBundlePath)) {
      return null;
    }

    // Replace the placeholder values in the HTML
    indexHtmlContent = indexHtmlContent.replaceAll(
      "$pageScriptBundlePath",
      scriptBundleRelativePath
    );
    indexHtmlContent = indexHtmlContent.replaceAll(
      "$stylesheetBundlePath",
      existsSync(stylesheetBundlePath) ? stylesheetBundleRelativePath : ""
    );

    /// ! TODO
    const pageServerData = await getPageServerData(pageName, request);
    if (pageServerData) {
      indexHtmlContent = indexHtmlContent.replaceAll(
        "__PAGE_LOADER_DATA_JSON__",
        pageServerData.loader ? JSON.stringify(pageServerData.loader) : "{}"
      );

      if (pageServerData.meta) {
        indexHtmlContent = indexHtmlContent.replace(
          "<title>HackerNews x Meact.js</title>",
          pageServerData.meta
        );
      }
    }

    return indexHtmlContent;
  } catch (error) {
    console.error("An error occurred while loading assets:", error);
    return null;
  }
}

async function getPageServerData(
  pageName: string,
  request: Request
): Promise<{
  loader: object | null;
  meta: string | null;
} | null> {
  const pageServerModulePath = join(
    SERVER_API_ROUTES_DIRECTORY_RELATIVE,
    `${pageName}.ts`
  );

  if (!existsSync(pageServerModulePath)) {
    return null;
  }

  // Dynamically import the module
  const pageServerModule = await import(pageServerModulePath);

  const loaderFn = pageServerModule.loader;
  const metaFn = pageServerModule.meta;

  return {
    loader: typeof loaderFn === "function" ? await loaderFn({ request }) : null,
    meta: typeof metaFn === "function" ? await generateMetaTags(metaFn) : null,
  };
}

async function generateMetaTags(metaFn: MeactMeta): Promise<string | null> {
  const metaArray = metaFn();

  return metaArray
    .map((metaObj) => {
      if (metaObj.title) {
        // Handle <title> tag
        return `<title>${metaObj.title.text}</title>`;
      } else if (metaObj.link) {
        // Handle <link> tag
        const attributes = Object.entries(metaObj.link)
          .map(([key, value]) => `${key}="${value}"`)
          .join(" ");
        return `<link ${attributes} />`;
      } else if (metaObj.meta) {
        // Handle <meta> tag
        const attributes = Object.entries(metaObj.meta)
          .map(([key, value]) => `${key}="${value}"`)
          .join(" ");
        return `<meta ${attributes} />`;
      }
      return "";
    })
    .join("\n");
}
