let nextId = 0;
function getNewElementId(elementName) {
  const id = nextId++;
  const instanceId = `${elementName}-${id}`;
  return instanceId;
}

class MeactElement {
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
    new MeactElementTreeDebugger(this).renderTreeInHtmlDocument();
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

// recursively creates MeactElement objects
// since every child is another call to createElement or a text string
function createElement(type, props, ...children) {
  let childrenElements = [];
  if (children !== undefined && children && children.length > 0) {
    for (let i = 0; i < children.length; i++) {
      const child = children[i];
      let childElement = child;
      if (typeof child === "string") {
        childElement = createElement("text", { content: child });
      }
      console.log("child element", childElement);
      childrenElements.push(childElement);
    }
  }

  const element = new MeactElement(type, props, childrenElements);

  return element;
}

class MeactElementTreeDebugger {
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

    // node's ID
    const nodeIdSpan = document.createElement("span");
    nodeIdSpan.className = "meact-element-tree-node";
    nodeIdSpan.innerText = `${nestedLeftMargin}_id: ${node.id}`;
    this.treeContainer.appendChild(nodeIdSpan);

    if (node.name === "text") {
      // text content
      const nodeContentSpan = document.createElement("span");
      nodeContentSpan.className = "meact-element-tree-node";
      nodeContentSpan.innerText = `${nestedLeftMargin}_content: "${node.props.content}"`;
      this.treeContainer.appendChild(nodeContentSpan);
    }

    // If the node has children, create and append child nodes
    if (node.children && node.children.length > 0) {
      node.children.forEach((child) => {
        this.createHtmlForTreeNode(child, level + 1);
      });
    }
  }
}
