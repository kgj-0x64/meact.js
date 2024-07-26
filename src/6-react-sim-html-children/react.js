let nextId = 0;
function getnewElementId(elementName) {
  const id = nextId++;
  const instanceId = `${elementName}-${id}`;
  return instanceId;
}

class ReactElement {
  constructor(id, type, name, props, children) {
    // ID of this element to uniquely identify an instance of it
    this.renderId = id;
    // type can be either "html" or "component"
    this.type = type;
    // name of this element
    this.name = name;
    // set of props set on this element
    this.props = props;
  }

  run() {
    // MDN: Creates a new Text node. This method can be used to escape HTML characters.
    // return document.createTextNode(virtualDomElement);
    for (const child in this.children) {
      if (Object.hasOwnProperty.call(object, key)) {
        const element = object[key];
      }
      if (typeof child === "string") {
        // MDN: Creates a new Text node.
        // This method can be used to escape HTML characters.
        return document.createTextNode(child);
      }
    }
  }
}

function createElement(elementType, props, ...children) {
  const type = typeof elementType === "function" ? "component" : "html";
  // get the name of the component as a string
  const name =
    typeof elementType === "function" ? elementType.name : elementType;

  // render ID of this element
  const renderId = getnewElementId();

  const element = new ReactElement(renderId, type, name, props);

  console.log("children", typeof children, children);

  return element;
}
