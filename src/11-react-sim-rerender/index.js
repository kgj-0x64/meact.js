// Same API as React //

// get DOM element where our Meact application will be mounted
const targetNodeInBrowserDom = document.getElementById("root");
const browserDomPainterAtTargetNode = createRoot(targetNodeInBrowserDom);

// StopwatchTowerComponent also works but children (and thus their states) are unmounted on parent's state change
const renderTreeRootNode = createElement(Profile);

browserDomPainterAtTargetNode.render(renderTreeRootNode);
