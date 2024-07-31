// Same API as React //

// Render the Counter component into the DOM
const targetNodeInBrowserDom = document.getElementById("root");
const browserDomPainterAtTargetNode = createRoot(targetNodeInBrowserDom);

// StopwatchTowerComponent also works but children (and thus their states) are unmounted on parent's state change
const renderThisReactNodeAtTarget = createElement(Profile);

browserDomPainterAtTargetNode.render(renderThisReactNodeAtTarget);
