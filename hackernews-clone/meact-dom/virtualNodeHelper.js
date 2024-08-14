// DOM virtual node helper mapping a render ID to its DOM parent ID and child position
export const domVirtualNodeHelper = {
  fragments: new Map(),
  /**
   * call this to record parent and virtual positional info for a DOM node
   * which is present in the render tree but won't be added in the DOM tree
   * @param {string} reactElementId
   * @param {string} parentDomElementId
   * @param {number} virtualChildPosition
   */
  addFragmentNode(reactElementId, parentDomElementId, virtualChildPosition) {
    this.fragments.set(reactElementId, {
      parentDomElementId,
      virtualChildPosition,
    });
  },
  /**
   *
   * @param {string} reactElementId
   * @returns {{parentDomElementId:string, virtualChildPosition:number}}
   */
  getFragmentNode(reactElementId) {
    return this.fragments.get(reactElementId);
  },
};
