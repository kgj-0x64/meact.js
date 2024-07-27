function ChildComponent(props) {
  console.log("ChildComponent called with props", props);

  const { count, updateCountBy } = props;
  const compounder = Math.abs(count);

  const childComponent = createElement(
    "div",
    null,
    createElement("h3", null, "Hello from the Child Component &#10083; ❤️"),
    createElement("h2", null, `${count} likes`),
    createElement("button", { onClick: () => updateCountBy(compounder) }, "👍🏽"),
    createElement(
      "button",
      { onClick: () => updateCountBy(-1 * compounder) },
      "👎🏽"
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
  let count = 100;
  function updateCountBy(value) {
    console.log("updateCountBy", value);
    count += value;
  }

  const parentComponent = createElement(
    "div",
    null,
    createElement("h1", null, "Compounding Counter"),
    createElement(ChildComponent, { count, updateCountBy }),
    createElement("p", null, "Like or dislike to increase/decrease")
  );
  console.log("parentComponent", parentComponent);

  return parentComponent;
}
