import renderTree from "@meact/render-tree";
import { currActiveComponentForHooks } from "./hooks/global.js";
import { memoizedFunctionsMap } from "./memo.js";
import { arePropsEqual, rerenderMonitor } from "./utils.js";

/**
 * call this to evaluate a subtree of the render tree on re-render (i.e. on state change)
 * since it propagates state change and rerender downwards
 * such that children, if not unmounted, should not be recreated and should reuse corresponding MeactElement object instead
 * that is, Create/Update/Delete MeactElement nodes in this sub-tree to reflect the state change in a given ReactComponent type MeactElement
 *
 * @param {MeactElement} subtreeRootNode
 * @param {number} childPosition
 * @param {null | MeactElement | RerenderTreeNodeRepr} subtreeRootNodeChildPostStateUpdate new child evaluated after state update
 * of the parent component enclosing this subtree root node
 */
export function updateSubtreeForElement(
  subtreeLevelFromStateChange,
  subtreeRootNode,
  childPosition,
  subtreeRootNodeChildPostStateUpdate
) {
  let subtreeRootNodeChildRecalculated = subtreeRootNodeChildPostStateUpdate;

  if (
    !subtreeRootNodeChildRecalculated &&
    subtreeRootNode.type === "MeactComponent"
  ) {
    // call the function with props from last render
    const functionName = subtreeRootNode.name;

    // ! FIXME Namespace should be picked from client side global scope
    // access function from build's namespace instead of `window` namespace
    if (typeof MdxToJsxBuild[functionName] !== "function") {
      console.log(`${functionName} is not a function`);
      return;
    }

    // call the function with appropriate name and args
    const functionArgs = {
      ...subtreeRootNode.props,
      children: subtreeRootNode.propChildrenSnapshot,
    };

    // check if this is a memoized function if it's not the root of state change itself
    if (
      subtreeLevelFromStateChange > 0 &&
      memoizedFunctionsMap.has(functionName)
    ) {
      // check if props has changed versus last render
      const memoizedFunctionMappedValues =
        memoizedFunctionsMap.get(functionName);

      const customArePropsEqualFn =
        memoizedFunctionMappedValues.arePropsEqualFn;

      const lastPropsOfThisMemoizedFn = memoizedFunctionMappedValues.lastProps;
      const newPropsOfThisMemoizedFn = subtreeRootNode.props;

      let arePropsSameForThisMemoizedFn = false;
      if (customArePropsEqualFn !== undefined) {
        arePropsSameForThisMemoizedFn = customArePropsEqualFn(
          lastPropsOfThisMemoizedFn,
          newPropsOfThisMemoizedFn
        );
      } else {
        arePropsSameForThisMemoizedFn = arePropsEqual(
          lastPropsOfThisMemoizedFn,
          newPropsOfThisMemoizedFn
        );
      }

      // update its mapping to latest props
      memoizedFunctionsMap.set(functionName, {
        ...memoizedFunctionsMap.get(functionName),
        lastProps: subtreeRootNode.props,
      });

      // don't do anything for the subtree rooted at this node
      if (arePropsSameForThisMemoizedFn) {
        return;
      }
    }

    // set this component as the context for handling hooks
    currActiveComponentForHooks.set(reactComponent);

    // ! FIXME Namespace should be picked from client side global scope
    // call this function to execute the component definition
    subtreeRootNodeChildRecalculated = MdxToJsxBuild[functionName].call(
      null,
      functionArgs
    );
  }

  // check if this child position is beyond exiting node's children size
  // then we don't have an existing child to update or unmount
  if (childPosition >= subtreeRootNode.children.length) {
    // mount a new child element
    createElementDuringRerender(
      subtreeRootNode,
      childPosition,
      subtreeRootNodeChildRecalculated
    );

    return;
  }

  // else, a child exists at this position of the given subtree root node
  const existingChildOfSubtreeRootNode =
    subtreeRootNode.children[childPosition];

  // is that child same type of element as the recalculated child at this position
  const shouldUpdateExistingChildOfSubtreeRootNode =
    existingChildOfSubtreeRootNode.isSameRenderTreeNodeAs({
      type: subtreeRootNodeChildRecalculated.type,
      name: subtreeRootNodeChildRecalculated.name,
      props: subtreeRootNodeChildRecalculated.props,
    });

  // if a new type of element is to added as child at this position, then
  // unmount the existing child element and mount a new child element
  if (!shouldUpdateExistingChildOfSubtreeRootNode) {
    // update the render tree
    createElementDuringRerender(
      subtreeRootNode,
      childPosition,
      subtreeRootNodeChildRecalculated
    );

    // unmount existing child element
    existingChildOfSubtreeRootNode.unmount();

    return;
  }

  // else, this child element should be kept and refreshed

  const lastProps = existingChildOfSubtreeRootNode.props;
  const newProps = subtreeRootNodeChildRecalculated.props;

  // update props of this child MeactElement
  // if it's the same element, then keep the
  existingChildOfSubtreeRootNode.props = newProps;

  // should DOM element corresponding to this MeactElement be updated or not
  if (existingChildOfSubtreeRootNode.type !== "MeactComponent") {
    const isPropsSameInRerender = arePropsEqual(lastProps, newProps);

    if (!isPropsSameInRerender) {
      // add it to re-render diff
      renderTree.rerenderDiffForDomHandler.enqueue({
        action: "updated",
        parentElement: subtreeRootNode,
        childPosition,
        targetElement: existingChildOfSubtreeRootNode, // with updated props
      });
    }
  }

  // if the child element at this childPosition is a functional component
  // then it should be handled differently since it won't have children to recurse over
  if (existingChildOfSubtreeRootNode.type === "MeactComponent") {
    // children passed from the parent component via props might have refreshed on parent component's state update
    existingChildOfSubtreeRootNode.propChildrenSnapshot =
      subtreeRootNodeChildRecalculated.propChildrenSnapshot;

    // call the recursive function which will run this component's function definition with fresh args and state
    updateSubtreeForElement(
      subtreeLevelFromStateChange + 1,
      existingChildOfSubtreeRootNode,
      0,
      null
    );
    return;
  }

  // else, existingChildOfSubtreeRootNode is a non-functional element i.e. a HTML or Null element
  // recursively update the rendering of children nodes
  const existingNumberOfChildren =
    existingChildOfSubtreeRootNode.children.length;
  const recalculatedNumberOfChildren =
    subtreeRootNodeChildRecalculated.children.length;

  // trim away extra children from the existing list
  if (recalculatedNumberOfChildren < existingNumberOfChildren) {
    for (
      let i = recalculatedNumberOfChildren;
      i < existingNumberOfChildren;
      i++
    ) {
      // add it to re-render diff
      renderTree.rerenderDiffForDomHandler.enqueue({
        action: "deleted",
        parentElement: existingChildOfSubtreeRootNode,
        childPosition: i,
        targetElement: existingChildOfSubtreeRootNode.children[i],
      });

      // unmount existing child element
      existingChildOfSubtreeRootNode.children[i].unmount();
    }

    // shrink that existing list of children
    existingChildOfSubtreeRootNode.children =
      existingChildOfSubtreeRootNode.children.slice(
        0,
        recalculatedNumberOfChildren
      );
  }

  // recursively call this function for every recalculated child against existing child
  for (let i = 0; i < recalculatedNumberOfChildren; i++) {
    updateSubtreeForElement(
      subtreeLevelFromStateChange + 1,
      existingChildOfSubtreeRootNode,
      i,
      subtreeRootNodeChildRecalculated.children[i]
    );
  }
}

/**
 * call this function to forward the task of creating a MeactElement node (i.e. subtree) to createElement function
 * by appropriately pausing and resuming its hijack during this re-render
 *
 * @param {MeactElement} subtreeRootNode
 * @param {number} childPosition
 * @param {{type: string, name: string, props: object, children: object[]}}
 */
function createElementDuringRerender(
  subtreeRootNode,
  childPosition,
  { type, name, props, children }
) {
  // pause the hijack and make createElement behave normally as it did during initial rendering
  rerenderMonitor.pauseHijackOfCreateElementFn();

  if (type === "MeactComponent") {
    name = window[name];
  }

  // create a fresh new MeactElement object/subtree
  const mountNewChildSubtree = createElement(name, props, ...children);

  // update the render tree
  subtreeRootNode.children[childPosition] = mountNewChildSubtree;

  // add it to re-render diff
  renderTree.rerenderDiffForDomHandler.enqueue({
    action: "created",
    parentElement: subtreeRootNode,
    childPosition,
    targetElement: mountNewChildSubtree,
  });

  // resume the hijack and make createElement behave differently during this re-rendering
  rerenderMonitor.resumeHijackOfCreateElementFn();
}
