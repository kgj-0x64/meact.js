// creates a browser DOM writer for the root DOM node
function createRoot(rootNodeInBrowserDom) {
  browserDomWriter.setbrowserDomWriterAtNode(rootNodeInBrowserDom);
  return browserDomWriter;
}

// the DOM manager (manipulator and submitter)
// creates DOM from render tree efficiently and
// appends it to the target DOM node
const browserDomWriter = {
  targetNodeInBrowserDom: null,
  // constructor
  setbrowserDomWriterAtNode(nodeInBrowserDom) {
    this.targetNodeInBrowserDom = nodeInBrowserDom;
  },
  // call it to display the given "React elements tree" into this root node of browser DOM
  // and take over managing the DOM inside it
  render(reactElement) {
    // reset the render counter
    domRefreshCounter.reset();

    this.targetNodeInBrowserDom.innerHTML = ""; // Clear any existing content
    const browserDom = createBrowserDomForReactElement(reactElement);
    // view the all properties and methods of a document object
    console.dir(browserDom);
    this.targetNodeInBrowserDom.appendChild(browserDom);

    domRefreshCounter.increment();
  },
  // update existing DOM's copy based on render tree's diff
  rerenderTheDiff(reactSubtree) {
    console.log("reactSubtree", reactSubtree);
    domRefreshCounter.increment();
  },
};

// how many times this app has been rendered (or rerendered)
const domRefreshCounter = {
  count: 0,
  reset() {
    this.setCount(0);
  },
  increment() {
    this.setCount(this.count + 1);
  },
  setCount(newCount) {
    // update the call counter since useState will be called again due to function call
    // ! TODO: reset the hooks counter for all react elements in the render tree
    this.count = newCount;
  },
};

function createBrowserDomForReactElement(reactElement) {
  const htmlElement = document.createElement(reactElement.name);
  htmlElement.setAttribute("id", reactElement.id);

  if (reactElement.props !== undefined && reactElement.props) {
    for (const [key, value] of Object.entries(reactElement.props)) {
      const attrKey = key.toLowerCase();
      let attrValue = value;
      if (attrKey.startsWith("on")) {
        // `htmlElement.setAttribute(attrKey, attrValue);` does not work for "onclick" or "onchange"
        // because DOM sees:
        //     onclick --> `<button id="button-9" onclick="() => updateCountBy(compounder)">👍🏽</button>`
        //     onchange --> `<select id="select-6" value="lightcoral" onchange="(event) => updateColor(event)">...</select>`
        // so, given the style of our funciton passing, we should update corresponding property on this DOM element's object
        // then DOM sees (can be seen using `console.dir`):
        //     `<button id="button-9">👍🏽</button>` and `<select id="select-6" value="lightcoral">...</select>`
        htmlElement[attrKey] = attrValue;
      } else {
        htmlElement.setAttribute(attrKey, attrValue);
      }
    }
  }

  // If the node has children, create and append child nodes
  if (reactElement.children && reactElement.children.length > 0) {
    reactElement.children.forEach((child) => {
      if (child.name === "text") {
        const textContent = child.props.content;
        // we're not using `document.createTextNode` because it doesn't handle HTML entities
        // unlike creating a Text Node using `document.createTextNode`,
        // setting innerHTML handles both Unicode characters and HTML entities
        htmlElement.innerHTML = textContent;
      } else {
        htmlElement.appendChild(createBrowserDomForReactElement(child));
      }
    });
  }

  return htmlElement;
}
