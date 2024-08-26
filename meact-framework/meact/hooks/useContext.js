import { updateAncestralContextOfReturnedChildrenElements } from "../createElement.js";
import { componentFnCallStack } from "../executionContext.js";
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

  function MeactContextProvider({ value, children }) {
    const targetComponentForThisProvider =
      componentFnCallStack.getComponentFnCurrInExecutionContext();

    targetComponentForThisProvider.contextManager.setValueForProviderComponent(
      contextObjectReference,
      value
    );

    // recursively update Provided Context of its render props children (within the same return block of encapsulating component's function)
    updateAncestralContextOfReturnedChildrenElements(
      targetComponentForThisProvider
    );

    // since this is used inside the return block of a component
    return children; // like Fragment function
  }

  contextObjectReference["Provider"] = MeactContextProvider;

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
