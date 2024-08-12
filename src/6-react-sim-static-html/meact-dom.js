// call it to create a root node for displaying content inside a browser DOM element
function createRoot(nodeInBrowserDom) {
  const browserDomWriterAtNode = new BrowserDomWriter(nodeInBrowserDom);
  return browserDomWriterAtNode;
}

class BrowserDomWriter {
  constructor(rootNodeInBrowserDom) {
    this.rootNodeInBrowserDom = rootNodeInBrowserDom;
  }

  // call it to display the given "Render Tree" into this root node of browser DOM
  // and take over managing the DOM inside it
  render(meactElement) {
    this.rootNodeInBrowserDom.innerHTML = ""; // Clear any existing content
    const browserDom = createBrowserDomForReactElement(meactElement);
    this.rootNodeInBrowserDom.appendChild(browserDom);
  }

  destroy() {}
}

function createBrowserDomForReactElement(meactElement) {
  if (meactElement.name === "text") {
    const textContent = meactElement.props.content;
    return document.createTextNode(textContent);
  }

  const htmlElement = document.createElement(meactElement.name);
  htmlElement.setAttribute("id", meactElement.id);

  if (meactElement.props !== undefined && !meactElement.props) {
    for (const [key, value] of Object.entries(meactElement.props)) {
      htmlElement.setAttribute(key, value);
    }
  }

  // If the node has children, create and append child nodes
  if (meactElement.children && meactElement.children.length > 0) {
    meactElement.children.forEach((child) => {
      htmlElement.appendChild(createBrowserDomForReactElement(child));
    });
  }

  return htmlElement;
}
