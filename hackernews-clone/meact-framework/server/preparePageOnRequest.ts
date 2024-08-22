import { readFileSync, existsSync } from "fs";
import { join } from "path";
import { Request } from "express";
import { MeactMeta } from "../client/index.js";
import {
  MEACT_FRAMEWORK_SERVER_DIRECTORY,
  DIST_OUTPUT_DIRECTORY,
  APP_DIRECTORY_NAME,
  PAGES_DIRECTORY_NAME,
} from "../constants/fileAndDirectoryNameAndPaths.js";
import { mapOfComponentNameToServerSideHandlers } from "./build.js";
import { runExtraLoadersFromComponentsForThisPage } from "../../app/_app.js";

/**
 * call this on server to prepare index.html content in response to a page request
 */
export async function prepareHtmlOnPageRequest(
  req: Request
): Promise<string | null> {
  try {
    // Get the page name (path)
    const pathName = req.path === "/" ? "/index" : req.path; // starts with "/"
    const pageName = pathName.substring(1);

    let indexHtmlContent = readFileSync(
      // relative path "./index.html" is not working
      join(MEACT_FRAMEWORK_SERVER_DIRECTORY, "index.html"),
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

    // Run MeactMeta and Loader functions for the requested page and related components with their own Loader functions (if any)
    const pageServerData = await getPageServerData(req);
    if (pageServerData) {
      if (pageServerData.metaTagsForThisPage) {
        indexHtmlContent = indexHtmlContent.replace(
          "<title>HackerNews x Meact.js</title>",
          pageServerData.metaTagsForThisPage
        );
      }

      indexHtmlContent = indexHtmlContent.replace(
        `<script id="page-data" type="application/json"></script>`,
        `<script id="page-data" type="application/json">${JSON.stringify(
          Object.fromEntries(pageServerData.loaderDataMap)
        )}</script>`
      );
    }

    return indexHtmlContent;
  } catch (error) {
    console.error(
      `LOG: Error while preparing HTML content on ${req.method} ${req.path} request`,
      error
    );
    return null;
  }
}

async function getPageServerData(req: Request): Promise<{
  loaderDataMap: Map<string, any>;
  metaTagsForThisPage: string | null;
} | null> {
  // Get the page name (path)
  const pathName = req.path === "/" ? "/index" : req.path; // starts with "/"
  const pageName = pathName.substring(1);

  const serverSideHandlersForThisPage =
    mapOfComponentNameToServerSideHandlers.get(pageName);

  if (serverSideHandlersForThisPage === undefined) return null;

  // generate loader data
  const loaderDataMap = new Map<string, any>();
  const thisPageComponentName = serverSideHandlersForThisPage.componentName;

  let componentsToRunLoadersFor =
    runExtraLoadersFromComponentsForThisPage(pageName);
  componentsToRunLoadersFor = [pageName, ...componentsToRunLoadersFor];

  for await (const mapKey of componentsToRunLoadersFor) {
    const serverSideHandlersForThisComponent =
      mapOfComponentNameToServerSideHandlers.get(mapKey);

    if (
      serverSideHandlersForThisComponent !== undefined &&
      serverSideHandlersForThisComponent.loader !== undefined
    ) {
      const loaderData = await serverSideHandlersForThisComponent.loader({
        req,
      });

      if (loaderData) {
        const componentName =
          mapKey === pageName ? thisPageComponentName : mapKey;
        loaderDataMap.set(componentName, loaderData);
      }
    }
  }

  // generate meta tags
  let metaTagsForThisPage: null | string = null;
  if (serverSideHandlersForThisPage.meta !== undefined) {
    metaTagsForThisPage = await generateMetaTags(
      serverSideHandlersForThisPage.meta,
      loaderDataMap.get(thisPageComponentName)
    );
  }

  return {
    metaTagsForThisPage,
    loaderDataMap,
  };
}

async function generateMetaTags(
  meta: MeactMeta,
  thisPageLoaderData: any
): Promise<string | null> {
  const metaArray = meta({
    data: thisPageLoaderData,
  });

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
