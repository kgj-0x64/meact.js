/// its job is to decouple @meact from the platform-native renderer (@meact-dom)
/// that is, a platform-native renderer (@meact-dom) should only know about the "Render Tree"
/// and no other internal details of (@meact)

import MeactElement from "./element";
import renderTree from "./render-tree";

const meactRendererBridge = {
  // renderer set to use and paint the "Render Tree"
  renderer: null,
  TreeDebugger: null,

  /**
   * called by the renderer to register itself and its render tree debugger
   * @param {any} renderer
   * @param {any} TreeDebugger
   */
  setRenderer(renderer, TreeDebugger) {
    this.renderer = renderer;
    this.TreeDebugger = TreeDebugger;
  },

  /**
   * called by the renderer to get the root node of the "Render Tree"
   * @returns {null | MeactElement}
   */
  getRenderTreeRootNode() {
    return renderTree.getRootNode();
  },

  /**
   * called by the renderer to set the root node of the "Render Tree"
   * @param {MeactElement} meactElement
   */
  setRenderTreeRootNode(meactElement) {
    renderTree.setRootNode(meactElement);
  },

  /**
   * called by the "Render Tree" object to trigger a re-render using fresh DIFF evaluation
   * @param {{action: "created" | "updated" | "deleted", parentElement: MeactElement, childPosition: number, targetElement: MeactElement}[]} diffQueue
   */
  rerenderTheDiff(diffQueue) {
    // ask the renderer to re-paint using DIFF from reconciliation
    this.renderer.rerenderTheDiff(diffQueue);
  },

  /**
   * called by thhe renderer to trigger post-render handler in the "Render Tree"
   */
  postRenderHandler() {
    renderTree.postScreenRenderHandler();
  },

  /**
   * a "render tree" debugger provided by the renderer is used to plot it
   * @param {MeactElement} meactElement
   */
  plotMeactElementTreeForDebugging(meactElement) {
    if (this.TreeDebugger) {
      new this.TreeDebugger(meactElement).plot();
    }
  },
};

export default meactRendererBridge;
