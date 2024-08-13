import { createBrowserDomForReactElement } from "./createDomElement.js";
import { setAttributesAndProperties } from "./domAttrAndProp.js";
import { findParentDomElementByParentRenderId } from "./utils.js";

/**
 * call this to update or create/insert browser DOM elements in the existing browser DOM from a given render tree root
 * @param {{action: "created" | "updated" | "deleted", parentElement: MeactElement, childPosition: number, targetElement: MeactElement}} rerenderDiffItem
 */
export function upsertBrowserDomForRerenderDiffItem(rerenderDiffItem) {
  const { action, parentElement, childPosition, targetElement } =
    rerenderDiffItem;

  // get info about its parent element from the DOM
  const parentInfoFromBrowserDom = findParentDomElementByParentRenderId(
    parentElement,
    childPosition
  );

  const parentElementInBrowserDom = parentInfoFromBrowserDom.parentDomElement;
  const childPositionInBrowserDom = parentInfoFromBrowserDom.childPositionInDom;

  if (action === "created") {
    const targetDomSubtree = createBrowserDomForReactElement(targetElement);

    // overwrite the element at the specified child position or append if it's available
    if (
      childPositionInBrowserDom >= 0 &&
      childPositionInBrowserDom < parentElementInBrowserDom.children.length
    ) {
      parentElementInBrowserDom.replaceChild(
        targetDomSubtree,
        parentElementInBrowserDom.children[childPositionInBrowserDom]
      );
    } else {
      // append at the end if the specified child position if it's out of bounds
      parentElementInBrowserDom.appendChild(targetDomSubtree);
    }
  } else if (action === "updated") {
    if (targetElement.name === "text") {
      // we need the parent DOM element because the DOM doesn't hold ID of a text node created using `document.createTextNode`
      const textContent = targetElement.props.content;
      parentElementInBrowserDom.childNodes[
        childPositionInBrowserDom
      ].textContent = textContent;
    } else {
      // find the existing element to update
      const domElementToUpdate = findElementByUniqueRenderId(targetElement.id);

      if (domElementToUpdate) {
        setAttributesAndProperties(targetElement, domElementToUpdate);
      } else {
        console.warn(`UPDATE: Element with ID ${targetElement.id} not found.`);
      }
    }
  } else {
    // find the existing element to delete
    const domElementToDelete = findElementByUniqueRenderId(targetElement.id);
    parentElementInBrowserDom.removeChild(domElementToDelete);
  }
}
