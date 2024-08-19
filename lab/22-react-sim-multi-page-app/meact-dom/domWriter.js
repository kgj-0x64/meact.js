import renderTree from "@meact/render-tree";
import { createBrowserDomForMeactElement } from "./createDomElement.js";
import { upsertBrowserDomForRerenderDiffItem } from "./upsertDomElement.js";

/**
 * the DOM manager (manipulator and submitter)
 * creates DOM from created/updated render tree efficiently and appends it to the target DOM node
 */
export const browserDomWriter = {
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
    const browserDom = createBrowserDomForMeactElement(
      meactElement,
      this.targetNodeInBrowserDom.id,
      0
    );
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
