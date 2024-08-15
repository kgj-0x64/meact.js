function SimpleStatefulComponent() {
  const [countValue, setCountValue] = useState(1);
  const [compoundValue, setCompoundValue] = useState(1);

  return createElement(
    "div",
    null,
    createElement(
      "div",
      null,
      createElement("p", null, `Count value: ${countValue}`),
      createElement(
        "button",
        { onClick: () => setCountValue(countValue + 2) },
        "Incrementer"
      )
    ),
    createElement(
      "div",
      null,
      createElement("p", null, `Compound value: ${compoundValue}`),
      createElement(
        "button",
        { onClick: () => setCompoundValue(compoundValue * 2) },
        "Compounder"
      )
    )
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
        createElement("option", { value: "darkgreen" }, "darkgreen"),
        createElement("option", { value: "rebeccapurple" }, "rebeccapurple")
      )
    ),
    createElement("h3", null, `Current selected color option is ${color}`),
    createElement(
      "div",
      null,
      createElement("ol", null, ...getStopwatchesElementsArray())
    )
  );
}

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
