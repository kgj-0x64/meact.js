// call it to create a React root for displaying content inside a browser DOM element
function createRoot(nodeInBrowserDom) {
  const browserDomWriterAtNode = new BrowserDomWriter(nodeInBrowserDom);
  return browserDomWriterAtNode;
}

class BrowserDomWriter {
  constructor(rootNodeInBrowserDom) {
    this.rootNodeInBrowserDom = rootNodeInBrowserDom;
  }

  // call it to display the given "React node" into this root node of browser DOM
  // and take over managing the DOM inside it
  render(reactElement) {
    this.rootNodeInBrowserDom.innerHTML = ""; // Clear any existing content
    const browserDom = createBrowserDomForReactElement(reactElement);
    this.rootNodeInBrowserDom.appendChild(browserDom);
  }

  destroy() {}
}

function createBrowserDomForReactElement(reactElement) {
  if (reactElement.name === "text") {
    const textContent = reactElement.props.content;
    return document.createTextNode(textContent);
  }

  const htmlElement = document.createElement(reactElement.name);

  if (reactElement.props !== undefined && !reactElement.props) {
    for (const [key, value] of Object.entries(reactElement.props)) {
      htmlElement.setAttribute(key, value);
    }
  }

  // If the node has children, create and append child nodes
  if (reactElement.children && reactElement.children.length > 0) {
    reactElement.children.forEach((child) => {
      htmlElement.appendChild(createBrowserDomForReactElement(child));
    });
  }

  return htmlElement;
}
