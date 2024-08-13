// 1.
export const currActiveComponentForHooks = {
  referenceValue: null,
  /**
   * @returns {MeactElement | null}
   */
  get() {
    return this.referenceValue;
  },
  /**
   * @param {MeactElement | null} newReferenceValue
   */
  set(newReferenceValue) {
    this.referenceValue = newReferenceValue;
  },
};

// or, 2. use a global stack to keep track of current ReactComponent being rendered
// let reactComponentStack = [];
