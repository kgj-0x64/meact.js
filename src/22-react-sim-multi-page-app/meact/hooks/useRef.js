import { currActiveComponentForHooks } from "./global.js";
import { badHookCall, getHookCallCount } from "./hookHelpers.js";

/**
 * useRef hook
 * When you change the ref.current property, React does not re-render your component.
 * React is not aware of when you change it because a ref is a plain JavaScript object.
 *
 * @param {any} initialValue
 * @returns {{current: any}}
 */
export default function useRef(initialValue) {
  const targetComponentForThisHook = currActiveComponentForHooks.get();

  badHookCall(targetComponentForThisHook, "useRef");

  const thisHookCallCount = getHookCallCount(
    targetComponentForThisHook,
    "useRef"
  );

  const { values } = targetComponentForThisHook.refManager;

  let refValue = {};

  // do we have a ref value at (thisHookCallCount+1) position already
  if (values.length > thisHookCallCount) {
    // GET value from last render
    refValue = values[thisHookCallCount];
  } else {
    // SET initial value
    refValue.current = initialValue;
    values.push(refValue);
  }

  // update the call counter
  targetComponentForThisHook.hooksCallCounter.increment("useRef");

  return refValue;
}
