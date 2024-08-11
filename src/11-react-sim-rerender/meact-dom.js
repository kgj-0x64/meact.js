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
  render(meactElement) {
    // set this as the root node of the render tree
    renderTree.setRootNode(meactElement);

    // for visual debugging, plot the render tree at the bottom of browser DOM
    meactElement.plotRenderTree();

    this.targetNodeInBrowserDom.innerHTML = ""; // clear any existing content
    const browserDom = createBrowserDomForReactElement(meactElement);
    // view the all properties and methods of a document object
    console.dir(browserDom);
    console.log(browserDom);
    this.targetNodeInBrowserDom.appendChild(browserDom);

    // post render housekeeping
    renderTree.postRenderHandler();
  },

  // update existing DOM's copy based on render tree's diff
  rerenderTheDiff(rootReactElement, reactSubtree) {
    console.log("rerenderTheDiff reactSubtree", reactSubtree);

    // for visual debugging, plot the render tree at the bottom of browser DOM
    rootReactElement.plotRenderTree();

    // TODO: modify browser DOM from renderTree's diff only
    this.targetNodeInBrowserDom.innerHTML = ""; // clear any existing content
    const browserDom = createBrowserDomForReactElement(rootReactElement);
    // view the all properties and methods of a document object
    console.dir(browserDom);
    console.log(browserDom);
    this.targetNodeInBrowserDom.appendChild(browserDom);

    // post re-render housekeeping
    renderTree.postRenderHandler();
  },
};

function createBrowserDomForReactElement(meactElement) {
  /// render tree nodes which is not meant for browser DOM

  if (meactElement.type === "null") {
    // browser DOM shouldn't know it since it's meant to hold position in the render tree
    // we use `display:none` on this element,
    // so it neither renders in the document nor affects its layout
    const nullElement = document.createElement("div");
    nullElement.setAttribute("class", "null-element");
    return nullElement;
  }

  if (meactElement.type === "MeactComponent") {
    // browser DOM cares for DOM element from its return block only
    return createBrowserDomForReactElement(meactElement.children[0]);
  }

  // show these in the browser DOM
  const htmlElement = document.createElement(meactElement.name);
  htmlElement.setAttribute("id", meactElement.id);

  /**
   * select element's value must exactly match one of the option values,
   * so it must only be set after all its children option elements are seen by the DOM
   */
  // If the node has children, create and append child nodes
  if (meactElement.children && meactElement.children.length > 0) {
    meactElement.children.forEach((child) => {
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

  if (meactElement.props !== undefined && meactElement.props) {
    for (const [key, value] of Object.entries(meactElement.props)) {
      const attrKey = key.toLowerCase();
      let attrValue = value;

      // SET DOM element's Property
      if (attrKey.startsWith("on") || attrKey === "value") {
        // `htmlElement.setAttribute(attrKey, attrValue);` does not work for "onclick" function call or value update on "onchange" function call
        // because HTML Document sees:
        //     onclick --> `<button id="button-9" onclick="() => updateCountBy(compounder)">👍🏽</button>`
        //     onchange --> `<select id="select-6" value="lightcoral" onchange="(event) => updateColor(event)">...</select>`
        // so, given the style of our function passing, we should update corresponding property on this DOM element's object
        // then HTML Document sees (can be seen using `console.dir`):
        //     `<button id="button-9">👍🏽</button>` and `<select id="select-6" value="lightcoral">...</select>`
        htmlElement[attrKey] = attrValue;
      }
      // SET DOM element's Attribute
      else {
        htmlElement.setAttribute(attrKey, attrValue);
      }
    }
  }

  return htmlElement;
}
