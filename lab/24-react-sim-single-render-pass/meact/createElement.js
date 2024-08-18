import MeactElement from "./element.js";
import { componentFnCallStack } from "./callStack.js";
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
      : "MeactHtmlElement"
    : "NullComponent";

  let name = element
    ? typeof element === "function"
      ? element.name
      : element
    : "null";

  // handle case where explicit [undefined] is recieved as the last argument from JSX runtime calls
  // also, [[...]] is received if we accidently (or on purpose) use `<div>{children}</div>` instead of `<div>{...children}</div>`
  const childrenArray =
    Array.isArray(children) && children.length > 0 && children[0] !== undefined
      ? Array.isArray(children[0])
        ? children[0]
        : children
      : [];

  /// leaf cases of recursion

  // if it's a null element
  if (!element) {
    return new MeactElement(type, name, {}, []);
  }

  // if it's a text element (which is not directly mapped to a <text> node in the DOM, hence keeping it separate here is cleaner
  if (element === "text") {
    return new MeactElement(type, name, propsObject, []);
  }

  // if it's a memoized component, forward its props and createElement call to the component function it's memoizing
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
    // also, must preserve whole of its argument to reuse in case of its re-rendering
    const reactComponent = new MeactElement(
      type,
      name,
      propsObject,
      [],
      // snapshot of children elements passed by the parent component via props (i.e. render props)
      childrenArray
    );

    // ! register this function into the global scope for direct access during re-rendering
    globalMeactComponentRegistry.set(element.name, element);

    // call the component function with appropriate arguments
    // to create args, add children, if any, into props
    const functionArgs = {
      ...propsObject,
      children: childrenArray,
    };

    // if is this a Fragment function
    if (element.name === "Fragment") {
      const returnedChildrenArray = element({ children: childrenArray }); // returns back this childrenArray

      const childrenElements = createChildrenElementsHelper(
        returnedChildrenArray
      );

      reactComponent.children = childrenElements;
      return reactComponent;
    }

    // ! FIXME TODO: if this `createElement` function call is happening within a re-render,
    // then the corresponding component's function definition should be executed here for new mounting via `createElementDuringRerender` only
    // while `updateSubtreeForElement` executes the function body in case of no unmounting
    if (rerenderMonitor.isCreateElementFunctionHijacked()) {
      return reactComponent;
    }

    // hooks are initialized when a ReactComponent's function definition is executed
    // so, if a hook is called right now then it must be corresponding to this component only

    // ! SET this component as the context for handling hooks
    componentFnCallStack.setComponentFnInExecutionContext(reactComponent);

    // call the function to get the evaluated MeactElement output through its return block
    // which could have however deeply nested `createElement` calls in its children
    const returnedElement = element(functionArgs);

    reactComponent.children = [returnedElement];

    // REMOVE this component from the call stack
    componentFnCallStack.removeComponentFnFromExecutionContext();

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
 * call this to create children elements
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
