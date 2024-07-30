function StopwatchTowerComponent() {
  console.log("StopwatchTowerComponent called");

  const [color, setColor] = useState("lightcoral");

  function updateColor(event) {
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
      "div",
      null,
      createElement("ol", null, ...getStopwatchesElementsArray())
    )
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

// EXAMPLE FROM: https://react.dev/learn/passing-props-to-a-component#passing-jsx-as-children

function Profile() {
  const [size, setSize] = useState(100);
  console.log("Profile size is", size);

  return createElement(
    Card,
    null,
    // whatever this returns becomes a child element of Card component
    createElement(Avatar, {
      size,
      person: {
        name: "Katsuko Saruhashi",
        imageId: "YfeOqp2",
      },
    }),
    createElement("h3", null, `Size: ${size}`),
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

function Card({ children }) {
  return createElement(
    "div",
    {
      class: "card",
    },
    ...children
  );
}

function Avatar({ person, size }) {
  console.log("Avatar size is", size);

  // conditional rendering based on props
  if (size < 50) {
    return createElement(
      "h2",
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
