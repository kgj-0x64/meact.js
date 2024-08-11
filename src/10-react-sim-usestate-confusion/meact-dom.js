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
  render(meactElement) {
    this.rootNodeInBrowserDom.innerHTML = ""; // Clear any existing content
    const browserDom = createBrowserDomForReactElement(meactElement);
    // view the all properties and methods of a document object
    console.dir(browserDom);
    this.rootNodeInBrowserDom.appendChild(browserDom);
  }

  destroy() {}
}

function createBrowserDomForReactElement(meactElement) {
  /**
   * this approach renders text including Unicode character ❤️ correctly
   * but it doesn't interpret HTML entities correctly like &#10083; as a heart emoji
   */
  // if (meactElement.name === "text") {
  //   const textContent = meactElement.props.content;
  //   const textNode = document.createTextNode(textContent);
  //   return textNode;
  // }

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
        // `htmlElement.setAttribute(attrKey, attrValue);` does not work for "onclick" or "onchange"
        // because DOM sees:
        //     onclick --> `<button id="button-9" onclick="() => updateCountBy(compounder)">👍🏽</button>`
        //     onchange --> `<select id="select-6" value="lightcoral" onchange="(event) => updateColor(event)">...</select>`
        // so, given the style of our funciton passing, we should update corresponding property on this DOM element's object
        // then DOM sees (can be seen using `console.dir`):
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
