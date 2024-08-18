import { Fragment } from "@meact/jsx-runtime";
import { createElement } from "../createElement.js";
import renderTree from "../render-tree/index.js";
import { componentFnCallStack } from "../callStack.js";
import { badHookCall } from "./hookHelpers.js";

/**
 * @typedef {Map<string, Map<object, {value: any}>>} ContextForwarderChildrenMap
 */

export const meactContextManager = {
  /** @type {ContextForwarderChildrenMap} */
  contextForwarderChildrenMap: new Map(),

  /**
   * call to register the reconciled children of a Provider component
   * @param {object} contextObjectReference
   * @param {any[]} children
   * @param {any} value
   */
  registerContextProvider(contextObjectReference, children, value) {
    // i.e. during a re-render
    const isProviderRunningDuringReconciliation =
      renderTree.domRefreshCounter > 0;

    let contextForwardingChildren = children;

    if (isProviderRunningDuringReconciliation) {
      // ! during a re-render, we are doing top-down function evaluation for efficient reconciliation
      // ! which means that before this Provider's return block is evaluated, `currActiveComponentForHooks`
      // will be the function component which is encapsulating this Provider function
      const parentComponentOfThisProviderCall =
        componentFnCallStack.getComponentFnCurrInExecutionContext();

      // ! component encapsulating Provider -> [MeactContextProviderFn with fresh ID] -> [Fragment with fresh ID] -> [contextForwardingChildren with reconciled IDs]
      contextForwardingChildren =
        parentComponentOfThisProviderCall.children[0].children[0].children;
    }

    // ! we can't iterate and mutate children property of objects from contextForwardingChildren right away because they might not be created yet
    for (let i = 0; i < contextForwardingChildren.length; i++) {
      const hasContextObjectRefs = this.contextForwarderChildrenMap.has(
        contextForwardingChildren[i].id
      );

      if (hasContextObjectRefs) {
        this.contextForwarderChildrenMap
          .get(contextForwardingChildren[i].id)
          .set(contextObjectReference, value);
      } else {
        this.contextForwarderChildrenMap.set(
          contextForwardingChildren[i].id,
          new Map().set(contextObjectReference, value)
        );
      }
    }
  },

  scanRenderTreeForProviderConsumer(
    targetNode,
    providedContextRefsAndValuesMapFromParent
  ) {
    let mergedContextRefsAndValuesMap =
      providedContextRefsAndValuesMapFromParent
        ? providedContextRefsAndValuesMapFromParent
        : new Map();

    if (this.contextForwarderChildrenMap.has(targetNode.id)) {
      const targetNodeOwnContextRefsAndValuesMap =
        this.contextForwarderChildrenMap.get(targetNode.id);

      mergedContextRefsAndValuesMap = new Map([
        ...providedContextRefsAndValuesMapFromParent,
        ...targetNodeOwnContextRefsAndValuesMap,
      ]);
    }

    if (targetNode.type === "MeactComponent") {
      targetNode.contextManager.setAllContextsProvidedByAncestors(
        mergedContextRefsAndValuesMap
      );
    }

    // this target node has been handled w.r.t. forwarding of Provider values
    if (this.contextForwarderChildrenMap.has(targetNode.id)) {
      this.contextForwarderChildrenMap.delete(targetNode);
    }

    // recusrively do the same for children
    targetNode.children.forEach((child) => {
      this.scanRenderTreeForProviderConsumer(
        child,
        mergedContextRefsAndValuesMap
      );
    });
  },

  flushContextProviderValuesToConsumers(reactSubtree) {
    this.scanRenderTreeForProviderConsumer(
      reactSubtree,
      reactSubtree.contextManager.values
    );
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
  // ! `contextObjectReference` is in closure below and it should never be changed
  const contextObjectReference = {
    // default values never change
    defaultValue: defaultValue !== undefined ? defaultValue : null,
  };

  function MeactContextProviderFn({ value, children }) {
    meactContextManager.registerContextProvider(
      contextObjectReference,
      children,
      value
    );

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
  const targetComponentForThisHook =
    componentFnCallStack.getComponentFnCurrInExecutionContext();

  badHookCall(targetComponentForThisHook, "useContext");

  console.log("useContext hook called for", targetComponentForThisHook.id);

  const { values } = targetComponentForThisHook.contextManager;

  if (!values.has(contextObjectReference)) {
    values.set(contextObjectReference, contextObjectReference.defaultValue);
  }

  return values.get(contextObjectReference);
}
