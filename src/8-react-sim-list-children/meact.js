let nextId = 0;
function getNewElementId(elementName) {
  const id = nextId++;
  const instanceId = `${elementName}-${id}`;
  return instanceId;
}

class ReactElement {
  constructor(name, props = {}, children = []) {
    // ID of this element to uniquely identify an instance of it
    this.id = getNewElementId(name);
    // name of this element
    this.name = name;
    // set of props set on this element
    this.props = props ? props : {}; // map-like object
    // ordered collection of children elements of this element
    this.children = children; // array
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

// recursively creates ReactElement objects
// since every child is another call to createElement or a text string
function createElement(name, props, ...children) {
  // this is a React component
  if (typeof name === "function") {
    // call the function with the arguments to invoke a call to createElement again unless we reach atomic html elements
    const component = name(props);
    return component;
  }

  let childrenElements = [];
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

  const element = new ReactElement(name, props, childrenElements);

  return element;
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
