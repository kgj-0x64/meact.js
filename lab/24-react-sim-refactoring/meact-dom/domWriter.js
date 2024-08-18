import { meactRendererBridge } from "@meact";
import { createBrowserDomForMeactElement } from "./createDomElement.js";
import { MeactElementTreeDebugger } from "./treeDebugger.js";
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
    // sets itself as the renderer on the bridge
    meactRendererBridge.setRenderer(this, MeactElementTreeDebugger);
  },

  /**
   * call it to display the given Render Tree (root node) at the target node of browser DOM
   * and take over managing the DOM inside it
   * @param {MeactElement} meactElement root node of the render tree which is to be rendered in browser DOM
   */
  render(meactElement) {
    // set this as the root node of the render tree
    meactRendererBridge.setRenderTreeRootNode(meactElement);

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
    meactRendererBridge.postRenderHandler();
  },

  /**
   * call this to update existing DOM's copy based on render tree's diff
   * ! calling this before calling `this.render()` will fail rightly because parent DOM nodes will be unknown
   * @param {{action: "created" | "updated" | "deleted", parentElement: MeactElement, childPosition: number, targetElement: MeactElement}[]} diffQueue
   */
  rerenderTheDiff(diffQueue) {
    // for visual debugging, plot the render tree at the bottom of browser DOM
    const rootMeactElement = meactRendererBridge.getRenderTreeRootNode();
    rootMeactElement.plotRenderTree();

    // using reconciliatoin to modify browser DOM from renderTree's diff only
    console.log("Rerender DIFF Queue", diffQueue);

    for (let i = 0; i < diffQueue.length; i++) {
      upsertBrowserDomForRerenderDiffItem(diffQueue[i]);
    }

    // post re-render housekeeping
    meactRendererBridge.postRenderHandler();
  },
};
