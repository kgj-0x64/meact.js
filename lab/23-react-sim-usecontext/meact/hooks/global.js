export const currActiveComponentForHooks = {
  // 1.
  referenceValue: null,
  // or, 2. use a global stack to keep track of current ReactComponent being rendered
  //  referenceValue: [],
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
