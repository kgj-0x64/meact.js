import { createElement } from "../createElement.js";
import { Fragment } from "../jsx-runtime.js";
import renderTree from "../render-tree/render-tree.js";
import { currActiveComponentForHooks } from "./global.js";
import { badHookCall } from "./hookHelpers.js";

/**
 * @typedef {Map<object, InnerMap>} OuterMap
 * @typedef {Map<string, any>} InnerMap
 */

const meactContextManager = {
  /** @type {OuterMap} */
  contextObjectRefs: new Map(),

  /**
   * call this when createContext is called to save a new context object reference
   * @param {object} contextObjectReference
   */
  addNewContextObjectRef(contextObjectReference) {
    console.log("CALLED addNewContextObjectRef", contextObjectReference);
    this.contextObjectRefs.set(contextObjectReference, new Map());
  },

  /**
   * call this to register this component to listen to changes in provider value of the closest ancestor component
   * @param {object} contextObjectReference
   * @param {string} targetChildComponentId
   * @returns
   */
  registerContextHookListener(contextObjectReference, targetChildComponentId) {
    console.log("CALLED registerContextHookListener", targetChildComponentId);
    const contextObjectRefsMap = this.contextObjectRefs.get(
      contextObjectReference
    );

    if (!contextObjectRefsMap.has(targetChildComponentId)) {
      contextObjectRefsMap.set(targetChildComponentId, {
        value: contextObjectReference.defaultValue,
        setByClosestParent: false,
      });
    }

    return contextObjectRefsMap.get(targetChildComponentId);
  },

  registerContextProvider(contextObjectReference, value) {
    console.log("CALLED registerContextProvider", value);

    const isProviderFnEvaluatedAfterChildrenFn =
      renderTree.domRefreshCounter === 0;
    console.log(
      "isProviderFnEvaluatedAfterChildrenFn",
      isProviderFnEvaluatedAfterChildrenFn
    );

    if (isProviderFnEvaluatedAfterChildrenFn) {
    } else {
    }
  },
};

/**
 * call this to create a Meact Context and get its Provider
 * @param {any} defaultValue
 * @returns {{Provider: Function}}
 */
export function createContext(defaultValue) {
  // this reference should be treated like the identifier (ID) of this context
  // when it's being passed around, so it must not be copied/destructured into another object
  const contextObjectReference = {
    // default values never change
    defaultValue: defaultValue !== undefined ? defaultValue : null,
  };

  // save it in a global context manager data structure
  meactContextManager.addNewContextObjectRef(contextObjectReference);

  // this is called when the corresponding component is being re-rendered
  // ! `contextObjectReference` is memoized and it should never be changed
  function MeactContextProviderFn({ value, children }) {
    // set context of children who have shown intent for this context
    // and are not already set by a closer ancestor
    // function updateThisContextOfChildren(children) {
    //   children.forEach((child) => {
    //     if (child.type === "MeactComponent") {
    //       child.contextManager.setcontextProvidedByAncestor(
    //         contextObjectReference,
    //         value
    //       );
    //     }

    //     // recusrively do the same for child's children
    //     updateThisContextOfChildren(child.children);
    //   });
    // }

    // updateThisContextOfChildren(children);

    meactContextManager.registerContextProvider(contextObjectReference, value);

    // since this is used inside the return block of a component
    return createElement(Fragment, null, ...children);
  }

  contextObjectReference["Provider"] = MeactContextProviderFn;

  return contextObjectReference;
}

/**
 * useContext hook
 * @param {any} contextObjectReference
 * @returns {any}
 */
export default function useContext(contextObjectReference) {
  const targetComponentForThisHook = currActiveComponentForHooks.get();

  badHookCall(targetComponentForThisHook, "useContext");

  console.log("useContext hook called for", targetComponentForThisHook.id);

  // register this component to listen to changes in provider value of the closest ancestor component
  const currContextValue = meactContextManager.registerContextHookListener(
    contextObjectReference,
    targetComponentForThisHook.id
  );

  return currContextValue.value;
}
