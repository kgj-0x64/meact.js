// Same API as React //

// Render the Counter component into the DOM
const targetNodeInBrowserDom = document.getElementById("root");
const browserDomPainterAtTargetNode = createRoot(targetNodeInBrowserDom);

const renderTreeRootNode = createElement(StopwatchTowerComponent);
renderTreeRootNode.plotRenderTree();

browserDomPainterAtTargetNode.render(renderTreeRootNode);
