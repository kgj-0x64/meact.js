import { createRoot } from "@meact-dom";
// simply assume that library could impose constraint of mandating a default export from "app/index.js"
// to keep this implementation independent of "app author's code"
import MyApp from "../app/index.js";

export function hydration(PageComponent, pageProps) {
  // get DOM element where our Meact application will be mounted
  const targetNodeInBrowserDom = document.getElementById("root");

  // get a browser DOM writer for the given target browser DOM node
  const browserDomPainterAtTargetNode = createRoot(targetNodeInBrowserDom);

  // get the root node of Meact's render tree
  const renderTreeRootNode = (
    <MyApp Page={PageComponent} pageProps={pageProps} />
  );

  // display this render tree at the target node of browser DOM
  browserDomPainterAtTargetNode.render(renderTreeRootNode);
}

/**
 * call this from the client after DOM is ready to hydrate the app on initial render
 * @param {{scriptBundlePath: string}}
 */
export async function run({ scriptBundlePath }) {
  try {
    const pageName = getFileNameWithoutExtension(scriptBundlePath);

    // accessing this page's built object from the global window namespace
    const pageBuildRef = window[pageName];

    // mount the Meact Render Tree at the target HTML node
    hydration(pageBuildRef.default, {});
  } catch (error) {
    console.error(
      "An error occurred in loading or executing app script:",
      error
    );
  }
}

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
