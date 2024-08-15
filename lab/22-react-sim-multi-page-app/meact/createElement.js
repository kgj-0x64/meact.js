import MeactElement from "./element.js";
import { currActiveComponentForHooks } from "./hooks/global.js";
import { globalMeactComponentRegistry, rerenderMonitor } from "./utils.js";
import { MemoizedFn, memoizedFunctionsMap } from "./memo.js";

/**
 * call this function to recusrively create a render sub-tree of MeactElement objects
 * on the initial/first render rooted at this element param as the entry point
 * and make sure to call it after initializing state hooks
 *
 * since this is a recursion, so `createElement` expressions in the children param
 * are evaluated to base MeactElement firs, and so we eventually reach atomic html elements
 *
 * @param {null | string | function} element
 * @param {object} props
 * @param  {MeactElement[]} children
 * @returns {MeactElement | RerenderTreeNodeRepr}
 */
export function createElement(element, props, ...children) {
  if (
    !(
      element === null ||
      typeof element === "string" ||
      typeof element === "function" ||
      element instanceof MemoizedFn
    )
  ) {
    throw new Error(
      "Invalid argument of createElement: element must be null, string, function, or memoized function"
    );
  }

  // default type, name and props
  const propsObject = props === undefined || !props ? {} : props;
  let type = element
    ? typeof element === "function"
      ? "MeactComponent"
      : "ReactHtmlElement"
    : "NullComponent";
  let name = element
    ? typeof element === "function"
      ? element.name
      : element
    : "null";
  // handle case where explicit `undefined` is sent as the last argument
  const childrenArray =
    Array.isArray(children) && children.length > 0 && children[0] !== undefined
      ? children
      : [];

  // if it's a null element
  if (!element) {
    return new MeactElement(type, name, {}, []);
  }

  // if it's a memoized component
  if (element instanceof MemoizedFn) {
    const memoizedFunction = element.componentFn;
    const memoizedFunctionName = memoizedFunction.name;

    // set (insert) lastProps value only if it's the initial render,
    // since it'll be set (updated) for re-renders in `updateSubtreeForElement` function
    if (renderTree.domRefreshCounter === 0) {
      memoizedFunctionsMap.set(memoizedFunctionName, {
        ...memoizedFunctionsMap.get(memoizedFunctionName),
        lastProps: propsObject,
      });
    }

    return createElement(memoizedFunction, props, ...childrenArray);
  }

  // if this is a component
  if (typeof element === "function") {
    if (!name) {
      throw new Error(
        `Anonymous function cannot be used as a component, please use named function only`
      );
    }

    // creating its Render Tree node beforehand to get its ID for handling hooks in its context
    // preserve whole of its argument to reuse in case of its re-rendering
    const reactComponent = new MeactElement(
      type,
      name,
      propsObject,
      [],
      // snapshot of children elements passed by the parent component via props
      childrenArray
    );

    // if this is happening within a re-render, don't call the function just yet
    // check whether it should be hijacked for just passing the arguments to
    // `updateSubtreeForElement` for mount/unmount decisions and updated set of children
    if (rerenderMonitor.isCreateElementFunctionHijacked()) {
      return reactComponent;
    }

    // register this function into the global scope for direct access during re-rendering
    globalMeactComponentRegistry.set(element.name, element);

    // if is this a Fragment function
    if (element.name === "Fragment") {
      const returnedChildrenArray = element({ children: childrenArray }); // returns back this childrenArray
      const childrenElements = createChildrenElementsHelper(
        returnedChildrenArray
      );
      reactComponent.children = childrenElements;
      return reactComponent;
    }

    // hooks are initialized when a ReactComponent's function logic
    // and thus its hooks are executed
    // so, if a hook is called right now then it must be corresponding to this component only

    // set this component as the context for handling hooks
    // 1.
    currActiveComponentForHooks.set(reactComponent);
    // or, 2.
    // PUSH the current component to the stack before rendering
    // reactComponentStack.push(reactComponent);

    // call the component function with appropriate arguments
    // to create args, add children, if any, into props
    const functionArgs = {
      ...propsObject,
      children: childrenArray,
    };

    // call the function to get the evaluated MeactElement output through its return block
    // which could have however deeply nested `createElement` calls in its children
    const returnedElement = element(functionArgs);

    // if (!(returnedElement instanceof MeactElement)) {
    //   throw new Error(
    //     `A component must return only one and a valid child element`
    //   );
    // }

    reactComponent.children = [returnedElement];

    // or, 2.
    // POP the component from the stack after rendering
    // reactComponentStack.pop();

    return reactComponent;
  }

  /// else
  const childrenElements = createChildrenElementsHelper(childrenArray);

  const htmlElement = new MeactElement(
    type,
    name,
    propsObject,
    childrenElements
  );
  return htmlElement;
}

/**
 *
 * @param {Array} childrenArray
 * @returns {Array}
 */
function createChildrenElementsHelper(childrenArray) {
  let childrenElements = [];
  if (childrenArray.length > 0) {
    for (let i = 0; i < childrenArray.length; i++) {
      const child = childrenArray[i];

      // child is either `createElement()` call or text content
      const childElement =
        child instanceof MeactElement
          ? child
          : createElement("text", { content: child });

      childrenElements.push(childElement);
    }
  }

  return childrenElements;
}
