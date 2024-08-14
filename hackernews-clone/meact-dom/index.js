import { browserDomWriter } from "./domWriter.js";

/**
 * call this to get a browser DOM writer for the given target browser DOM node
 * @param {HTMLElement} rootNodeInBrowserDom target node in the browser DOM where our UI elements should be appended to
 * @returns {*} browserDomWriter our DOM manipulator
 */
export function createRoot(rootNodeInBrowserDom) {
  browserDomWriter.setbrowserDomWriterAtNode(rootNodeInBrowserDom);
  return browserDomWriter;
}

export { browserDomWriter };
