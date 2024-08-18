import { componentFnCallStack } from "../callStack.js";
import { badHookCall, getHookCallCount } from "./hookHelpers.js";

/**
 * useState hook
 * @param {any} initialValue
 * @returns {[any, function]}
 */
export default function useState(initialValue) {
  /**
   * ! ALERT (Early lesson on Closure; kept as useful notes/reminder)
   *
   * Closures capture variables by reference, not by value.
   *
   * If we were directly using the global reference variable `currActiveComponentForHooks` inside the inner function `setStateValue`, then:
   * - Due to closure, the `setStateValue` function captures a reference to the variable `currActiveComponentForHooks` and not its value.
   * - That is, at the time `setStateValue` is defined, `setStateValue` holds a reference to the `currActiveComponentForHooks` variable itself,
   * - not just its value.
   * - Therefore, any updates to the `currActiveComponentForHooks` variable
   * - after `setStateValue` is defined will be reflected when `setStateValue` is called.
   *
   * But the global variable `currActiveComponentForHooks` itself is a reference to different MeactElement object changing in each run of `createElemet` function.
   * So, if we use the global reference directly inside `setStateValue` function,
   * then by the time `setStateValue` is called,
   * it'll always get reference to the last leaf ReactComponent object.
   *
   * The solution is:
   * 1. to simply create a copy of the global reference avriable inside the lexical scope of `useState` function and not change it, or
   * 2. use a different global variable like a stack (array of references)
   */

  // 1.
  // copying an object reference variable creates one more reference to the same object
  // so, this local variable is assigned the value of global reference variable `currActiveComponentForHooks` at the time `useState` is called

  /// discarding this in favour of component call stack to make algorithm simpler for context providers
  // const targetComponentForThisHook = currActiveComponentForHooks.get();

  // Or, 2.
  // const targetComponentForThisHook = reactComponentStack[reactComponentStack.length - 1];
  const targetComponentForThisHook =
    componentFnCallStack.getComponentFnCurrInExecutionContext();

  badHookCall(targetComponentForThisHook, "useState");

  console.log("useState hook called for", targetComponentForThisHook.id);

  const thisHookCallCount = getHookCallCount(
    targetComponentForThisHook,
    "useState"
  );

  const { values } = targetComponentForThisHook.stateManager;

  let stateValue;

  // do we have a state value at (thisHookCallCount+1) position already
  if (values.length > thisHookCallCount) {
    // GET value from last render
    stateValue = values[thisHookCallCount];
  } else {
    // SET initial value
    stateValue = initialValue;
    values.push(stateValue);
  }

  // now, this inner function `setStateValue` captures `targetComponentForThisHook` by reference,
  // which is local to and constant in the scope of `useState` function
  // so, it will always refer to the same `MeactElement` object within a specific `useState` call's context
  /**
   * call this to trigger a state update
   * @param {any} newValue
   */
  function setStateValue(newValue) {
    console.log("Updating state in:", targetComponentForThisHook.id);
    targetComponentForThisHook.stateManager.updateValue(
      thisHookCallCount,
      newValue
    );
  }

  // update the call counter
  targetComponentForThisHook.hooksCallCounter.increment("useState");

  return [stateValue, setStateValue];
}
