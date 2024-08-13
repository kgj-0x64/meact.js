// import { createRoot } from "@meact/dom";
// import Meact from "@meact"
import MyApp from "../app/app.js";

export function hydration(PageComponent, pageProps) {
  // get DOM element where our Meact application will be mounted
  const targetNodeInBrowserDom = document.getElementById("root");

  // get a browser DOM writer for the given target browser DOM node
  const browserDomPainterAtTargetNode = createRoot(targetNodeInBrowserDom);

  // get the root node of Meact's render tree
  const renderTreeRootNode = createElement(MyApp, {
    Page: PageComponent,
    pageProps: pageProps,
  });

  // display this render tree at the target node of browser DOM
  browserDomPainterAtTargetNode.render(renderTreeRootNode);
}

/**
 * call this from the client after DOM is ready to hydrate the app on initial render
 * @param {{stylesheetBundlePath: string, scriptBundlePath: string}}
 */
export async function run({ stylesheetBundlePath, scriptBundlePath }) {
  try {
    const pageName = getFileNameWithoutExtension(scriptBundlePath);

    // accessing this page's built object from the global window namespace
    const pageBuildRef = window[pageName];

    // mount the Meact Render Tree at the target HTML node
    hydration(pageBuildRef.default, {});

    console.log("App script has been loaded and executed successfully");
  } catch (error) {
    console.error(
      "An error occurred in loading or executing app script:",
      error
    );
  }
}

// call this to add a script to the document using async-await syntax
// const addScriptToDocument = async (src) => {
//   const el = document.createElement("script");
//   el.src = src;
//   // wrap the event listeners in a Promise
//   const scriptLoadPromise = new Promise((resolve, reject) => {
//     el.addEventListener("load", resolve);
//     el.addEventListener("error", reject);
//   });
//   // add the script to the document
//   document.body.append(el);
//   // pause the execution of the function until the scriptLoadPromise is either resolved or rejected
//   await scriptLoadPromise;
// };

function getFileNameWithoutExtension(relativePath) {
  // Get the file name with extension
  const fileNameWithExtension = relativePath.slice(
    relativePath.lastIndexOf("/") + 1
  );

  // Find the position of the last '.' in the file name
  const lastDotIndex = fileNameWithExtension.lastIndexOf(".");

  // Extract the file name excluding the extension
  const fileNameWithoutExtension =
    lastDotIndex !== -1
      ? fileNameWithExtension.slice(0, lastDotIndex)
      : fileNameWithExtension;

  return fileNameWithoutExtension;
}
