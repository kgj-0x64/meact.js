/**
 * call this to get a unique ID for a ReactElement
 * @param {string} elementName
 * @returns {string}
 */
let nextId = 0;
function getnewElementId(elementName) {
  const id = nextId++;
  const instanceId = `${
    elementName ? elementName.toLowerCase() : "null"
  }-${id}`;
  return instanceId;
}

/**
 * A "render tree" is a tree of objects which is created as the store of all info needed
 * to construct the browser DOM in react-dom.js on every render and re-render
 */
const renderTree = {
  // root node of the render tree
  rootNode: null,
  // how many times this app has been rendered (or rerendered) in browser
  domRefreshCounter: 0,

  /**
   * call this to update the root node and thus this whole render tree
   * @param {ReactElement} reactElement new root node
   */
  setRootNode(reactElement) {
    this.rootNode = reactElement;
    // reset the render counter
    this.domRefreshCounter = 0;
  },

  /**
   * call this for housekeeping after every render and re-render activity on the browser DOM
   */
  postRenderHandler() {
    this.domRefreshCounter += 1;
    // reset the hooks counter for all react elements in the render tree
    resetHooksCallCounters(this.rootNode);
    console.log("Post Render Cleanup Done!");
  },

  /**
   * call this to re-paint the browser DOM in sync with this updated sub-tree of the already painted render tree
   * @param {ReactElement} reactSubtree
   */
  reRender(reactSubtree) {
    console.log("Re-render from subtree", reactSubtree.id);
    browserDomWriter.rerenderTheDiff(this.rootNode, reactSubtree);
  },
};

/**
 * A React Element object is a node in our "render tree"
 */
class ReactElement {
  /**
   * @param {"NullComponent" | "ReactComponent" | "ReactHtmlElement"} type
   * @param {string} name
   * @param {object} props
   * @param {ReactElement[]} children
   * @param {ReactElement[]} propChildrenSnapshot
   */
  constructor(
    type,
    name,
    props = {},
    children = [],
    propChildrenSnapshot = undefined
  ) {
    // ID of this element to uniquely identify an instance of it
    this.id = getnewElementId(name);
    // type of this element
    this.type = type;
    // name of this element
    this.name = name;
    // set of props set on this element
    this.props = props ? props : {}; // map-like object
    // children passed by parent component to a ReactComponent via props (saved for use during re-rendering)
    this.propChildrenSnapshot =
      type === "ReactComponent" ? propChildrenSnapshot : undefined;
    // ordered collection of children elements of this element
    this.children = children; // array
    // in this render, number of hook calls seen by this React Component
    this.hooksCallCounter =
      type === "ReactComponent"
        ? {
            values: {},

            /**
             * call this to increment the counter value of this React Element against a given hook name e.g. "useState"
             * @param {string} hookName
             */
            increment(hookName) {
              this.values[hookName] =
                hookName in this.values ? this.values[hookName] + 1 : 1;
              console.log(
                `incremented hook [${hookName}]`,
                this.values[hookName]
              );
            },

            /**
             * call this to reset the hooks call counter values of this React Element after every render or re-render
             */
            reset() {
              this.values = {};
            },
          }
        : undefined;
    // state manager useful for an element of type "ReactComponent"
    this.stateManager =
      type === "ReactComponent"
        ? {
            // ordered collection of state values of this component
            values: [],

            /**
             * call this to update state value at a given hook position of this React Element
             * @param {number} index
             * @param {any} newValue
             */
            updateValue: (index, newValue) => {
              this.stateManager.values[index] = newValue;
              console.log("this.stateManager.values", this.stateManager.values);
              // re-render the subtree of the render tree which is rooted at this element
              updateSubtreeForElement(this, 0, null);
              // repaint the browser DOM
              renderTree.reRender(this);
            },
          }
        : undefined;
  }

  /**
   * call this to check whether a React Element object representation created
   * at this ReactElement node's position during a re-render
   * represents this same ReactElement node in the render tree or not
   * @param {{type: string, name: string, props: object}} param0
   * @returns {boolean}
   */
  isSameRenderNodeAs({ type, name, props }) {
    if (this.type !== type || this.name !== name) {
      return false;
    }

    const elementKey = "key" in this.props ? this.props.key : null;
    const compareToKey = "key" in props ? props.key : null;
    if (elementKey) {
      return elementKey === compareToKey;
    } else {
      return !compareToKey;
    }
  }

  /**
   * call this to trigger actions on unmounting of this React Element
   */
  unmount() {
    console.log("Unmount this React Element", this.id);
  }

  /**
   * call this to pretty-plot the render tree beginning from this node in browser for visual debugging
   */
  plotRenderTree() {
    new ReactElementTreeDebugger(this).renderTreeInHtmlDocument();
  }
}

/**
 * A Re-render Tree Node Repr object is just a convenient representation of a possible React Element node during re-rendering
 */
class RerenderTreeNodeRepr {
  /**
   * @param {"NullComponent" | "ReactComponent" | "ReactHtmlElement"} type
   * @param {string} name
   * @param {null | string | function} element
   * @param {object} props
   * @param {ReactElement[]} children
   */
  constructor(type, name, props = {}, children = []) {
    // type of this node
    this.type = type;
    // name of this node
    this.name = name;
    // set of props set on this node
    this.props = props ? props : {}; // map-like object
    // ordered collection of children nodes of this node
    this.children = children; // array
  }
}

/**
 * call this function to recusrively create a render sub-tree of ReactElement objects
 * on the initial/first render rooted at this element param as the entry point
 * and make sure to call it after initializing state hooks
 *
 * since this is a recursion, so `createElement` expressions in the children param
 * are evaluated to base ReactElement firs, and so we eventually reach atomic html elements
 *
 * @param {null | string | function} element
 * @param {object} props
 * @param  {ReactElement[]} children
 * @returns {ReactElement | RerenderTreeNodeRepr}
 */
function createElement(element, props, ...children) {
  // default type, props and children
  let type = element
    ? typeof element === "function"
      ? "ReactComponent"
      : "ReactHtmlElement"
    : "NullComponent";
  let name = element
    ? typeof element === "function"
      ? element.name
      : element
    : "null";
  const propsObject = props === undefined || !props ? {} : props;

  // if it's a null element
  if (!element) {
    return new ReactElement(type, name, {}, []);
  }

  // if this is a React component
  if (typeof element === "function") {
    // creating it beforehand to get its ID for handling hooks in its context
    // preserve whole of its argument to reuse in case of its re-rendering
    const reactComponent = new ReactElement(
      type,
      name,
      propsObject,
      [],
      // snapshot of children elements passed by the parent component via props
      children
    );

    // if this is happening within a re-render, don't call the function just yet
    // check whether it should be hijacked for just passing the arguments to
    // `updateSubtreeForElement` for mount/unmount decisions and updated set of children
    if (rerenderMonitor.isCreateElementFunctionHijacked()) {
      return reactComponent;
    }

    // hooks are initialized when a ReactComponent's function logic
    // and thus its hooks are executed
    // so, if a hook is called right now then it must be corresponding to this component only

    // set this component as the context for handling hooks
    // 1.
    reactComponentForHooks = reactComponent;
    // or, 2.
    // PUSH the current component to the stack before rendering
    // reactComponentStack.push(reactComponent);

    // call the component function with appropriate arguments
    // to create args, add children, if any, into props
    const functionArgs = {
      ...propsObject,
      children,
    };

    // call the function to get the evaluated ReactElement output through its return block
    // which could have however deeply nested `createElement` calls in its children
    const returnedElement = element(functionArgs);

    reactComponent.children = [returnedElement];

    // or, 2.
    // POP the component from the stack after rendering
    // reactComponentStack.pop();

    return reactComponent;
  }

  /// else
  let childrenElements = [];

  if (children !== undefined && children && children.length > 0) {
    for (let i = 0; i < children.length; i++) {
      const child = children[i];

      const childElement =
        typeof child === "string"
          ? createElement("text", { content: child })
          : child;

      childrenElements.push(childElement);
    }
  }

  const htmlElement = new ReactElement(
    type,
    name,
    propsObject,
    childrenElements
  );
  return htmlElement;
}

// 1.
let reactComponentForHooks = null;
// or, 2. use a global stack to keep track of current ReactComponent being rendered
// let reactComponentStack = [];

/**
 * useState hook
 * @param {any} initialValue
 * @returns [any, function]
 */
function useState(initialValue) {
  /**
   * ! ALERT
   *
   * Closures capture variables by reference, not by value.
   *
   * If we were directly using the global reference variable `reactComponentForHooks` inside the inner function `setStateValue`, then:
   * - Due to closure, the `setStateValue` function captures a reference to the variable `reactComponentForHooks` and not its value.
   * - That is, at the time `setStateValue` is defined, `setStateValue` holds a reference to the `reactComponentForHooks` variable itself,
   * - not just its value.
   * - Therefore, any updates to the `reactComponentForHooks` variable
   * - after `setStateValue` is defined will be reflected when `setStateValue` is called.
   *
   * But the global variable `reactComponentForHooks` itself is a reference to different ReactElement object changing in each run of `createElemet` function.
   * So, if we use the global reference directly inside `setStateValue` function,
   * then by the time `setStateValue` is called,
   * it'll always get reference to the last leaf ReactComponent object.
   *
   * The solution is:
   * 1. to simply create a copy of the global reference avriable inside the lexical scope of `useState` function and not change it, or
   * 2. use a different global variable like a stack (array of references)
   */

  // 1.
  // copying an object reference variable creates one more reference to the same object
  // so, this local variable is assigned the value of global reference variable `reactComponentForHooks` at the time `useState` is called
  const reactComponentForThisHook = reactComponentForHooks;

  // Or, 2.
  // const reactComponentForThisHook = reactComponentStack[reactComponentStack.length - 1];

  if (
    !reactComponentForThisHook ||
    !reactComponentForThisHook.hooksCallCounter
  ) {
    throw new Error("useState must be used within a function component");
  }

  console.log("useState hook called for", reactComponentForThisHook.id);

  // how many useState calls have been made for this component in this render
  let useStateCallCount = 0;
  if ("useState" in reactComponentForThisHook.hooksCallCounter.values) {
    useStateCallCount =
      reactComponentForThisHook.hooksCallCounter.values["useState"];
  }

  const { values } = reactComponentForThisHook.stateManager;
  let stateValue;

  // do we have a state value at (useStateCallCount+1) position already
  if (values.length > useStateCallCount) {
    // GET value from last render
    stateValue = values[useStateCallCount];
  } else {
    // SET initial value
    stateValue = initialValue;
    values.push(stateValue);
  }

  const stateIndex = useStateCallCount;

  // now, this inner function `setStateValue` captures `reactComponentForThisHook` by reference,
  // which is local to and constant in the scope of `useState` function
  // so, it will always refer to the same `ReactElement` object within a specific `useState` call's context
  /**
   * call this to trigger a state update
   * @param {any} newValue
   */
  function setStateValue(newValue) {
    console.log("Updating state in:", reactComponentForThisHook.id);
    reactComponentForThisHook.stateManager.updateValue(stateIndex, newValue);
  }

  // update the call counter
  reactComponentForThisHook.hooksCallCounter.increment("useState");

  return [stateValue, setStateValue];
}

/**
 * Re-render monitor object to enforce different return behaviour of `createElement` function during re-render dynamically
 */
const rerenderMonitor = {
  isHijackOfCreateElementFnPaused: false,
  isCreateElementFunctionHijacked() {
    if (this.isHijackOfCreateElementFnPaused) {
      return false;
    }
    return renderTree.domRefreshCounter > 0;
  },
  pauseHijackOfCreateElementFn() {
    this.isHijackOfCreateElementFnPaused = true;
  },
  resumeHijackOfCreateElementFn() {
    this.isHijackOfCreateElementFnPaused = false;
  },
};

/**
 * call this to evaluate a subtree of the render tree on re-render (i.e. on state change)
 * since it propagates state change and rerender downwards
 * such that children, if not unmounted, should not be recreated and should reuse corresponding ReactElement object instead
 * that is, Create/Update/Delete ReactElement nodes in this sub-tree to reflect the state change in a given ReactComponent type ReactElement
 *
 * @param {ReactElement} subtreeRootNodeBeforeRerender
 * @param {number} childPosition
 * @param {null | ReactElement | RerenderTreeNodeRepr} subtreeRootNodeChildPostStateUpdate new child evaluated after state update
 * of the parent React component enclosing this subtree root node
 */
function updateSubtreeForElement(
  subtreeRootNode,
  childPosition,
  subtreeRootNodeChildPostStateUpdate
) {
  console.log(
    "UPDATE Subtree Root Node",
    subtreeRootNode,
    childPosition,
    subtreeRootNodeChildPostStateUpdate
  );

  let subtreeRootNodeChildRecalculated = subtreeRootNodeChildPostStateUpdate;

  if (
    !subtreeRootNodeChildRecalculated &&
    subtreeRootNode.type === "ReactComponent"
  ) {
    // call the function with props from last render
    const functionName = subtreeRootNode.name;

    // sanity check
    if (typeof window[functionName] !== "function") {
      console.log(`${functionName} is not a function`);
      return;
    }

    // set this component as the context for handling hooks
    reactComponentForHooks = subtreeRootNode;

    // ! call the function with appropriate name and args
    const functionArgs = {
      ...subtreeRootNode.props,
      children: subtreeRootNode.propChildrenSnapshot,
    };

    subtreeRootNodeChildRecalculated = window[functionName].call(
      null,
      functionArgs
    );
  }

  console.log(
    "subtreeRootNodeChildRecalculated",
    subtreeRootNodeChildRecalculated
  );

  // check if this child position is beyond exiting node's children size
  // then we don't have an existing child to update or unmount
  if (childPosition >= subtreeRootNode.children.length) {
    // mount a new child element
    const mountNewChildSubtree = createElementDuringRerender(
      subtreeRootNodeChildRecalculated
    );

    // update the render tree
    subtreeRootNode.children[childPosition] = mountNewChildSubtree;

    return;
  }

  // else, a child exists at this position of the given subtree root node
  const existingChildOfSubtreeRootNode =
    subtreeRootNode.children[childPosition];
  console.log("existingChildOfSubtreeRootNode", existingChildOfSubtreeRootNode);

  // is that child same type of element as the recalculated child at this position
  const shouldUpdateExistingChildOfSubtreeRootNode =
    existingChildOfSubtreeRootNode.isSameRenderNodeAs({
      type: subtreeRootNodeChildRecalculated.type,
      name: subtreeRootNodeChildRecalculated.name,
      props: subtreeRootNodeChildRecalculated.props,
    });
  console.log(
    "shouldUpdateExistingChildOfSubtreeRootNode",
    shouldUpdateExistingChildOfSubtreeRootNode
  );

  // unmount the existing child element and mount a new child element
  if (!shouldUpdateExistingChildOfSubtreeRootNode) {
    const mountNewChildSubtree = createElementDuringRerender(
      subtreeRootNodeChildRecalculated
    );

    // existing child element in the subtree
    const existingChildSubtree = subtreeRootNode.children[childPosition];

    // update the render tree
    subtreeRootNode.children[childPosition] = mountNewChildSubtree;

    // unmount existing child element
    existingChildSubtree.unmount();

    return;
  }

  // else, this child element should be kept and refreshed
  // update props of this child React Element
  existingChildOfSubtreeRootNode.props = subtreeRootNodeChildRecalculated.props;

  // recursively update the rendering of children nodes
  const existingNumberOfChildren =
    existingChildOfSubtreeRootNode.children.length;
  const recalculatedNumberOfChildren =
    subtreeRootNodeChildRecalculated.children.length;

  console.log("existingNumberOfChildren", existingNumberOfChildren);
  console.log("recalculatedNumberOfChildren", recalculatedNumberOfChildren);

  // trim away extra children from the existing list
  if (recalculatedNumberOfChildren < existingNumberOfChildren) {
    for (
      let i = recalculatedNumberOfChildren;
      i < existingNumberOfChildren;
      i++
    ) {
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
      existingChildOfSubtreeRootNode,
      i,
      subtreeRootNodeChildRecalculated.children[i]
    );
  }
}

/**
 * call this function to forward the task of creating a ReactElement node (i.e. subtree) to createElement function
 * by appropriately pausing and resuming its hijack during this re-render
 *
 * @param {{type: string, name: string, props: object, children: object[]}}
 * @returns {ReactElement}
 */
function createElementDuringRerender({ type, name, props, children }) {
  // pause the hijack and make createElement behave normally as it did during initial rendering
  rerenderMonitor.pauseHijackOfCreateElementFn();

  console.log("createElementDuringRerender", type, name, props, children);

  if (type === "ReactComponent") {
    name = window[name];
  }

  // create a fresh new React Element object/subtree
  const mountNewChildSubtree = createElement(name, props, ...children);
  console.log("mountNewChildSubtree", mountNewChildSubtree);

  // resume the hijack and make createElement behave differently during this re-rendering
  rerenderMonitor.resumeHijackOfCreateElementFn();

  return mountNewChildSubtree;
}

/**
 * call this to reset the hooks call counters of all the nodes in a render tree rooted at the given `reactElement` node
 * @param {ReactElement} reactElement
 */
function resetHooksCallCounters(reactElement) {
  if (reactElement.type === "ReactComponent") {
    // reset number of hook calls seen by this React Component
    reactElement.hooksCallCounter.reset();
  }

  for (let i = 0; i < reactElement.children.length; i++) {
    const child = reactElement.children[i];
    resetHooksCallCounters(child);
  }
}

/**
 * Helper class to pretty-plot a render tree rooted at the given `reactElement` node
 */
class ReactElementTreeDebugger {
  /**
   * @param {ReactElement} reactElement
   */
  constructor(reactElement) {
    this.node = reactElement;
    this.treeContainer = document.getElementById("react-element-tree");
  }

  /**
   * call this trigger function to create browser DOM from the root node of a given render tree
   * and append it at the appropriate DOM position in the HTML document
   */
  renderTreeInHtmlDocument() {
    this.treeContainer.innerHTML = ""; // Clear any existing content
    this.createHtmlForTreeNode(this.node, 0);
  }

  /**
   * call this to create browser DOM from the root node of a given render tree
   * @param {ReactElement} node
   * @param {number} level
   */
  createHtmlForTreeNode(node, level = 0) {
    // margin to leave on the left to align with parent node
    const leftMargin = "_".repeat(level * 2);
    const nestedLeftMargin = "_".repeat((level + 1) * 2);

    // node's name
    const nodeNameSpan = document.createElement("span");
    nodeNameSpan.className = "react-element-tree-node";
    nodeNameSpan.innerText = `${leftMargin}_node: ${node.name}`;
    this.treeContainer.appendChild(nodeNameSpan);

    // node's type
    const nodeTypeSpan = document.createElement("span");
    nodeTypeSpan.className = "react-element-tree-node";
    nodeTypeSpan.innerText = `${nestedLeftMargin}_type: ${node.type}`;
    this.treeContainer.appendChild(nodeTypeSpan);

    // node's ID
    const nodeIdSpan = document.createElement("span");
    nodeIdSpan.className = "react-element-tree-node";
    nodeIdSpan.innerText = `${nestedLeftMargin}_id: ${node.id}`;
    this.treeContainer.appendChild(nodeIdSpan);

    if (node.type === "ReactComponent") {
      // node's state
      const nodeStateSpan = document.createElement("span");
      nodeStateSpan.className = "react-element-tree-node";
      nodeStateSpan.innerText = `${nestedLeftMargin}_STATE: "${JSON.stringify(
        node.stateManager.values
      )}"`;
      this.treeContainer.appendChild(nodeStateSpan);
    }

    // node's props
    if (node.props !== undefined && node.props) {
      for (const [key, value] of Object.entries(node.props)) {
        const nodeAttributeSpan = document.createElement("span");
        nodeAttributeSpan.className = "react-element-tree-node";
        nodeAttributeSpan.innerText = `${nestedLeftMargin}_${key}: ${JSON.stringify(
          value
        )}`;
        this.treeContainer.appendChild(nodeAttributeSpan);
      }
    }

    // node's children
    if (node.children && node.children.length > 0) {
      node.children.forEach((child) => {
        this.createHtmlForTreeNode(child, level + 1);
      });
    }
  }
}
