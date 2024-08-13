// Same API as React //

// get DOM element where our Meact application will be mounted
const targetNodeInBrowserDom = document.getElementById("root");
const browserDomPainterAtTargetNode = createRoot(targetNodeInBrowserDom);

const renderTreeRootNode = createElement(Profile);
renderTreeRootNode.plotRenderTree();

browserDomPainterAtTargetNode.render(renderTreeRootNode);
