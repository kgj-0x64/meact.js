// Same API as React //

/**
 * If the script runs before the DOM has fully loaded,
 * the "root" element might not yet exist in the DOM,
 * causing getElementById to return null.
 *
 * Any of these methods should resolve the issue you're experiencing. The choice between them depends on your specific needs:
 * 1. Moving the script to the end of the body is simple but may delay script execution.
 * 2. DOMContentLoaded is a good balance, running as soon as the DOM is ready.
 * 3. The defer attribute is clean and allows you to keep your script in the <head>.
 * 4. The load event ensures everything is loaded but may delay execution if you have large images or other resources.
 */

// Render the Counter component into the DOM
const targetNodeInBrowserDom = document.getElementById("root");
const browserDomPainterAtTargetNode = createRoot(targetNodeInBrowserDom);

const renderTreeRootNode = HtmlOnlyCompositeNode();
renderTreeRootNode.plotRenderTree();

browserDomPainterAtTargetNode.render(renderTreeRootNode);
