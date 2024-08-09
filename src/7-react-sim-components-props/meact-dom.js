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
    // view the all properties and methods of a document object
    console.dir(browserDom);
    this.rootNodeInBrowserDom.appendChild(browserDom);
  }

  destroy() {}
}

function createBrowserDomForReactElement(reactElement) {
  /**
   * this approach renders text including Unicode character ❤️ correctly
   * but it doesn't interpret HTML entities correctly like &#10083; as a heart emoji
   */
  // if (reactElement.name === "text") {
  //   const textContent = reactElement.props.content;
  //   const textNode = document.createTextNode(textContent);
  //   console.log("textNode", textNode);
  //   return textNode;
  // }

  const htmlElement = document.createElement(reactElement.name);
  htmlElement.setAttribute("id", reactElement.id);

  if (reactElement.props !== undefined && reactElement.props) {
    for (const [key, value] of Object.entries(reactElement.props)) {
      const attrKey = key.toLowerCase();
      let attrValue = value;
      if (attrKey === "onclick") {
        // `htmlElement.setAttribute(attrKey, attrValue);` does not work for "onclick"
        // because DOM sees: `<button id="button-9" onclick="() => updateCountBy(compounder)">👍🏽</button>`
        // so, given the style of our funciton passing, we should set it on the DOM element's object (can be seen using `console.dir`)

        // `htmlElement.setAttribute(attrKey, attrValue);` does not work for "onclick"
        // because DOM sees:
        //     onclick --> `<button id="button-9" onclick="() => updateCountBy(compounder)">👍🏽</button>`
        // so, given the style of our funciton passing, we should update corresponding property on this DOM element's object
        // then DOM sees (can be seen using `console.dir`):
        //     `<button id="button-9">👍🏽</button>`
        htmlElement.onclick = attrValue;
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
