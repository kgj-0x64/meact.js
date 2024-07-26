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
    // repaint
    this.rootNodeInBrowserDom.innerHTML = ""; // Clear any existing content
    console.log(`DOM RENDER:`, reactElement, " at", this.rootNodeInBrowserDom);
  }

  destroy() {}
}

// ! TODO
function getHtmlStringFromReactElement(reactElement) {}
