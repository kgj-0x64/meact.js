// Same API as React //

const htmlOnlySimplestNode = createElement("span", null, "Hello World 👍🏽");

let count = 0;
function setCount(value) {
  count = value;
}
const htmlOnlySimpleNode = createElement(
  "div",
  null,
  createElement("h2", null, `${count} likes`),
  createElement("span", { onclick: () => setCount(count + 1) }, "👍🏽"),
  createElement("span", { onClick: () => setCount(count - 1) }, "👎🏽"),
  createElement("h3", null, "Like or dislike to increase/decrease")
);

// Render the Counter component into the DOM
const targetNodeInBrowserDom = document.getElementById("root");
const browserDomPainterAtTargetNode = createRoot(targetNodeInBrowserDom);
browserDomPainterAtTargetNode.render(htmlOnlySimplestNode);
