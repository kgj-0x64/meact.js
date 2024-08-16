import renderTree from "./render-tree/index.js";
import { createElement } from "./createElement.js";
import { currActiveComponentForHooks } from "./hooks/global.js";
import { memoizedFunctionsMap } from "./memo.js";
import {
  arePropsEqual,
  globalMeactComponentRegistry,
  rerenderMonitor,
} from "./utils.js";

/**
 * call this to evaluate a subtree of the render tree on re-render (i.e. on state change)
 * since it propagates state change and rerender downwards
 * ! so that children, if not unmounted, should not be recreated via `createElement` and should reuse corresponding MeactElement object instead
 * that is, Create/Update/Delete MeactElement nodes in this sub-tree to reflect the state change in a given ReactComponent type MeactElement
 *
 * @param {MeactElement} existingSubtreeRootNode
 * @param {number} childPosition in the range of [0, existingSubtreeRootNode.children.length)
 * @param {null | MeactElement | RerenderTreeNodeRepr} upcomingChildNodeAtThisPosition upcoming child subtree object found on re-evaluation
 * @param {boolean} bypassMemoizationOfThisComponent
 * of the parent component enclosing this subtree root node
 */
export function updateSubtreeForExistingNode(
  existingSubtreeRootNode,
  childPosition,
  upcomingChildNodeAtThisPosition,
  bypassMemoizationOfThisComponent
) {
  let freshChildOfSubtreeRootAtThisPosition = upcomingChildNodeAtThisPosition;

  // handle function invocation if this subtree root node is a component
  // ! only Fragment and MeactContextProviderFn type functions (components) send `upcomingChildNodeAtThisPosition`
  if (
    !upcomingChildNodeAtThisPosition &&
    existingSubtreeRootNode.type === "MeactComponent"
  ) {
    const functionName = existingSubtreeRootNode.name;

    // access component's function reference from the global namespace
    const functionRef = globalMeactComponentRegistry.get(functionName);

    if (typeof functionRef !== "function") {
      console.error(`${functionName} is not a function`);
      return;
    }

    // call the function with props saved from last render
    const functionArgs = {
      ...existingSubtreeRootNode.props,
      children: existingSubtreeRootNode.propChildrenSnapshot,
    };

    // check if this is a memoized function if it's not the root of state change itself
    if (
      bypassMemoizationOfThisComponent &&
      memoizedFunctionsMap.has(functionName)
    ) {
      // check if props has changed versus last render
      const memoizedFunctionMappedValues =
        memoizedFunctionsMap.get(functionName);

      const customArePropsEqualFn =
        memoizedFunctionMappedValues.arePropsEqualFn;

      const lastPropsOfThisMemoizedFn = memoizedFunctionMappedValues.lastProps;
      const newPropsOfThisMemoizedFn = existingSubtreeRootNode.props;

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
        lastProps: existingSubtreeRootNode.props,
      });

      // don't do anything for the subtree rooted at this node
      if (arePropsSameForThisMemoizedFn) {
        return;
      }
    }

    // set this component as the context for handling hooks
    currActiveComponentForHooks.set(existingSubtreeRootNode);

    // call this function to execute the component definition
    freshChildOfSubtreeRootAtThisPosition = functionRef.call(
      null,
      functionArgs
    );
  }

  /// ! argument `childPosition` is bound to be in the range of [0, existingSubtreeRootNode.children.length)

  // so, a child exists at this position of the given subtree root node
  const existingChildOfSubtreeRootAtThisPosition =
    existingSubtreeRootNode.children[childPosition];

  // is that child same type of element as the recalculated child at this position
  const shouldUpdateExistingChildOfSubtreeRootNode =
    existingChildOfSubtreeRootAtThisPosition.isSameRenderTreeNodeAs({
      type: freshChildOfSubtreeRootAtThisPosition.type,
      name: freshChildOfSubtreeRootAtThisPosition.name,
      props: freshChildOfSubtreeRootAtThisPosition.props,
    });

  /// if a new type of element is to added as child at this position, then

  // unmount the existing child element and mount a new child element
  if (!shouldUpdateExistingChildOfSubtreeRootNode) {
    // update the render tree
    createElementDuringRerender(
      existingSubtreeRootNode,
      childPosition,
      freshChildOfSubtreeRootAtThisPosition
    );

    // unmount existing child element
    existingChildOfSubtreeRootAtThisPosition.unmount();

    return;
  }

  /// else, this child element should be kept and refreshed

  const lastProps = existingChildOfSubtreeRootAtThisPosition.props;
  const newProps = freshChildOfSubtreeRootAtThisPosition.props;

  // update props of this retained child MeactElement
  existingChildOfSubtreeRootAtThisPosition.props = newProps;

  /// should DOM element corresponding to this MeactElement be updated or not

  if (existingChildOfSubtreeRootAtThisPosition.type === "MeactHtmlElement") {
    const isPropsSameAcrossRerender = arePropsEqual(lastProps, newProps);

    if (!isPropsSameAcrossRerender) {
      // add it to re-render diff
      renderTree.rerenderDiffForDomHandler.enqueue({
        action: "updated",
        parentElement: existingSubtreeRootNode,
        childPosition,
        targetElement: existingChildOfSubtreeRootAtThisPosition, // with updated props
      });
    }
  }

  // if the child element at this childPosition is a functional component
  // then it should be handled differently since it won't have children to recurse over

  // ! especially for type Fragment and which are handled in the normal `createElement` flow like MeactHtmlElement nodes
  // since Fragment has multiple children from render props but no useful (component-like) return block
  const multiChildrenFnComponent =
    existingChildOfSubtreeRootAtThisPosition.name === "Fragment" ||
    existingChildOfSubtreeRootAtThisPosition.name === "MeactContextProviderFn";

  if (
    existingChildOfSubtreeRootAtThisPosition.type === "MeactComponent" &&
    !multiChildrenFnComponent
  ) {
    // children passed from the parent component via props might have refreshed on parent component's state update

    existingChildOfSubtreeRootAtThisPosition.propChildrenSnapshot =
      freshChildOfSubtreeRootAtThisPosition.propChildrenSnapshot;

    // call the recursive function which will run this component's function definition with fresh args and state
    updateSubtreeForExistingNode(
      existingChildOfSubtreeRootAtThisPosition,
      0,
      null,
      false
    );

    return;
  }

  // else, existingChildOfSubtreeRootNode is a non-functional element i.e. a HTML or Null element
  // recursively update the rendering of children nodes
  updateSubtreeOfChildrenElementsHelper(
    existingChildOfSubtreeRootAtThisPosition,
    freshChildOfSubtreeRootAtThisPosition
  );
}

function updateSubtreeOfChildrenElementsHelper(
  existingSubtreeChildNode,
  freshSubtreeChildNode
) {
  // evaluate if number of children of this node has decreased or not
  const numOfChildrenOfExistingSubtreeChildNode =
    existingSubtreeChildNode.children.length;
  const numOfChildrenOfFreshSubtreeChildNode =
    freshSubtreeChildNode.children.length;

  const lesserChildrenCount = Math.min(
    numOfChildrenOfExistingSubtreeChildNode,
    numOfChildrenOfFreshSubtreeChildNode
  );
  const biggerChildrenCount = Math.max(
    numOfChildrenOfExistingSubtreeChildNode,
    numOfChildrenOfFreshSubtreeChildNode
  );

  // recursively call this function for every recalculated child against existing child
  for (let i = 0; i < biggerChildrenCount; i++) {
    const freshSubtreeGrandchildNode = freshSubtreeChildNode.children[i];

    if (i < lesserChildrenCount) {
      updateSubtreeForExistingNode(
        existingSubtreeChildNode,
        i,
        freshSubtreeGrandchildNode,
        false
      );
    }

    // check if this child position is beyond exiting node's children size
    // then we don't have an existing child to update or unmount
    // so, mount new child subtrees at these positions
    if (
      i > lesserChildrenCount &&
      numOfChildrenOfFreshSubtreeChildNode >
        numOfChildrenOfExistingSubtreeChildNode
    ) {
      // mount a new child subtree (i.e. MeactElement object)
      createElementDuringRerender(
        existingSubtreeChildNode,
        i,
        freshSubtreeGrandchildNode
      );
    }

    // trim away extra children from the existing list
    if (
      i > lesserChildrenCount &&
      numOfChildrenOfExistingSubtreeChildNode >
        numOfChildrenOfFreshSubtreeChildNode
    ) {
      // add it to re-render diff
      renderTree.rerenderDiffForDomHandler.enqueue({
        action: "deleted",
        parentElement: existingSubtreeChildNode,
        childPosition: i,
        targetElement: existingSubtreeChildNode.children[i],
      });

      // unmount existing child element
      existingSubtreeChildNode.children[i].unmount();
    }
  }

  // handling this out of the common loop
  if (
    numOfChildrenOfExistingSubtreeChildNode >
    numOfChildrenOfFreshSubtreeChildNode
  ) {
    // shrink that existing list of children
    existingSubtreeChildNode.children = existingSubtreeChildNode.children.slice(
      0,
      numOfChildrenOfFreshSubtreeChildNode
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
