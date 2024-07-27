function ChildComponent() {
  console.log("ChildComponent called");

  const count = 100;
  const childComponent = createElement(
    "div",
    null,
    createElement(
      "span",
      null,
      "Hello from the Child Component 👍🏽",
      createElement("h2", null, `${count} likes`)
    )
  );
  console.log("childComponent", childComponent);

  return childComponent;
}

function ParentComponent() {
  console.log("ParentComponent called");

  // should not be rendered
  const uselessNode = createElement(
    "div",
    null,
    "Hello from the useless node 👎🏽"
  );
  console.log("uselessNode", uselessNode);

  // should be rendered
  const parentComponent = createElement(
    "div",
    null,
    createElement("span", null, "👍🏽"),
    createElement("span", null, "👎🏽"),
    createElement(ChildComponent),
    createElement("h3", null, "Like or dislike to increase/decrease")
  );
  console.log("parentComponent", parentComponent);

  return parentComponent;
}
