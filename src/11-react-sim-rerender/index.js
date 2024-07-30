// Same API as React //

// Render the Counter component into the DOM
const targetNodeInBrowserDom = document.getElementById("root");
const browserDomPainterAtTargetNode = createRoot(targetNodeInBrowserDom);

const renderThisReactNodeAtTarget = createElement(StopwatchTowerComponent);

browserDomPainterAtTargetNode.render(renderThisReactNodeAtTarget);
