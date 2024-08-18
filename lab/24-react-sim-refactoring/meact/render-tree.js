import { resetHooksCallCounters } from "./hooks/hookHelpers.js";
import meactRendererBridge from "./bridge.js";

/**
 * A "render tree" is a tree of objects which is created as the store of all info needed
 * to construct the browser DOM in meact-dom.js on every render and re-render
 */
const renderTree = {
  // root node of the render tree
  rootNode: null,
  // how many times this app has been rendered (or rerendered) in browser
  domRefreshCounter: 0,

  /**
   * call this to get the root node
   */
  getRootNode() {
    return this.rootNode;
  },

  /**
   * call this to update the root node and thus this whole render tree
   * @param {MeactElement} meactElement new root node
   */
  setRootNode(meactElement) {
    this.rootNode = meactElement;
    // reset the render counter
    this.domRefreshCounter = 0;
  },

  // queues of updated or newly created elements during a re-render
  rerenderDiffForDomHandler: {
    queue: [], // {{action: "created" | "updated" | "deleted", parentElement: MeactElement, childPosition: number, targetElement: MeactElement}[]}
    /**
     * @param {{action: "created" | "updated" | "deleted", parentElement: MeactElement, childPosition: number, targetElement: MeactElement}} elementSnapshot
     */
    enqueue(elementSnapshot) {
      this.queue.push(elementSnapshot);
    },
    /**
     * @returns {{action: "created" | "updated" | "deleted", parentElement: MeactElement, childPosition: number, targetElement: MeactElement}[]}
     */
    getQueue() {
      return this.queue;
    },
    reset() {
      this.queue = [];
    },
  },

  // queue of all useEffect calls whose dependencies had changed in the last re-render
  effectHooksForPostDomRenderHandling: {
    queue: [], // {{component: MeactElement, index: number}[]}
    /**
     * @param {{component: MeactElement, index: number}} effectObject
     */
    enqueue(effectObject) {
      this.queue.push(effectObject);
    },
    dequeue() {
      return this.queue.shift();
    },
    /**
     * call to execute all useEffect setup and cleanup functions from this render
     */
    processQueue() {
      while (this.queue.length > 0) {
        const effectObject = this.dequeue();
        const { component, index } = effectObject;
        component.executeUseEffectSetupFunction(index);
      }
    },
  },

  /**
   * call this for housekeeping after every render and re-render activity on the browser DOM
   */
  postDomRenderHandler() {
    console.log("Post Render Cleanup Initiated...");

    this.domRefreshCounter += 1;
    // reset the hooks counter for all meact elements in the render tree
    resetHooksCallCounters(this.rootNode);
    // reset the queue of re-render diff
    this.rerenderDiffForDomHandler.reset();
    // run useEffect calls from the queue and then reset
    this.effectHooksForPostDomRenderHandling.processQueue();

    console.log("Post Render Cleanup Done!");
  },

  /**
   * call this to re-paint the browser DOM in sync with this updated sub-tree of the already painted render tree
   * @param {MeactElement} reactSubtree
   */
  reRender(reactSubtree) {
    console.log("Re-render DIFF from this subtree root node", reactSubtree.id);

    // re-paint using DIFF from reconciliation
    meactRendererBridge.rerenderTheDiff(
      this.rerenderDiffForDomHandler.getQueue()
    );
  },

  /**
   * call this to pretty-plot the render tree beginning from this node for visual debugging
   */
  plotRenderTree(meactElement) {
    meactRendererBridge.plotMeactElementTreeForDebugging(meactElement);
  },
};

export default renderTree;
