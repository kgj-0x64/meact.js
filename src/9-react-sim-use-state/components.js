function StopwatchComponent(props) {
  console.log("StopwatchComponent called");

  const { color, position } = props;

  return createElement(
    "h3",
    {
      style: `color:${color}`,
    },
    `Stopwatch #${position + 1}`
  );
}

function StopwatchTowerComponent() {
  console.log("StopwatchTowerComponent called");

  const [color, setColor] = useState("lightcoral");

  function updateColor(event) {
    console.log("SET COLOR", event);
    setColor(event.target.value);
  }

  function getStopwatchesElementsArray() {
    let elements = [];
    for (let i = 0; i < 5; i++) {
      const stopwatchElement = createElement(StopwatchComponent, {
        position: i,
        color,
      });
      elements.push(stopwatchElement);
    }

    return elements;
  }

  return createElement(
    "div",
    null,
    // conditional render
    color === "lightcoral"
      ? createElement(
          "span",
          { style: `color:${color}` },
          "light coral is the right choice!!!"
        )
      : createElement(null),
    createElement(
      "p",
      null,
      `Pick a color: `,
      createElement(
        "select",
        {
          value: color,
          onChange: (event) => updateColor(event),
        },
        createElement("option", { value: "lightcoral" }, "lightcoral"),
        createElement("option", { value: "midnightblue" }, "midnightblue"),
        createElement("option", { value: "rebeccapurple" }, "rebeccapurple")
      )
    ),
    createElement(
      "div",
      null,
      createElement("ol", null, ...getStopwatchesElementsArray())
    )
  );
}
