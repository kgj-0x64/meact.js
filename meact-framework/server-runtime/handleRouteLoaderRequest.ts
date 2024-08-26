import { readFileSync, existsSync } from "fs";
import { join } from "path";
import { Request } from "express";
import type { MeactMeta } from "./types.js";
import {
  MEACT_FRAMEWORK_SERVER_DIRECTORY,
  DIST_OUTPUT_DIRECTORY,
  APP_DIRECTORY_NAME,
  PAGES_DIRECTORY_NAME,
} from "../constants/namingConventions.ts";
// @ts-ignore
import { mapOfComponentNameToServerSideHandlers } from "./build.js";
import { runExtraLoadersFromComponentsForThisPage } from "../../app/_app.js";
import {
  makeDataResponse,
  makeErrorResponse,
  MeactJsonResponse,
} from "./responses.ts";

/**
 * call this on server to prepare index.html content in response to a page request
 */
export async function preparePageContentOnRequest(req: Request): Promise<{
  html: string | null;
  routeLoaderData: MeactJsonResponse<any>;
}> {
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
      return {
        html: null,
        routeLoaderData: makeErrorResponse(
          "Page does not exist at this route",
          404
        ),
      };
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
        `<script id="page-loader-data" type="application/json"></script>`,
        `<script id="page-loader-data" type="application/json">${JSON.stringify(
          Object.fromEntries(pageServerData.loaderDataMap)
        )}</script>`
      );
    }

    // remove "debugger.css" in production so as to remove its visible area due to bg-color and padding
    // while "render tree" is set to be plotted in a non-localhost window as well
    if (req.hostname !== "localhost") {
      indexHtmlContent = indexHtmlContent.replace(
        `<link rel="stylesheet" href="styles/debugger.css" />`,
        ``
      );
    }

    return {
      html: indexHtmlContent,
      routeLoaderData: pageServerData.pageLoaderData,
    };
  } catch (error) {
    console.error(
      `LOG: Error while preparing HTML content on ${req.method} ${req.path} request`,
      error
    );
    return {
      html: null,
      routeLoaderData: makeErrorResponse(
        "Server failed to process this request, please try again",
        500
      ),
    };
  }
}

async function getPageServerData(req: Request): Promise<{
  metaTagsForThisPage: string | null;
  pageLoaderData: MeactJsonResponse<any>;
  loaderDataMap: Map<string, MeactJsonResponse<any>>;
}> {
  // Get the page name (path)
  const pathName = req.path === "/" ? "/index" : req.path; // starts with "/"
  const pageName = pathName.substring(1);

  const serverSideHandlersForThisPage =
    mapOfComponentNameToServerSideHandlers.get(pageName);

  if (serverSideHandlersForThisPage === undefined)
    return {
      metaTagsForThisPage: null,
      pageLoaderData: makeErrorResponse(
        "A loader is not defined for this page",
        404
      ),
      loaderDataMap: new Map(),
    };

  // generate loader data
  const loaderDataMap = new Map<string, MeactJsonResponse<any>>();
  const thisPageComponentName = serverSideHandlersForThisPage.componentName;
  let pageLoaderData: MeactJsonResponse<any> = makeDataResponse(null);

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
      const loaderData: MeactJsonResponse<any> =
        await serverSideHandlersForThisComponent.loader({
          req,
        });

      if (mapKey === pageName) {
        // ! make a copy object
        // else, modifying `loaderData` below will change the value for `pageLoaderData` object reference as well
        pageLoaderData = new MeactJsonResponse(
          loaderData.data,
          loaderData.meta,
          loaderData.error
        );
      }

      // reset meta values so that they are not visible in the browser under that script tag
      loaderData.meta = null;

      const componentName =
        mapKey === pageName ? thisPageComponentName : mapKey;
      loaderDataMap.set(componentName, loaderData);
    }
  }

  // generate meta tags
  let metaTagsForThisPage: null | string = null;
  if (serverSideHandlersForThisPage.meta !== undefined) {
    metaTagsForThisPage = await generateMetaTags(
      serverSideHandlersForThisPage.meta,
      {
        req,
        thisPageLoaderData: pageLoaderData,
      }
    );
  }

  return {
    metaTagsForThisPage,
    pageLoaderData,
    loaderDataMap,
  };
}

async function generateMetaTags(
  meta: MeactMeta<any>,
  {
    req,
    thisPageLoaderData,
  }: { req: Request; thisPageLoaderData: MeactJsonResponse<any> }
): Promise<string | null> {
  const metaArray = meta({
    req,
    pageLoaderData: thisPageLoaderData,
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
