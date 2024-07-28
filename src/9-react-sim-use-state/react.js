let nextId = 0;
function getnewElementId(elementName) {
  const id = nextId++;
  const instanceId = `${elementName.toLowerCase()}-${id}`;
  return instanceId;
}

class ReactElement {
  constructor(type, name, props = {}, children = []) {
    // ID of this element to uniquely identify an instance of it
    this.id = getnewElementId(name);
    // type of this element
    this.type = type; // null | "ReactComponent" | "HtmlElement"
    // name of this element
    this.name = name;
    // set of props set on this element
    this.props = props ? props : {}; // map-like object
    // ordered collection of children elements of this element
    this.children = children; // array
    // state manager useful for an element of type "ReactComponent"
    this.stateManager = {
      // position of next state value in component's statements
      nextPosition: 0,
      // ordered collection of state values of this component
      state: [],
    };
  }

  // plot render tree beginning from this node for visual debugging
  plotRenderTree() {
    new ReactElementTreeDebugger(this).renderTreeInHtmlDocument();
  }
}

/**
 * `createElement` is just a function which can be called from anywhere
 * and it returns an object which can be used however pleased
 *
 * SO, it should be remembered that
 * creating a React Element node does not mean that it'll be rendered
 *
 * To be rendered,
 * it must be present in the return block of a function
 * in the function call chain initiated by ReactDOM.render()
 */

// takes an entry point as root element and
// recursively creates ReactElement objects
// since every child is another call to createElement or a text string
// so as to eventually reach atomic html elements
function createElement(element, props, ...children) {
  // default type, props and children
  let type = null;
  let name = element;
  const propsObject = props === undefined || !props ? {} : props;
  let childrenElements = [];

  // if it's a null element
  if (!element) {
    return new ReactElement(null, "null", {}, []);
  }

  // if this is a React component
  if (typeof element === "function") {
    type = "ReactComponent";
    name = element.name;

    // creating it without children here only to get its ID and handle state etc
    const reactComponent = new ReactElement(type, name, propsObject, []);

    // all the function logic including `useState`, `setState` etc will be executed when this function is called
    // before its return block is executed which creates nested children elements for it
    // so, if a call to `useState` (directly as GET or as SET via calling `setState`) then it must be corresponding to this component only
    currReactComponentObject = reactComponent;

    // call the component function with the received arguments
    // to finally run a `createElement` call and return its output ReactElement through its return block
    // which could have however deeply nested `createElement` calls in its children
    const returnedElement = element(propsObject);
    childrenElements.push(returnedElement);

    reactComponent.children = [returnedElement];
    return reactComponent;
  }

  /// else
  type = "HtmlElement";
  if (children !== undefined && children && children.length > 0) {
    for (let i = 0; i < children.length; i++) {
      const child = children[i];
      let childElement = child;

      if (typeof child === "string") {
        childElement = createElement("text", { content: child });
      }
      childrenElements.push(childElement);
    }
  }

  const htmlElement = new ReactElement(
    type,
    name,
    propsObject,
    childrenElements
  );
  return htmlElement;
}

/**
 * stuff to manage component behaviour across rerenders
 */

let currReactComponentObject = null;
function updateState(reactComponentObject, stateName, stateValue) {
  reactComponentObject.state[stateName] = stateValue;
  // TODO: rerender
}

function useState(initialValue) {
  // this is initial value on first render
  let stateValue = initialValue;

  function setStateValue(newValue) {
    console.log("newValue", newValue);
  }

  return [stateValue, setStateValue];
}

class ReactElementTreeDebugger {
  constructor(reactElement) {
    this.node = reactElement;
    this.treeContainer = document.getElementById("react-element-tree");
  }

  // Function to render the tree for given React Element in HTML document
  renderTreeInHtmlDocument() {
    this.treeContainer.innerHTML = ""; // Clear any existing content
    this.createHtmlForTreeNode(this.node, 0);
  }

  // Function to create HTML for tree node
  createHtmlForTreeNode(node, level = 0) {
    // margin to leave on the left to align with parent node
    const leftMargin = "_".repeat(level * 2);
    const nestedLeftMargin = "_".repeat((level + 1) * 2);

    // node's name
    const nodeNameSpan = document.createElement("span");
    nodeNameSpan.className = "react-element-tree-node";
    nodeNameSpan.innerText = `${leftMargin}_node: ${node.name}`;
    this.treeContainer.appendChild(nodeNameSpan);

    // node's type
    const nodeTypeSpan = document.createElement("span");
    nodeTypeSpan.className = "react-element-tree-node";
    nodeTypeSpan.innerText = `${nestedLeftMargin}_type: ${node.type}`;
    this.treeContainer.appendChild(nodeTypeSpan);

    // node's ID
    const nodeIdSpan = document.createElement("span");
    nodeIdSpan.className = "react-element-tree-node";
    nodeIdSpan.innerText = `${nestedLeftMargin}_id: ${node.id}`;
    this.treeContainer.appendChild(nodeIdSpan);

    if (node.props !== undefined && node.props) {
      for (const [key, value] of Object.entries(node.props)) {
        const nodeAttributeSpan = document.createElement("span");
        nodeAttributeSpan.className = "react-element-tree-node";
        nodeAttributeSpan.innerText = `${nestedLeftMargin}_${key}: "${value}"`;
        this.treeContainer.appendChild(nodeAttributeSpan);
      }
    }

    // If the node has children, create and append child nodes
    if (node.children && node.children.length > 0) {
      node.children.forEach((child) => {
        this.createHtmlForTreeNode(child, level + 1);
      });
    }
  }
}
