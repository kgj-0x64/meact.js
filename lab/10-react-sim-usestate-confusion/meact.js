let nextId = 0;
function getNewElementId(elementName) {
  const id = nextId++;
  const instanceId = `${elementName.toLowerCase()}-${id}`;
  return instanceId;
}

class MeactElement {
  constructor(type, name, props = {}, children = []) {
    // ID of this element to uniquely identify an instance of it
    this.id = getNewElementId(name);
    // type of this element
    this.type = type; // null | "MeactComponent" | "HtmlElement"
    // name of this element
    this.name = name;
    // set of props set on this element
    this.props = props ? props : {}; // map-like object
    // ordered collection of children elements of this element
    this.children = children; // array
    // state manager useful for an element of type "MeactComponent"
    this.stateManager = {
      // should be reset to 0 on every render
      useStateCallCount: 0,
      // ordered collection of state values of this component
      values: [],
    };
    // function object used in creating this component
    this.functionRef = null;
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
 * creating a MeactElement node does not mean that it'll be rendered
 *
 * To be rendered,
 * it must be present in the return block of a function
 * in the function call chain initiated by ReactDOM.render()
 */

// takes an entry point as root element and
// recursively creates MeactElement objects
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
    return new MeactElement(null, "null", {}, []);
  }

  // if this is a component
  if (typeof element === "function") {
    type = "MeactComponent";
    name = element.name;

    // creating it without children here only to get its ID and handle state etc
    const reactComponent = new MeactElement(type, name, propsObject, []);

    // all the function logic including `useState`, `setState` etc will be executed when this function is called
    // before its return block is executed which creates nested children elements for it
    // so, if a call to `useState` (directly as GET or as SET via calling `setState`) then it must be corresponding to this component only
    reactComponent.functionRef = element;
    currActiveComponentForHooks = reactComponent;

    // call the component function with the received arguments
    // to finally run a `createElement` call and return its output MeactElement through its return block
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

  const htmlElement = new MeactElement(
    type,
    name,
    propsObject,
    childrenElements
  );
  return htmlElement;
}

/**
 * stuff to manage component behaviour across rerenders
 *
 * FAIL
 *
 * This approach is as faulty as it felt in my head!
 * It works only for one single stateful component.
 * By the time `updateState` is called via `setState`,
 * `currActiveComponentForHooks` would be set to the last Component dealt with in `createElement`
 */

let currActiveComponentForHooks = null;
function updateState(reactComponentObject, valueIndex, newValue) {
  console.log("updateState", reactComponentObject, valueIndex, newValue);
  reactComponentObject.stateManager.values[valueIndex] = newValue;
  console.log("reactComponentObject", reactComponentObject);
  // TODO: rerender
  reactComponentObject.plotRenderTree();
  // update the call counter since useState will be called again due to function call
  currActiveComponentForHooks.stateManager.useStateCallCount = 0;
  reactComponentObject.functionRef(reactComponentObject.props);
}

function useState(initialValue) {
  console.log("useState", initialValue);
  console.log("currActiveComponentForHooks", currActiveComponentForHooks);
  // this is initial value on first render
  let stateValue = initialValue;

  // how many useState calls have been made for this component in this render
  const { useStateCallCount } = currActiveComponentForHooks.stateManager;
  const numOfStoredStateValues =
    currActiveComponentForHooks.stateManager.values.length;
  console.log(
    "useStateCallCount",
    useStateCallCount,
    "numOfStoredStateValues",
    numOfStoredStateValues
  );

  // do we have a state value at (useStateCallCount+1) position already
  if (numOfStoredStateValues >= useStateCallCount + 1) {
    // GET value from last render
    stateValue =
      currActiveComponentForHooks.stateManager.values[useStateCallCount];
  } else {
    // SET initial value
    currActiveComponentForHooks.stateManager.values[useStateCallCount] =
      initialValue;
  }

  function setStateValue(newValue) {
    updateState(currActiveComponentForHooks, useStateCallCount, newValue);
  }

  // update the call counter
  currActiveComponentForHooks.stateManager.useStateCallCount += 1;

  return [stateValue, setStateValue];
}

class ReactElementTreeDebugger {
  constructor(meactElement) {
    this.node = meactElement;
    this.treeContainer = document.getElementById("meact-element-tree");
  }

  // Function to render a tree representation for the given Meact Element in the HTML document
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
    nodeNameSpan.className = "meact-element-tree-node";
    nodeNameSpan.innerText = `${leftMargin}_node: ${node.name}`;
    this.treeContainer.appendChild(nodeNameSpan);

    // node's type
    const nodeTypeSpan = document.createElement("span");
    nodeTypeSpan.className = "meact-element-tree-node";
    nodeTypeSpan.innerText = `${nestedLeftMargin}_type: ${node.type}`;
    this.treeContainer.appendChild(nodeTypeSpan);

    // node's ID
    const nodeIdSpan = document.createElement("span");
    nodeIdSpan.className = "meact-element-tree-node";
    nodeIdSpan.innerText = `${nestedLeftMargin}_id: ${node.id}`;
    this.treeContainer.appendChild(nodeIdSpan);

    // node's state
    if (node.stateManager && node.stateManager.values.length > 0) {
      node.stateManager.values.forEach((value, index) => {
        const nodeStateSpan = document.createElement("span");
        nodeStateSpan.className = "meact-element-tree-node";
        nodeStateSpan.innerText = `${nestedLeftMargin}_${index}: "${value}"`;
        this.treeContainer.appendChild(nodeStateSpan);
      });
    }

    // node's props
    if (node.props !== undefined && node.props) {
      for (const [key, value] of Object.entries(node.props)) {
        const nodeAttributeSpan = document.createElement("span");
        nodeAttributeSpan.className = "meact-element-tree-node";
        nodeAttributeSpan.innerText = `${nestedLeftMargin}_${key}: "${value}"`;
        this.treeContainer.appendChild(nodeAttributeSpan);
      }
    }

    // node's children
    if (node.children && node.children.length > 0) {
      node.children.forEach((child) => {
        this.createHtmlForTreeNode(child, level + 1);
      });
    }
  }
}
