import MeactElement from "./element";

/// discarding this in favour of component call stack

// export const currActiveComponentForHooks = {
//   // 1.
//   referenceValue: null,
//
//   /**
//    * @returns {MeactElement | null}
//    */
//   get() {
//     return this.objectRef;
//   },
//   /**
//    * @param {MeactElement | null} newReferenceValue
//    */
//   set(newReferenceValue) {
//     this.referenceValue = newReferenceValue;
//   },
// };

// or, 2. use a global stack to keep track of current ReactComponent being rendered

// this should mimic the function call stack top-down
export const componentFnCallStack = {
  stack: [],

  /**
   * call this to get component function definition being executed currently
   */
  getComponentFnCurrInExecutionContext() {
    this.stack[this.stack.length - 1];
  },

  /**
   * call this to set a new component function as the execution context
   * just before it's function definition is invoked
   * @param {MeactElement} componentObjectRef
   */
  setComponentFnInExecutionContext(componentObjectRef) {
    this.stack.push(componentObjectRef);
  },

  /**
   * call this to remove a component function definition from the call stack
   * just after it's return block is done with execution (i.e. fully evaluated)
   */
  removeComponentFnFromExecutionContext() {
    this.stack.pop();
  },
};
