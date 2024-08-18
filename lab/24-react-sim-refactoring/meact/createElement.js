import MeactElement from "./element.js";
import { componentFnCallStack } from "./executionContext.js";
import { globalMeactComponentRegistry } from "./utils.js";
import { MemoizedFunction } from "./memo.js";

/**
 * call this function to recusrively create a render sub-tree of MeactElement objects
 * on the initial/first render rooted at this element param as the entry point
 * and make sure to call it after initializing state hooks
 *
 * since this is a recursion, so `createElement` expressions in the children param
 * are evaluated to base MeactElement firs, and so we eventually reach atomic html elements
 *
 * @param {null | string | function | MemoizedFunction} element
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
      element instanceof MemoizedFunction
    )
  ) {
    throw new Error(
      "Invalid argument of createElement: element must be one of null, string, function, or memoized function"
    );
  }

  // default type, name and props
  const propsObject = props === undefined || !props ? {} : props;

  let type = element
    ? typeof element === "function"
      ? "MeactComponent"
      : element === "text"
      ? "MeactTextElement"
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

  /// if it's a null element
  if (!element) {
    return new MeactElement(type, name, {}, []);
  }

  /// if it's a text element
  // our "text" type element is not directly mapped to a <text> node in the DOM,
  // hence keeping its handling here separate from type "MeactHtmlElement" is cleaner
  if (type === "MeactTextElement") {
    return new MeactElement(type, name, propsObject, []);
  }

  /// if it's a memoized component
  // forward its props and createElement call to create the component it's memoizing
  if (element instanceof MemoizedFunction) {
    const memoizedFunction = element.componentFn;

    // update the value of lastProps property on this MemoizedFunction instance
    element.setLastProps(propsObject);

    return createElement(memoizedFunction, propsObject, ...childrenArray);
  }

  // if this is a component
  if (typeof element === "function") {
    if (!name) {
      throw new Error(
        `Anonymous function cannot be used as a component, please use named function only`
      );
    }

    // ! register this function into the global scope for direct access during re-rendering
    globalMeactComponentRegistry.set(element.name, element);

    // creating its Render Tree node beforehand to get its ID for handling hooks in its context
    // also, must preserve whole of its argument to reuse in case of its re-rendering
    const meactComponent = new MeactElement(
      type,
      name,
      propsObject,
      [],
      // snapshot of children elements passed by the parent component via props (i.e. render props)
      childrenArray
    );

    // ! if this component is coming from the return block of currently executing component's function
    // then return its skeleton only since its execution will be handled after the return block is executed and context is updated
    const currComponentInExecution =
      componentFnCallStack.getComponentFnCurrInExecutionContext();
    if (currComponentInExecution && currComponentInExecution.name !== name) {
      return meactComponent;
    }

    // ! else, handle the execution of this component's function and how nested createElement calls should be handled from within its return block
    handleComponentFunctionExecution(meactComponent);

    return meactComponent;
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

// handle the execution of this component's function and how nested createElement calls should be handled from within its return block
// send this MeactElement to createComponent function for locally scoped top-down handling
// where a child component is not created until its encapsulating parent component's function's return block is fully executed
// so that the child component gets current dynamic values from their parent element within the return block
/**
 * call this to fully create a skeleton MeactElement object
 * @param {MeactElement} meactComponentObjectReference
 * @returns updates the MeactElement object in place
 */
function handleComponentFunctionExecution(meactComponentObjectReference) {
  // ! SET this component as the context for handling hooks
  // hooks are initialized when a component's function definition is executed
  // so, if a hook is called right now then it must be corresponding to this component only
  componentFnCallStack.setComponentFnInExecutionContext(
    meactComponentObjectReference
  );

  const thisFunctionRef = globalMeactComponentRegistry.get(
    meactComponentObjectReference.name
  );

  // call the function to get the evaluated MeactElement output through its return block
  // which could have however deeply nested `createElement` calls in its children
  // call the component function with appropriate arguments
  // to create args, add children, if any, into props
  const functionArgs = {
    ...meactComponentObjectReference.props,
    children: meactComponentObjectReference.propChildrenSnapshot,
  };

  // if is this a Fragment function or a Provider function
  if (
    meactComponentObjectReference.name === "Fragment" ||
    meactComponentObjectReference.name === "MeactContextProvider"
  ) {
    const returnedChildrenArray = thisFunctionRef.call(null, functionArgs); // returns back this childrenArray itself

    const childrenElements = createChildrenElementsHelper(
      returnedChildrenArray
    );

    // now update the children elements
    meactComponentObjectReference.children = childrenElements;
  } else {
    // execution this component's function calls `createElement` recursively from inside its return block
    // MeactComponent type children returned by `createElement` call here are currently partially created
    const returnedElement = thisFunctionRef.call(null, functionArgs);

    // now update the children elements
    meactComponentObjectReference.children = [returnedElement];
  }

  // `return` block has been fully executed by now
  // REMOVE this component from the call stack
  componentFnCallStack.removeComponentFnFromExecutionContext();

  // so, let's transfer the dynamic values from Context Provider
  updateAncestralContextOfReturnedChildrenElements(
    meactComponentObjectReference
  );

  // recursively call functions for children components after the return block of this component is executed
  handleComponentFnExecutionOfReturnedElements(meactComponentObjectReference);
}

/**
 *
 * @param {MeactElement} meactElementObjectReference
 */
function handleComponentFnExecutionOfReturnedElements(
  meactElementObjectReference
) {
  meactElementObjectReference.children.forEach((childElement) => {
    // if this is a MeactComponent, then send this component for its function calling
    if (childElement.type === "MeactComponent") {
      handleComponentFunctionExecution(childElement);
    }
    // else move on to recursively handle nested children of this element
    else {
      handleComponentFnExecutionOfReturnedElements(childElement);
    }
  });
}

/**
 * call this to update the Context provided by all the ancestors for children elements got from running a component's function
 * @param {MeactElement} parentElement
 */
export function updateAncestralContextOfReturnedChildrenElements(
  parentElement
) {
  // recursively update the context from ancestors for all children
  parentElement.children.forEach((childElement) => {
    childElement.contextManager.mergeContextValuesProvidedByAncestors(
      parentElement.contextManager.values
    );

    // recursively update context of all elements constructed in one return block
    updateAncestralContextOfReturnedChildrenElements(childElement);
  });
}
