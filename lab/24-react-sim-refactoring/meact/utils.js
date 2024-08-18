import renderTree from "./render-tree.js";

/**
 * call this to get a unique ID for a MeactElement
 * @param {string} elementName
 * @returns {string}
 */
let nextId = 0;
export function getNewElementId(elementName) {
  const id = nextId++;
  const instanceId = `${
    elementName ? elementName.toLowerCase() : "null"
  }-${id}`;
  return instanceId;
}

const componentRegistry = "components";
window.MeactApp = window.MeactApp || {};
window.MeactApp[componentRegistry] = new Map();
export const globalMeactComponentRegistry = {
  /**
   * call this  to get a component's function definition
   * @param {string} componentName
   * @returns {Function}
   */
  get(componentName) {
    return window.MeactApp[componentRegistry].get(componentName);
  },
  /**
   * call this to map a component's name to its function definition
   * @param {string} componentName
   * @param {Function} componentFn
   */
  set(componentName, componentFn) {
    window.MeactApp[componentRegistry].set(componentName, componentFn);
  },
};

/**
 * Re-render monitor object to enforce different return behaviour of `createElement` function during re-render dynamically
 */
export const rerenderMonitor = {
  isHijackOfCreateElementFnPaused: false,
  isCreateElementFunctionHijacked() {
    if (this.isHijackOfCreateElementFnPaused) {
      return false;
    }
    return renderTree.domRefreshCounter > 0;
  },
  pauseHijackOfCreateElementFn() {
    this.isHijackOfCreateElementFnPaused = true;
  },
  resumeHijackOfCreateElementFn() {
    this.isHijackOfCreateElementFnPaused = false;
  },
};

/**
 *
 * @param {any[]} a
 * @param {any[]} b
 * @returns {boolean}
 */
export function areArraysEqual(a, b) {
  if (a === b) return true;
  if (a == null || b == null) return false;
  if (a.length !== b.length) return false;

  for (var i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) return false;
  }
  return true;
}

/**
 * call to shallow compare two props objects
 * @param {any} newProps
 * @param {any} lastProps
 * @returns {boolean}
 */
export function arePropsEqual(oldProps, newProps) {
  // Check if both are objects
  if (
    typeof newProps !== "object" ||
    typeof oldProps !== "object" ||
    newProps === null ||
    oldProps === null
  ) {
    return newProps === oldProps;
  }

  const prevKeys = Object.keys(oldProps);
  const newKeys = Object.keys(newProps);

  // Check if the number of properties is different
  if (prevKeys.length !== newKeys.length) {
    return false;
  }

  // Compare each property using Object.is()
  for (let key of prevKeys) {
    if (!Object.is(oldProps[key], newProps[key])) {
      return false;
    }
  }

  return true;
}
