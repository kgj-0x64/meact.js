// EXAMPLE FROM: https://react.dev/learn/passing-props-to-a-component#passing-jsx-as-children

function Profile() {
  return createElement(
    Card,
    null,
    // whatever this returns becomes a child element of Card component
    createElement(Avatar, {
      size: 100,
      person: {
        name: "Katsuko Saruhashi",
        imageId: "YfeOqp2",
      },
    })
  );
}

function Card({ children }) {
  console.log("RENDER CARD COMPONENT", children.length, children);
  return createElement(
    "div",
    {
      class: "card",
    },
    ...children
  );
}

function Avatar({ person, size }) {
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
