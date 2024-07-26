function HtmlOnlySingleNode() {
  const htmlOnlySimplestNode = createElement("span", null, "Hello World 👍🏽");
  console.log("htmlOnlySimplestNode", htmlOnlySimplestNode);
  return htmlOnlySimplestNode;
}

function HtmlOnlyCompositeNode() {
  // should not be rendered
  const uselessNode = createElement("div", null, "Hello World 👍🏽");
  console.log("uselessNode", uselessNode);

  // should be rendered
  const count = 100;
  const htmlOnlyCompositeNode = createElement(
    "div",
    null,
    createElement("h2", null, `${count} likes`),
    createElement("span", null, "👍🏽"),
    createElement("span", null, "👎🏽"),
    createElement("h3", null, "Like or dislike to increase/decrease")
  );
  console.log("htmlOnlyCompositeNode", htmlOnlyCompositeNode);

  return htmlOnlyCompositeNode;
}
