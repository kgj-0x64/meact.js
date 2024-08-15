// a map memoized function names to their
export const memoizedFunctionsMap = new Map();

/**
 * A MemoizedFn instance is created when `memo(componentFn)` is evaluated
 */
export class MemoizedFn {
  /**
   * @param {Function} componentFn
   */
  constructor(componentFn) {
    this.componentFn = componentFn;
  }
}

/**
 * call it to get the component function definition with a memoization identifier (that is the class instance here)
 * @param {Function} componentFn
 * @param {undefined | Function} arePropsEqualFn
 * @returns {MemoizedFn}
 */
export function memo(componentFn, arePropsEqualFn) {
  const componentFnName = componentFn.name;
  // if this is a re-render, don't reset existing values i.e. lastProps
  if (!memoizedFunctionsMap.has(componentFnName)) {
    memoizedFunctionsMap.set(componentFnName, {
      arePropsEqualFn,
    });
  }

  return new MemoizedFn(componentFn);
}
