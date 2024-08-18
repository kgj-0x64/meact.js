import { domVirtualNodeHelper } from "./virtualNodeHelper.js";
import { setAttributesAndProperties } from "./domAttrAndProp.js";
import { elementRenderId } from "./utils.js";

/**
 * call this to create browser DOM elements from a given render tree root
 * @param {MeactElement} meactElement
 * @param {string} parentDomElementId
 * @param {number} insertAtChildPosition
 * @returns {HTMLElement}
 */
export function createBrowserDomForMeactElement(
  meactElement,
  parentDomElementId,
  insertAtChildPosition
) {
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

    /**
     * 1. It still adds a div to the DOM, which React's Fragment specifically avoids.
     * 2. `display: contents` is not supported in all browsers, potentially causing inconsistent behavior.
     * 3. It may interfere with CSS selectors and DOM traversal scripts.
     *
     * BUT
     * DocumentFragment is a DOM node and not a DOM element,
     * which means that we can't set ID or any attribute on it
     * and it's not added as an element to the rendered DOM tree.
     */

    // https://developer.mozilla.org/en-US/docs/Web/API/Document/createDocumentFragment
    const placeholderElement = document.createDocumentFragment();

    // storing its parent and positional info in our DOM virtual node helper data structure
    domVirtualNodeHelper.addFragmentNode(
      meactElement.id,
      parentDomElementId,
      insertAtChildPosition
    );

    if (meactElement.children && meactElement.children.length > 0) {
      meactElement.children.forEach((child, index) => {
        const childElementAtThisIndex = createBrowserDomForMeactElement(
          child,
          // actual parent node in the DOM is unchanged for this fragment's children
          parentDomElementId,
          // absolute child position under parent node = child position of this fragment under its parent node +  child position under fragment node
          insertAtChildPosition + index
        );
        placeholderElement.appendChild(childElementAtThisIndex);
      });
    }

    return placeholderElement;
  }

  if (meactElement.name === "text") {
    // ! BUG: when overwriting `innerHTML` so as to handle both Unicode characters and HTML entities
    // ```createElement("b", null, "Note: ", createElement("code", null, "filterTodos"), " is artificially slowed down!")```
    // will produce ```<b data-render-id="b-10"> is artificially slowed down!</b>```

    // Solution: https://stackoverflow.com/questions/20941956/how-to-insert-html-entities-with-createtextnode
    // You can't create nodes with HTML entities. Use unicode values instead.

    const textContent = meactElement.props.content;
    return document.createTextNode(textContent);
  }

  // show these in the browser DOM
  const htmlElement = document.createElement(meactElement.name);
  htmlElement.setAttribute(elementRenderId, meactElement.id);

  // If the node has children, create and append child nodes
  if (meactElement.children && meactElement.children.length > 0) {
    meactElement.children.forEach((child, index) => {
      const childElementAtThisIndex = createBrowserDomForMeactElement(
        child,
        meactElement.id,
        index
      );
      htmlElement.appendChild(childElementAtThisIndex);
    });
  }

  /**
   * select element's value must exactly match one of the option values,
   * so it must only be set after all its children option elements are seen by the DOM
   */
  setAttributesAndProperties(meactElement, htmlElement);

  return htmlElement;
}
