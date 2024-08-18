import MeactElement from "./element.js";
import { arePropsEqual } from "./utils.js";

// a map of memoized function names to their MemoizedFunction instances
/** @typedef {Map<string, MemoizedFunction>} MemoizedFunctionsMap */
/** @type {MemoizedFunctionsMap} */
export const memoizedFunctionsMap = new Map();

/**
 * A MemoizedFn instance is created when `memo(componentFn)` is evaluated
 */
export class MemoizedFunction {
  /**
   * @param {Function} componentFn
   * @param {Function | null} arePropsEqualFn
   */
  constructor(componentFn, arePropsEqualFn) {
    this.componentFn = componentFn;
    this.arePropsEqualFn = arePropsEqualFn;
    this.lastProps = null;
  }

  /**
   * call this to update the lastProps property on this MemoizedFunction instance
   * @param {object} newProps
   * @returns {boolean} are props same (i.e. unchanged)
   */
  setLastProps(newProps) {
    // is this first render
    if (!this.lastProps) {
      this.lastProps = newProps;
      return false;
    }

    // else, it's a re-render
    const customArePropsEqualFn = this.arePropsEqualFn;

    const arePropsSameForThisMemoizedFn =
      customArePropsEqualFn !== undefined
        ? customArePropsEqualFn(this.lastProps, newProps)
        : arePropsEqual(this.lastProps, newProps);

    this.lastProps = newProps;
    return arePropsSameForThisMemoizedFn;
  }
}

/**
 * call it to get the component function definition with a memoization identifier (that is the class instance here)
 * @param {Function} componentFn
 * @param {undefined | Function} arePropsEqualFn
 * @returns {MemoizedFn}
 */
export function memo(componentFn, arePropsEqualFn) {
  const componentFnName = componentFn.name;
  const customArePropsEqualFn =
    typeof arePropsEqualFn === "function" ? arePropsEqualFn : null;

  const memoizedFunctionInstance = new MemoizedFunction(
    componentFn,
    customArePropsEqualFn,
    null
  );

  // if this is a re-render, don't reset existing values i.e. lastProps
  if (!memoizedFunctionsMap.has(componentFnName)) {
    memoizedFunctionsMap.set(componentFnName, memoizedFunctionInstance);
  }

  return memoizedFunctionInstance;
}

export const bypassMemoization = {
  subtreeRootNodes: new Map(),

  /**
   * call this to check if this children of this node should be bypassed on memo check or not
   * @param {MeactElement} subtreeRootNode
   * @returns {boolean}
   */
  isThisSubtreeBypassed(subtreeRootNode) {
    return this.subtreeRootNodes.has(subtreeRootNode);
  },

  /**
   * call this to set a subtree should not be check for memoization
   * @param {MeactElement} subtreeRootNode
   */
  setSubtreeAsBypassed(subtreeRootNode) {
    this.subtreeRootNodes.set(subtreeRootNode, true);
  },

  /**
   * call this to reset the map after every render
   */
  reset() {
    this.subtreeRootNodes = new Map();
  },
};
