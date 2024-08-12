// Same API as React //

// Render the Counter component into the DOM
const targetNodeInBrowserDom = document.getElementById("root");

// get a browser DOM writer for the given target browser DOM node
const browserDomPainterAtTargetNode = createRoot(targetNodeInBrowserDom);

// get the root node of Meact's render tree
const renderTreeRootNode = createElement(CanvasWithHooks);

// display this render tree at the target node of browser DOM
browserDomPainterAtTargetNode.render(renderTreeRootNode);
