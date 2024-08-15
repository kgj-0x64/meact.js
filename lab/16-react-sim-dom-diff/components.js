// EXAMPLE FROM: https://react.dev/learn/passing-props-to-a-component#passing-jsx-as-children

function ProfileComponent({ color, children }) {
  console.log("ProfileComponent called with", color);

  const [size, setSize] = useState(100);

  return createElement(
    CardComponent,
    null,
    ...children,
    createElement(AvatarComponent, {
      size,
      person: {
        name: "Katsuko Saruhashi",
        imageId: "YfeOqp2",
      },
    }),
    createElement(
      "h3",
      {
        style: `color:${color}`,
      },
      `Size: ${size}`
    ),
    createElement(
      "button",
      { onClick: () => setSize(Math.min(size * 2, 400)) },
      "Magnify"
    ),
    createElement(
      "button",
      { onClick: () => setSize(Math.max(size * 0.5, 25)) },
      "Minify"
    )
  );
}

function CardComponent({ children }) {
  console.log("CardComponent called");

  return createElement(
    "div",
    {
      class: "card",
    },
    ...children
  );
}

function AvatarComponent({ person, size }) {
  console.log("AvatarComponent called");

  // conditional rendering based on props
  if (size < 50) {
    return createElement(
      "h3",
      { style: "color:red" },
      `Do you even want to see ${person.name}? I think not! Zoom on...`
    );
  }

  return createElement("img", {
    class: "avatar",
    src: getImageUrl(person),
    alt: person.name,
    width: size,
    height: size,
  });
}

function getImageUrl(person, size = "s") {
  return "https://i.imgur.com/" + person.imageId + size + ".jpg";
}

function StopwatchTowerComponent() {
  console.log("StopwatchTowerComponent called");

  const [color, setColor] = useState("lightcoral");

  function updateColor(event) {
    setColor(event.target.value);
  }

  const numOfStopwatchChildren = 5;
  function getStopwatchesElementsArray() {
    let elements = [];
    for (let i = 0; i < numOfStopwatchChildren; i++) {
      const stopwatchElement = createElement(StopwatchComponent, {
        key: i,
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
          "p",
          { style: `color:${color}` },
          "light coral is the right choice!!!"
        )
      : createElement(null),
    createElement("label", { for: "select-color" }, "Pick a color: "),
    createElement(
      "select",
      {
        id: "select-color",
        name: "colors",
        value: color,
        onChange: (event) => updateColor(event),
      },
      createElement("option", { value: "lightcoral" }, "Light Coral"),
      createElement("option", { value: "darkgreen" }, "Dark Green"),
      createElement("option", { value: "rebeccapurple" }, "Rebecca Purple")
    ),
    createElement("h3", null, `Current selected color option is ${color}`),
    createElement(
      ProfileComponent,
      { color },
      createElement(
        "h6",
        null,
        `BTW; my parent StopwatchTower Component tells me that it will render ${numOfStopwatchChildren} Stopwatch Components`
      )
    ),
    createElement("div", null, ...getStopwatchesElementsArray())
  );
}

function StopwatchComponent(props) {
  console.log("StopwatchComponent called");

  const { color, position } = props;

  const [countValue, setCountValue] = useState(1);
  const [compoundValue, setCompoundValue] = useState(1);

  return createElement(
    "div",
    null,
    createElement(
      "h3",
      {
        style: `color:${color}`,
      },
      `Stopwatch #${position + 1}`
    ),
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
