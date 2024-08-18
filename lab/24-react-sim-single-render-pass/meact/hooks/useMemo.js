import { componentFnCallStack } from "../callStack.js";
import {
  badHookCall,
  badHookDependencyArgs,
  getHookCallCount,
} from "./hookHelpers.js";
import { areArraysEqual } from "../utils.js";

/**
 * useMemo hook
 * React will call your function during the initial render.
 * On next renders, React will return the same value again if the dependencies have not changed since the last render.
 * Otherwise, it will call calculateValue, return its result, and store it so it can be reused later.
 *
 * @param {Function} calculateValueFn
 * @param {any[]} dependencies
 */
export default function useMemo(calculateValueFn, dependencies) {
  const targetComponentForThisHook =
    componentFnCallStack.getComponentFnCurrInExecutionContext();

  badHookCall(targetComponentForThisHook, "useMemo");
  badHookDependencyArgs(targetComponentForThisHook, "useMemo", dependencies);

  console.log("useMemo called for", targetComponentForThisHook.id);

  const thisHookCallCount = getHookCallCount(
    targetComponentForThisHook,
    "useMemo"
  );

  const { values } = targetComponentForThisHook.cacheManager;

  let cachedValue = null;

  // do we have a state value at (thisHookCallCount+1) position already
  if (values.length > thisHookCallCount) {
    // GET value from last render
    const previousDeps = values[thisHookCallCount].depsArray;

    // update dependencies
    values[thisHookCallCount].depsArray = dependencies;

    const hasDepsChanged =
      dependencies.length === 0 || !areArraysEqual(previousDeps, dependencies);

    if (hasDepsChanged) {
      cachedValue = calculateValueFn();
      values[thisHookCallCount] = {
        cachedValue,
        depsArray: dependencies,
      };
    } else {
      cachedValue = values[thisHookCallCount].cachedValue;
    }
  } else {
    // SET initial value
    cachedValue = calculateValueFn();
    values.push({
      cachedValue,
      depsArray: dependencies,
    });
  }

  // update the call counter
  targetComponentForThisHook.hooksCallCounter.increment("useMemo");

  return cachedValue;
}
