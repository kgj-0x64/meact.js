import { domVirtualNodeHelper } from "./virtualNodeHelper.js";

// render ID of a DOM element to keep it separate from `id` attribute set directly
// e.g. <select id="select-color">...</select>
export const elementRenderId = "data-render-id";

/**
 * call this to find actual parent element in the HTML document
 * @param {MeactElement} parentRenderElement
 * @param {number} childPosition
 * @returns {{parentDomElement: HTMLElement, childPositionInDom: number}}
 */
export function findParentDomElementByParentRenderId(
  parentRenderElement,
  childPosition
) {
  const parentRenderElementId = parentRenderElement.id;

  // parent element from the render tree is virtual in the DOM
  if (parentRenderElement.type === "MeactComponent") {
    const virtualParentElementInfo = domVirtualNodeHelper.getFragmentNode(
      parentRenderElementId
    );

    const parentDomElement = findElementByUniqueRenderId(
      virtualParentElementInfo.parentDomElementId
    );
    return {
      parentDomElement,
      childPositionInDom:
        virtualParentElementInfo.virtualChildPosition + childPosition,
    };
  }
  // parent element from the render tree is present in the DOM
  else {
    const parentDomElement = findElementByUniqueRenderId(parentRenderElementId);
    return {
      parentDomElement,
      childPositionInDom: childPosition,
    };
  }
}

/**
 * call this to find element by unique render ID
 * @param {string} renderId
 * @returns {HTMLElement}
 */
export function findElementByUniqueRenderId(renderId) {
  return document.querySelector(`[${elementRenderId}="${renderId}"]`);
}
