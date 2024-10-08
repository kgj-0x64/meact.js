// render ID of a DOM element to keep it separate from `id` attribute set directly
// e.g. <select id="select-color">...</select>
const elementRenderId = "data-render-id";

/**
 * call this to get a browser DOM writer for the given target browser DOM node
 * @param {HTMLElement} rootNodeInBrowserDom target node in the browser DOM where our UI elements should be appended to
 * @returns {*} browserDomWriter our DOM manipulator
 */
function createRoot(rootNodeInBrowserDom) {
  browserDomWriter.setbrowserDomWriterAtNode(rootNodeInBrowserDom);
  return browserDomWriter;
}

/**
 * the DOM manager (manipulator and submitter)
 * creates DOM from created/updated render tree efficiently and appends it to the target DOM node
 */
const browserDomWriter = {
  targetNodeInBrowserDom: null,

  // constructor
  setbrowserDomWriterAtNode(nodeInBrowserDom) {
    this.targetNodeInBrowserDom = nodeInBrowserDom;
  },

  /**
   * call it to display the given Render Tree (root node) at the target node of browser DOM
   * and take over managing the DOM inside it
   * @param {MeactElement} meactElement root node of the render tree which is to be rendered in browser DOM
   */
  render(meactElement) {
    // set this as the root node of the render tree
    renderTree.setRootNode(meactElement);

    // for visual debugging, plot the render tree at the bottom of browser DOM
    meactElement.plotRenderTree();

    this.targetNodeInBrowserDom.innerHTML = ""; // clear any existing content
    const browserDom = createBrowserDomForMeactElement(meactElement);
    // view the all properties and methods of a document object
    console.dir(browserDom);
    this.targetNodeInBrowserDom.appendChild(browserDom);

    // post render housekeeping
    renderTree.postRenderHandler();
  },

  /**
   * call this to update existing DOM's copy based on render tree's diff
   * @param {MeactElement} rootMeactElement root node of the render tree which is already rendered in browser DOM
   */
  rerenderTheDiff(rootMeactElement) {
    // for visual debugging, plot the render tree at the bottom of browser DOM
    rootMeactElement.plotRenderTree();

    // using reconciliatoin to modify browser DOM from renderTree's diff only
    const rerenderDiffQueue = renderTree.rerenderDiffForDomHandler.getQueue();
    console.log("Rerender DIFF Queue", rerenderDiffQueue);

    for (let i = 0; i < rerenderDiffQueue.length; i++) {
      upsertBrowserDomForRerenderDiffItem(rerenderDiffQueue[i]);
    }

    // post re-render housekeeping
    renderTree.postRenderHandler();
  },
};

/**
 * call this to create browser DOM elements from a given render tree root
 * @param {MeactElement} meactElement
 * @returns {HTMLElement}
 */
function createBrowserDomForMeactElement(meactElement) {
  /// render tree nodes which is not meant for browser DOM

  if (meactElement.type === "NullComponent") {
    // let's add it to the browser DOM and let it hold a child position there as well
    const nullElement = document.createElement("div");
    nullElement.setAttribute(elementRenderId, meactElement.id);
    // `display: none` turns off the display of an element so that it has no effect on layout
    nullElement.style.display = "none";
    return nullElement;
  }

  if (meactElement.type === "MeactComponent") {
    // Create the placeholder element
    const placeholderElement = document.createElement("div");
    placeholderElement.setAttribute(elementRenderId, meactElement.id);
    // `display: contents` causes an element's children to appear
    // as if they were direct children of the element's parent, ignoring the element itself
    placeholderElement.style.display = "contents";

    // browser DOM cares for DOM element from its return block only
    const domSubtreeOfThisComponent = createBrowserDomForMeactElement(
      meactElement.children[0]
    );
    placeholderElement.appendChild(domSubtreeOfThisComponent);

    return placeholderElement;
  }

  // show these in the browser DOM
  const htmlElement = document.createElement(meactElement.name);

  htmlElement.setAttribute(elementRenderId, meactElement.id);

  /**
   * select element's value must exactly match one of the option values,
   * so it must only be set after all its children option elements are seen by the DOM
   */
  // If the node has children, create and append child nodes
  if (meactElement.children && meactElement.children.length > 0) {
    meactElement.children.forEach((child) => {
      if (child.name === "text") {
        const textContent = child.props.content;
        // ! BUG: when overwriting `innerHTML` so as to handle both Unicode characters and HTML entities
        // ```createElement("b", null, "Note: ", createElement("code", null, "filterTodos"), " is artificially slowed down!")```
        // will produce ```<b data-render-id="b-10"> is artificially slowed down!</b>```

        // Solution: https://stackoverflow.com/questions/20941956/how-to-insert-html-entities-with-createtextnode
        // You can't create nodes with HTML entities. Use unicode values instead.
        htmlElement.appendChild(document.createTextNode(textContent));
      } else {
        htmlElement.appendChild(createBrowserDomForMeactElement(child));
      }
    });
  }

  setAttributesAndProperties(meactElement, htmlElement);

  return htmlElement;
}

/**
 * call this to update or create/insert browser DOM elements in the existing browser DOM from a given render tree root
 * @param {{action: "created" | "updated", parentElementId: string, targetElement: MeactElement, childPosition: number}} rerenderDiffItem
 */
function upsertBrowserDomForRerenderDiffItem(rerenderDiffItem) {
  const { action, parentElementId, childPosition, targetElement } =
    rerenderDiffItem;

  // get the parent element
  const parentElementInBrowserDom =
    findElementByUniqueRenderId(parentElementId);

  if (!parentElementInBrowserDom) {
    console.warn(
      `Parent element with ID "${parentElementId}" is not found in the browser DOM.`
    );
    return;
  }

  if (action === "created") {
    const targetDomSubtree = createBrowserDomForMeactElement(targetElement);

    // overwrite the element at the specified childPosition or append if childPosition is out of bounds
    if (
      childPosition >= 0 &&
      childPosition < parentElementInBrowserDom.children.length
    ) {
      parentElementInBrowserDom.replaceChild(
        targetDomSubtree,
        parentElementInBrowserDom.children[childPosition]
      );
    } else {
      parentElementInBrowserDom.appendChild(targetDomSubtree); // append at the end if childPosition is out of bounds
    }
  } else if (action === "updated") {
    if (targetElement.name === "text") {
      // we need the parent DOM element because the DOM doesn't hold ID of a text node created using `document.createTextNode`
      const textContent = targetElement.props.content;
      parentElementInBrowserDom.childNodes[childPosition].textContent =
        textContent;
    } else {
      // find the existing element to update
      const domElementToUpdate = findElementByUniqueRenderId(targetElement.id);

      if (domElementToUpdate) {
        setAttributesAndProperties(targetElement, domElementToUpdate);
      } else {
        console.warn(
          `UPDATE: Element with ID "${targetElement.id}" not found.`
        );
      }
    }
  } else {
    // find the existing element to delete
    const domElementToDelete = findElementByUniqueRenderId(targetElement.id);

    if (domElementToDelete) {
      console.log("domElementToDelete", domElementToDelete);
      domElementToDelete.parentNode.removeChild(domElementToDelete);
    } else {
      console.warn(`DELETE: Element with ID "${targetElement.id}" not found.`);
    }
  }
}

/**
 * call this to set attributes and properties on an HTML element given its MeactElement representation
 * @param {MeactElement} meactElement
 * @param {HTMLElement} htmlElement
 */
function setAttributesAndProperties(meactElement, htmlElement) {
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
      // assign a ref created using useRef to this DOM element
      else if (attrKey === "refkey") {
        console.log("setting ref value after creating browser DOM node");
        attrValue.current = htmlElement;
      }
      // SET DOM element's Attribute
      else {
        htmlElement.setAttribute(attrKey, attrValue);
      }
    }
  }
}

/**
 * call this to find element by unique render ID
 * @param {string} renderId
 * @returns {HTMLElement}
 */
function findElementByUniqueRenderId(renderId) {
  return document.querySelector(`[${elementRenderId}="${renderId}"]`);
}
