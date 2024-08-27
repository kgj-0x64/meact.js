import renderTree from "./render-tree.js";
import MeactElement from "./element.js";
import {
  createElement,
  handleComponentFunctionExecution,
} from "./createElement.js";
import { bypassMemoization, memoizedFunctionsMap } from "./memo.js";
import { arePropsEqual, globalMeactComponentRegistry } from "./utils.js";

/**
 * call this to re-evaluate a subtree of the "Render Tree" on re-render (i.e. on state change)
 * since it propagates state change and re-render downwards
 * ! so that children, if not unmounted, should not be recreated via `createElement` and should reuse corresponding MeactElement object instead
 * that is, Create/Update/Delete MeactElement nodes in this sub-tree to reflect the state change in a given ReactComponent type MeactElement
 *
 * @param {MeactElement} existingSubtreeRootNode
 * @param {number} childPosition in the range of [0, existingSubtreeRootNode.children.length)
 * @param {null | MeactElement | RerenderTreeNodeRepr} upcomingChildNodeAtThisPosition
 * ^ upcoming child subtree object found on re-evaluation of the existingSubtreeRootNode
 */
export function updateSubtreeForExistingNode(
  existingSubtreeRootNode,
  childPosition,
  upcomingChildNodeAtThisPosition
) {
  // check if this is a memoized function which is not explicitly asked to be ignored
  if (
    existingSubtreeRootNode.type === "MeactComponent" &&
    !bypassMemoization.isThisSubtreeBypassed(existingSubtreeRootNode) &&
    memoizedFunctionsMap.has(existingSubtreeRootNode.name)
  ) {
    // check if props has changed versus last render
    const memoizedFunctionInstance = memoizedFunctionsMap.get(
      existingSubtreeRootNode.name
    );

    // update the value of lastProps property on this MemoizedFunction instance
    const newPropsOfThisMemoizedFn = existingSubtreeRootNode.props;
    const arePropsSameForThisMemoizedFn = memoizedFunctionInstance.setLastProps(
      newPropsOfThisMemoizedFn
    );

    // don't do anything for the subtree rooted at this node
    if (arePropsSameForThisMemoizedFn) {
      return;
    }
  }

  /// ! argument `childPosition` is bound to be in the range of [0, existingSubtreeRootNode.children.length)
  // so, a child exists at this position of the given subtree root node
  const existingChildOfSubtreeRootAtThisPosition =
    existingSubtreeRootNode.children[childPosition];

  let freshChildOfSubtreeRootAtThisPosition = upcomingChildNodeAtThisPosition;

  // handle function invocation if this subtree root node is of type MeactComponent

  // Proceed if upcomingChildNodeAtThisPosition is not null,
  // so it handles all component type elements including "Fragment" and "MeactContextProvider"
  // but it's not called when children of "Fragment" and "MeactContextProvider" are being handled
  if (
    !upcomingChildNodeAtThisPosition &&
    existingSubtreeRootNode.type === "MeactComponent"
  ) {
    // pass a new copy object, else the original object reference will be modified in place
    const copyOfExistingSubtreeRootNode = new MeactElement(
      existingSubtreeRootNode.type,
      existingSubtreeRootNode.name,
      existingSubtreeRootNode.props,
      [],
      // snapshot of children elements passed by the parent component via props (i.e. render props)
      existingSubtreeRootNode.propChildrenSnapshot
    );

    // call this function to execute the component definition
    // while using the existing MeactElement object reference for identifying the right component object hooks correspond to
    handleComponentFunctionExecution(
      copyOfExistingSubtreeRootNode,
      existingSubtreeRootNode
    );

    // handle Fragment and MeactContextProvider functions separately
    // since they return multiple children unlike typical user-defined "MeactComponent" type function
    if (
      existingSubtreeRootNode.name === "Fragment" ||
      existingSubtreeRootNode.name === "MeactContextProvider"
    ) {
      // recursively update the subtrees of children nodes
      updateSubtreeOfChildrenElementsHelper(
        existingSubtreeRootNode,
        copyOfExistingSubtreeRootNode
      );

      return;
    }

    // else, set first and only child returned from running this component's function as reconciliation target
    freshChildOfSubtreeRootAtThisPosition =
      copyOfExistingSubtreeRootNode.children[0];
  }

  /// reconcile this child position of this existing (persisted) node...

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

  // if the child element at this childPosition is not a functional component
  if (existingChildOfSubtreeRootAtThisPosition.type !== "MeactComponent") {
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

  // else, it should be handled differently

  if (existingChildOfSubtreeRootAtThisPosition.type === "MeactComponent") {
    // children passed from the parent component via props might have refreshed on parent component's state update

    existingChildOfSubtreeRootAtThisPosition.propChildrenSnapshot =
      freshChildOfSubtreeRootAtThisPosition.propChildrenSnapshot;

    // call the recursive function which will run this component's function definition with fresh args and state
    updateSubtreeForExistingNode(
      existingChildOfSubtreeRootAtThisPosition,
      0,
      null
    );

    return;
  }

  // else, existingChildOfSubtreeRootNode is a non-functional element i.e. a HTML or Null element
  // we have already updates its props
  // now, recursively update the subtrees of its children nodes
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
        freshSubtreeGrandchildNode
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
  // ! FIXME: Handle "MemoizedFunction" here
  const elementType =
    type === "MeactComponent" ? globalMeactComponentRegistry.get(name) : name;

  // create a fresh new MeactElement object/subtree
  const mountNewChildSubtree = createElement(elementType, props, ...children);

  // update the render tree
  subtreeRootNode.children[childPosition] = mountNewChildSubtree;

  // add it to re-render diff
  renderTree.rerenderDiffForDomHandler.enqueue({
    action: "created",
    parentElement: subtreeRootNode,
    childPosition,
    targetElement: mountNewChildSubtree,
  });
}
