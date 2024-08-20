import renderTree from "../render-tree.js";
import { componentFnCallStack } from "../executionContext.js";
import {
  badHookCall,
  badHookDependencyArgs,
  getHookCallCount,
} from "./hookHelpers.js";
import { areArraysEqual } from "../utils.js";

/**
 * useEffect hook
 * When your component is added to the DOM, React will run your setup function.
 * After every re-render with changed dependencies, React will first run the cleanup function
 * (if you provided it) with the old values, and then run your setup function with the new values.
 * After your component is removed from the DOM, React will run your cleanup function.
 *
 * @param {Function} setup
 * @param {any[]} dependencies
 */
export default function useEffect(setup, dependencies) {
  const targetComponentForThisHook =
    componentFnCallStack.getComponentFnCurrInExecutionContext();

  badHookCall(targetComponentForThisHook, "useEffect");
  badHookDependencyArgs(targetComponentForThisHook, "useEffect", dependencies);

  console.log("useEffect called for", targetComponentForThisHook.id);

  const thisHookCallCount = getHookCallCount(
    targetComponentForThisHook,
    "useEffect"
  );

  const { values } = targetComponentForThisHook.effectManager;
  let shouldQueue = false;

  // do we have a state value at (thisHookCallCount+1) position already
  if (values.length > thisHookCallCount) {
    // GET value from last render
    const previousDeps = values[thisHookCallCount].depsArray;

    // update setup function and dependencies to reflect its updated closure inside useEffect definition
    values[thisHookCallCount].depsArray = dependencies;
    values[thisHookCallCount].setupFunc = setup;

    const hasDepsChanged =
      dependencies.length === 0 || !areArraysEqual(previousDeps, dependencies);
    if (hasDepsChanged) {
      shouldQueue = true;
    }
  } else {
    // SET initial value
    values.push({
      setupFunc: setup,
      cleanupFunc: null,
      depsArray: dependencies,
    });
    shouldQueue = true;
  }

  // queue this for execution after DOM is rendered
  if (shouldQueue) {
    renderTree.effectHooksForPostDomRenderHandling.enqueue({
      component: targetComponentForThisHook,
      index: thisHookCallCount,
    });
  }

  // update the call counter
  targetComponentForThisHook.hooksCallCounter.increment("useEffect");
}
