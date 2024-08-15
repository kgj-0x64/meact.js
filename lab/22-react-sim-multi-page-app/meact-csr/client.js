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
 * called by "DOMContentLoaded" event listener from the client
 * after DOM is ready so as to hydrate the app (i.e. do initial rendering)
 */
export async function run() {
  try {
    const { currentPageModule } = window;
    const PageComponent = currentPageModule.default;

    // mount the Meact Render Tree at the target HTML node
    hydration(PageComponent, {});
  } catch (error) {
    console.error(
      "An error occurred in loading or executing app script:",
      error
    );
  }
}
