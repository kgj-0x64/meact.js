let nextId = 0;
function getNewElementId(elementName) {
  const id = nextId++;
  const instanceId = `${
    elementName ? elementName.toLowerCase() : "null"
  }-${id}`;
  return instanceId;
}

// render tree which refreshes on every render and re-render
// and is used to construct the browser DOM in meact-dom.js
const renderTree = {
  // root node of the render tree
  rootNode: null,
  // how many times this app has been rendered (or rerendered) in browser
  domRefreshCounter: 0,
  // update root node thus the whole render tree
  setRootNode(meactElement) {
    this.rootNode = meactElement;
    // reset the render counter
    this.domRefreshCounter = 0;
  },
  postRenderHandler() {
    if (!this.rootNode) return;
    this.domRefreshCounter += 1;
    // reset the hooks counter for all meact elements in the render tree
    resetHooksCallCounters(this.rootNode);

    console.log("Post Render Cleanup Done!");
  },
  reRender(reactSubtree) {
    console.log("Re-render from subtree", reactSubtree.id);
    browserDomWriter.rerenderTheDiff(this.rootNode, reactSubtree);
  },
};

class MeactElement {
  constructor(type, name, props = {}, children = []) {
    // ID of this element to uniquely identify an instance of it
    this.id = getNewElementId(name);
    // type of this element
    this.type = type; // "null" | "MeactComponent" | "HtmlElement"
    // name of this element
    this.name = name;
    // set of props set on this element
    this.props = props ? props : {}; // map-like object
    // ordered collection of children elements of this element
    this.children = children; // array
    // in this render, number of hook calls seen by this component
    this.hooksCallCounter =
      type === "MeactComponent"
        ? {
            values: {},
            increment(hookName) {
              this.values[hookName] =
                hookName in this.values ? this.values[hookName] + 1 : 1;
              console.log(
                `incremented hook [${hookName}]`,
                this.values[hookName]
              );
            },
            // should be reset to 0 on every render
            reset() {
              this.values = {};
            },
          }
        : undefined;
    // state manager useful for an element of type "MeactComponent"
    this.stateManager =
      type === "MeactComponent"
        ? {
            // ordered collection of state values of this component
            values: [],
            updateValue: (index, newValue) => {
              this.stateManager.values[index] = newValue;
              console.log("this.stateManager.values", this.stateManager.values);
              updateSubtreeForElement(this, null);
              renderTree.reRender(this);
            },
          }
        : undefined;
  }

  // plot render tree beginning from this node for visual debugging
  plotRenderTree() {
    new MeactElementTreeDebugger(this).renderTreeInHtmlDocument();
  }
}

/**
 * `createElement` is just a function which can be called from anywhere
 * and it returns an object which can be used however pleased
 *
 * SO, it should be remembered that
 * creating a MeactElement node does not mean that it'll be rendered
 *
 * To be rendered,
 * it must be present in the return block of a function
 * in the function call chain initiated by ReactDOM.render()
 */

// takes an entry point as root element and
// recursively creates MeactElement objects
// since every child is another call to createElement or a text string
// so as to eventually reach atomic html elements
function createElement(element, props, ...children) {
  // default type, props and children
  let type = "null";
  let name = element;
  const propsObject = props === undefined || !props ? {} : props;

  // if it's a null element
  if (!element) {
    return new MeactElement(type, null, {}, []);
  }

  // if this is a component
  if (typeof element === "function") {
    type = "MeactComponent";
    name = element.name;

    // add children, if any, into props
    // this is the argument sent to component's function definition
    const propsWithChildren = {
      ...propsObject,
      children,
    };

    // creating it beforehand to get its ID for handling hooks in its context
    // preserve whole of its argument to reuse in case of its re-rendering
    const reactComponent = new MeactElement(type, name, propsWithChildren, []);

    // hooks are initialized when a ReactComponent's function logic
    // and thus its hooks are executed
    // so, if a hook is called right now then it must be corresponding to this component only

    // set this component as the context for handling hooks
    // 1.
    currActiveComponentForHooks = reactComponent;
    // or, 2.
    // PUSH the current component to the stack before rendering
    // reactComponentStack.push(reactComponent);

    // call the component function with the received arguments
    // to finally run a `createElement` call and return its output MeactElement through its return block
    // which could have however deeply nested `createElement` calls in its children

    const returnedElement = element(propsWithChildren);

    reactComponent.children = [returnedElement];

    // or, 2.
    // POP the component from the stack after rendering
    // reactComponentStack.pop();

    return reactComponent;
  }

  /// else
  type = "HtmlElement";
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

  const htmlElement = new MeactElement(
    type,
    name,
    propsObject,
    childrenElements
  );
  return htmlElement;
}

// evaluate a subtree on re-render (i.e. state change)
function updateSubtreeForElement(reactComponentAsSubtree, updatedProps) {
  console.log("UPDATE reactComponentAsSubtree", reactComponentAsSubtree);
  // set this component as the context for handling hooks
  currActiveComponentForHooks = reactComponentAsSubtree;

  // call the function with props from last render
  const functionName = reactComponentAsSubtree.name;
  const functionArgs = updatedProps
    ? updatedProps
    : reactComponentAsSubtree.props;

  // Rerender of `Profile` component works perfectly fine
  // ! FIXME: propagate state change and rerender downwards
  // ! such that children, if not unmounted,
  // ! should not be recreated and should reuse corresponding MeactElement object instead
  if (typeof window[functionName] === "function") {
    const subtreeWithUpdatedState = window[functionName].call(
      null,
      functionArgs
    );
    console.log("subtreeWithUpdatedState", subtreeWithUpdatedState);
    reactComponentAsSubtree.children = [subtreeWithUpdatedState];
  } else {
    console.log(`${functionName} is not a function`);
  }
}

// 1.
let currActiveComponentForHooks = null;
// or, 2. use a global stack to keep track of current ReactComponent being rendered
// let reactComponentStack = [];

// useState hook
function useState(initialValue) {
  /**
   * ! ALERT
   *
   * Closures capture variables by reference, not by value.
   *
   * If we were directly using the global reference variable `currActiveComponentForHooks` inside the inner function `setStateValue`, then:
   * - Due to closure, the `setStateValue` function captures a reference to the variable `currActiveComponentForHooks` and not its value.
   * - That is, at the time `setStateValue` is defined, `setStateValue` holds a reference to the `currActiveComponentForHooks` variable itself,
   * - not just its value.
   * - Therefore, any updates to the `currActiveComponentForHooks` variable
   * - after `setStateValue` is defined will be reflected when `setStateValue` is called.
   *
   * But the global variable `currActiveComponentForHooks` itself is a reference to different MeactElement object changing in each run of `createElemet` function.
   * So, if we use the global reference directly inside `setStateValue` function,
   * then by the time `setStateValue` is called,
   * it'll always get reference to the last leaf ReactComponent object.
   *
   * The solution is:
   * 1. to simply create a copy of the global reference avriable inside the lexical scope of `useState` function and not change it, or
   * 2. use a different global variable like a stack (array of references)
   */

  // 1.
  /**
   * copying an object reference variable creates one more reference to the same object
   * so, this local variable is assigned the value of global reference variable `currActiveComponentForHooks` at the time `useState` is called
   */
  const targetComponentForThisHook = currActiveComponentForHooks;

  // Or, 2.
  // const targetComponentForThisHook = reactComponentStack[reactComponentStack.length - 1];

  if (
    !targetComponentForThisHook ||
    !targetComponentForThisHook.hooksCallCounter
  ) {
    throw new Error("useState must be used within a function component");
  }

  console.log("useState hook called for", targetComponentForThisHook.id);

  // how many useState calls have been made for this component in this render
  let useStateCallCount = 0;
  if ("useState" in targetComponentForThisHook.hooksCallCounter.values) {
    useStateCallCount =
      targetComponentForThisHook.hooksCallCounter.values["useState"];
  }

  const { values } = targetComponentForThisHook.stateManager;
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

  /**
   * now, this inner function `setStateValue` captures `targetComponentForThisHook` by reference,
   * which is local to and constant in the scope of `useState` function
   * so, it will always refer to the same `MeactElement` object within a specific `useState` call's context
   */
  function setStateValue(newValue) {
    console.log("Updating state in:", targetComponentForThisHook.id);
    targetComponentForThisHook.stateManager.updateValue(stateIndex, newValue);
  }

  // update the call counter
  targetComponentForThisHook.hooksCallCounter.increment("useState");

  return [stateValue, setStateValue];
}

function resetHooksCallCounters(meactElement) {
  if (meactElement.type === "MeactComponent") {
    // reset number of hook calls seen by this component
    meactElement.hooksCallCounter.reset();
  }

  for (let i = 0; i < meactElement.children.length; i++) {
    const child = meactElement.children[i];
    resetHooksCallCounters(child);
  }
}

class MeactElementTreeDebugger {
  constructor(meactElement) {
    this.node = meactElement;
    this.treeContainer = document.getElementById("meact-element-tree");
  }

  // Function to render a tree representation for the given Meact Element in the HTML document
  renderTreeInHtmlDocument() {
    this.treeContainer.innerHTML = ""; // Clear any existing content
    this.createHtmlForTreeNode(this.node, 0);
  }

  // Function to create HTML for tree node
  createHtmlForTreeNode(node, level = 0) {
    // margin to leave on the left to align with parent node
    const leftMargin = "_".repeat(level * 2);
    const nestedLeftMargin = "_".repeat((level + 1) * 2);

    // node's name
    const nodeNameSpan = document.createElement("span");
    nodeNameSpan.className = "meact-element-tree-node";
    nodeNameSpan.innerText = `${leftMargin}_node: ${node.name}`;
    this.treeContainer.appendChild(nodeNameSpan);

    // node's type
    const nodeTypeSpan = document.createElement("span");
    nodeTypeSpan.className = "meact-element-tree-node";
    nodeTypeSpan.innerText = `${nestedLeftMargin}_type: ${node.type}`;
    this.treeContainer.appendChild(nodeTypeSpan);

    // node's ID
    const nodeIdSpan = document.createElement("span");
    nodeIdSpan.className = "meact-element-tree-node";
    nodeIdSpan.innerText = `${nestedLeftMargin}_id: ${node.id}`;
    this.treeContainer.appendChild(nodeIdSpan);

    if (node.type === "MeactComponent") {
      // node's state
      const nodeStateSpan = document.createElement("span");
      nodeStateSpan.className = "meact-element-tree-node";
      nodeStateSpan.innerText = `${nestedLeftMargin}_STATE: "${JSON.stringify(
        node.stateManager.values
      )}"`;
      this.treeContainer.appendChild(nodeStateSpan);
    }

    // node's props
    if (node.props !== undefined && node.props) {
      for (const [key, value] of Object.entries(node.props)) {
        const nodeAttributeSpan = document.createElement("span");
        nodeAttributeSpan.className = "meact-element-tree-node";
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
