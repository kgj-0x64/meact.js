import { Fragment } from "@meact/jsx-runtime";
import { createElement } from "../createElement.js";
import { componentFnCallStack } from "../callStack.js";
import { badHookCall } from "./hookHelpers.js";

/**
 * call this to create a Meact Context and get its Provider
 * @param {any} defaultValue
 * @returns {{defaultValue: any; Provider: Function}}
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
    const targetComponentForThisProvider =
      componentFnCallStack.getComponentFnCurrInExecutionContext();

    if (targetComponentForThisProvider) {
      targetComponentForThisProvider.contextManager.mergeWithContextsProvidedByAncestors(
        contextObjectReference,
        value
      );
    }

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
