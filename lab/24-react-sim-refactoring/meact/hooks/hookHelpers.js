/**
 * call this to check if hook call is valid or not
 * @param {MeactElement} targetComponentForThisHook
 * @param {string} hookName
 */
export function badHookCall(targetComponentForThisHook, hookName) {
  if (
    !targetComponentForThisHook ||
    !targetComponentForThisHook.hooksCallCounter
  ) {
    throw new Error(`${hookName} must be used within a function component`);
  }
}

/**
 * call this to check if dependency array argument has been passed or not
 * @param {MeactElement} targetComponentForThisHook
 * @param {string} hookName
 */
export function badHookDependencyArgs(
  targetComponentForThisHook,
  hookName,
  dependencies
) {
  if (!Array.isArray(dependencies)) {
    throw new Error(
      `${hookName} hook in ${targetComponentForThisHook.name} is missing a dependency array`
    );
  }
}

/**
 * call to get number of `hookName` calls made for this component in this render already
 * @param {MeactElement} targetComponentForThisHook
 * @param {string} hookName
 * @returns {number}
 */
export function getHookCallCount(targetComponentForThisHook, hookName) {
  if (hookName in targetComponentForThisHook.hooksCallCounter.values) {
    return targetComponentForThisHook.hooksCallCounter.values[hookName];
  }
  return 0;
}

/**
 * call this to reset the hooks call counters of all the nodes in a render tree rooted at the given `meactElement` node
 * @param {MeactElement} meactElement
 */
export function resetHooksCallCounters(meactElement) {
  if (meactElement.type === "MeactComponent") {
    // reset number of hook calls seen by this component
    meactElement.hooksCallCounter.reset();
  }

  for (let i = 0; i < meactElement.children.length; i++) {
    const child = meactElement.children[i];
    resetHooksCallCounters(child);
  }
}
