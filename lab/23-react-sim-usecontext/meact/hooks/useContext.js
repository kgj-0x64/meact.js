import { createElement } from "../createElement.js";
import { Fragment } from "../jsx-runtime.js";
import { currActiveComponentForHooks } from "./global.js";
import { badHookCall } from "./hookHelpers.js";

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

  // this is called when the corresponding component is being re-rendered
  // ! `contextObjectReference` is memoized and it should never be changed
  function ContextProviderFn({ value, children }) {
    console.log("ContextProviderFn CALLED with", value);
    // set context of children who have shown intent for this context
    // and are not already set by a closer ancestor
    function updateThisContextOfChildren(children) {
      console.log("updateThisContextOfChildren", value);
      children.forEach((child) => {
        console.log("children.forEach", value, child.id);
        if (child.type === "MeactComponent") {
          console.log("CHILD MeactComponent", value, child.id, child.name);
          child.contextManager.setcontextProvidedByAncestor(
            contextObjectReference,
            value
          );
        }

        // recusrively do the same for child's children
        updateThisContextOfChildren(child.children);
      });
    }

    updateThisContextOfChildren(children);

    // since this is used inside the return block of a component
    return createElement(Fragment, null, ...children);
  }

  contextObjectReference["Provider"] = ContextProviderFn;

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

  const { values } = targetComponentForThisHook.contextManager;
  console.log("values", targetComponentForThisHook.id, values);

  if (!values.has(contextObjectReference)) {
    // register this component's intent to be given this context value by any ancestor component
    values.set(contextObjectReference, {
      value: contextObjectReference.defaultValue,
      setByClosestParent: false,
    });
  }

  return values.get(contextObjectReference).value;
}
