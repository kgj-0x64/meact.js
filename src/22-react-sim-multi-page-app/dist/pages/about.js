var about = (() => {
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // app/pages/about.js
  var about_exports = {};
  __export(about_exports, {
    default: () => Page
  });

  // meact-dom/virtualNodeHelper.js
  var domVirtualNodeHelper = {
    fragments: /* @__PURE__ */ new Map(),
    /**
     * call this to record parent and virtual positional info for a DOM node
     * which is present in the render tree but won't be added in the DOM tree
     * @param {string} reactElementId
     * @param {string} parentDomElementId
     * @param {number} virtualChildPosition
     */
    addFragmentNode(reactElementId, parentDomElementId, virtualChildPosition) {
      this.fragments.set(reactElementId, {
        parentDomElementId,
        virtualChildPosition
      });
    },
    /**
     *
     * @param {string} reactElementId
     * @returns {{parentDomElementId:string, virtualChildPosition:number}}
     */
    getFragmentNode(reactElementId) {
      return this.fragments.get(reactElementId);
    }
  };

  // meact-dom/domAttrAndProp.js
  function setAttributesAndProperties(meactElement, htmlElement) {
    if (meactElement.props !== void 0 && meactElement.props) {
      for (const [key, value] of Object.entries(meactElement.props)) {
        const isNodeProperty = isDomNodeProperty(key, value);
        if (isNodeProperty) {
          const keyValue = key.startsWith("on") ? key.toLowerCase() : key;
          htmlElement[keyValue] = value;
        } else if (key === "refKey") {
          console.log("Setting ref value after creating browser DOM node");
          value.current = htmlElement;
        } else {
          htmlElement.setAttribute(key.toLowerCase(), value);
        }
      }
    }
  }
  function isDomNodeProperty(propName, propValue) {
    if (typeof propValue !== "string") return true;
    if (propName.startsWith("on")) return true;
    if (isGuaranteedHtmlAttributeName(propName)) {
      return false;
    }
    const knownPropertyKeys = /* @__PURE__ */ new Set([
      "id",
      "value",
      "checked",
      "indeterminate",
      "disabled",
      "selected",
      "innerHTML",
      "textContent"
    ]);
    if (knownPropertyKeys.has(propName)) return true;
    return false;
  }
  function isGuaranteedHtmlAttributeName(attrName) {
    const pattern = /^[a-z]+-[a-z]+(?:-[a-z]+)*$/;
    return pattern.test(attrName);
  }

  // meact-dom/utils.js
  var elementRenderId = "data-render-id";
  function findParentDomElementByParentRenderId(parentRenderElement, childPosition) {
    const parentRenderElementId = parentRenderElement.id;
    if (parentRenderElement.type === "MeactComponent") {
      const virtualParentElementInfo = domVirtualNodeHelper.getFragmentNode(
        parentRenderElementId
      );
      const parentDomElement = findElementByUniqueRenderId2(
        virtualParentElementInfo.parentDomElementId
      );
      return {
        parentDomElement,
        childPositionInDom: virtualParentElementInfo.virtualChildPosition + childPosition
      };
    } else {
      const parentDomElement = findElementByUniqueRenderId2(parentRenderElementId);
      return {
        parentDomElement,
        childPositionInDom: childPosition
      };
    }
  }
  function findElementByUniqueRenderId2(renderId) {
    return document.querySelector(`[${elementRenderId}="${renderId}"]`);
  }

  // meact-dom/createDomElement.js
  function createBrowserDomForReactElement(meactElement, parentDomElementId, insertAtChildPosition) {
    if (meactElement.type === "NullComponent") {
      const nullElement = document.createElement("div");
      nullElement.setAttribute(elementRenderId, meactElement.id);
      nullElement.style.display = "none";
      return nullElement;
    }
    if (meactElement.type === "MeactComponent") {
      const placeholderElement = document.createDocumentFragment();
      domVirtualNodeHelper.addFragmentNode(
        meactElement.id,
        parentDomElementId,
        insertAtChildPosition
      );
      if (meactElement.children && meactElement.children.length > 0) {
        meactElement.children.forEach((child, index) => {
          const childElementAtThisIndex = createBrowserDomForReactElement(
            child,
            // actual parent node in the DOM is unchanged for this fragment's children
            parentDomElementId,
            // absolute child position under parent node = child position of this fragment under its parent node +  child position under fragment node
            insertAtChildPosition + index
          );
          placeholderElement.appendChild(childElementAtThisIndex);
        });
      }
      return placeholderElement;
    }
    if (meactElement.name === "text") {
      const textContent = meactElement.props.content;
      return document.createTextNode(textContent);
    }
    const htmlElement = document.createElement(meactElement.name);
    htmlElement.setAttribute(elementRenderId, meactElement.id);
    if (meactElement.children && meactElement.children.length > 0) {
      meactElement.children.forEach((child, index) => {
        const childElementAtThisIndex = createBrowserDomForReactElement(
          child,
          meactElement.id,
          index
        );
        htmlElement.appendChild(childElementAtThisIndex);
      });
    }
    setAttributesAndProperties(meactElement, htmlElement);
    return htmlElement;
  }

  // meact-dom/upsertDomElement.js
  function upsertBrowserDomForRerenderDiffItem(rerenderDiffItem) {
    const { action, parentElement, childPosition, targetElement } = rerenderDiffItem;
    const parentInfoFromBrowserDom = findParentDomElementByParentRenderId(
      parentElement,
      childPosition
    );
    const parentElementInBrowserDom = parentInfoFromBrowserDom.parentDomElement;
    const childPositionInBrowserDom = parentInfoFromBrowserDom.childPositionInDom;
    if (action === "created") {
      const targetDomSubtree = createBrowserDomForReactElement(targetElement);
      if (childPositionInBrowserDom >= 0 && childPositionInBrowserDom < parentElementInBrowserDom.children.length) {
        parentElementInBrowserDom.replaceChild(
          targetDomSubtree,
          parentElementInBrowserDom.children[childPositionInBrowserDom]
        );
      } else {
        parentElementInBrowserDom.appendChild(targetDomSubtree);
      }
    } else if (action === "updated") {
      if (targetElement.name === "text") {
        const textContent = targetElement.props.content;
        parentElementInBrowserDom.childNodes[childPositionInBrowserDom].textContent = textContent;
      } else {
        const domElementToUpdate = findElementByUniqueRenderId(targetElement.id);
        if (domElementToUpdate) {
          setAttributesAndProperties(targetElement, domElementToUpdate);
        } else {
          console.warn(`UPDATE: Element with ID ${targetElement.id} not found.`);
        }
      }
    } else {
      const domElementToDelete = findElementByUniqueRenderId(targetElement.id);
      parentElementInBrowserDom.removeChild(domElementToDelete);
    }
  }

  // meact-dom/domWriter.js
  var browserDomWriter = {
    targetNodeInBrowserDom: null,
    // constructor
    setbrowserDomWriterAtNode(nodeInBrowserDom) {
      this.targetNodeInBrowserDom = nodeInBrowserDom;
    },
    /**
     * call it to display the given Render Tree (root node) at the target node of browser DOM
     * and take over managing the DOM inside it
     * @param {MeactElement} meactElement root node of the render tree which is to be rendered in browser DOM
     */
    render(meactElement) {
      render_tree_default.setRootNode(meactElement);
      meactElement.plotRenderTree();
      this.targetNodeInBrowserDom.innerHTML = "";
      const browserDom = createBrowserDomForReactElement(
        meactElement,
        this.targetNodeInBrowserDom.id,
        0
      );
      console.dir(browserDom);
      this.targetNodeInBrowserDom.appendChild(browserDom);
      render_tree_default.postRenderHandler();
    },
    /**
     * call this to update existing DOM's copy based on render tree's diff
     * @param {MeactElement} rootReactElement root node of the render tree which is already rendered in browser DOM
     */
    rerenderTheDiff(rootReactElement) {
      rootReactElement.plotRenderTree();
      const rerenderDiffQueue = render_tree_default.rerenderDiffForDomHandler.getQueue();
      console.log("Rerender DIFF Queue", rerenderDiffQueue);
      for (let i = 0; i < rerenderDiffQueue.length; i++) {
        upsertBrowserDomForRerenderDiffItem(rerenderDiffQueue[i]);
      }
      render_tree_default.postRenderHandler();
    }
  };

  // meact/hooks/hookHelpers.js
  function resetHooksCallCounters(meactElement) {
    if (meactElement.type === "MeactComponent") {
      meactElement.hooksCallCounter.reset();
    }
    for (let i = 0; i < meactElement.children.length; i++) {
      const child = meactElement.children[i];
      resetHooksCallCounters(child);
    }
  }

  // meact/render-tree/render-tree.js
  var renderTree2 = {
    // root node of the render tree
    rootNode: null,
    // how many times this app has been rendered (or rerendered) in browser
    domRefreshCounter: 0,
    /**
     * call this to update the root node and thus this whole render tree
     * @param {MeactElement} meactElement new root node
     */
    setRootNode(meactElement) {
      this.rootNode = meactElement;
      this.domRefreshCounter = 0;
    },
    // queues of updated or newly created elements during a re-render
    rerenderDiffForDomHandler: {
      queue: [],
      // {{action: "created" | "updated" | "deleted", parentElement: MeactElement, childPosition: number, targetElement: MeactElement}[]}
      /**
       * @param {{action: "created" | "updated" | "deleted", parentElement: MeactElement, childPosition: number, targetElement: MeactElement}} elementSnapshot
       */
      enqueue(elementSnapshot) {
        this.queue.push(elementSnapshot);
      },
      /**
       * @returns {{action: "created" | "updated", parentElement: MeactElement, childPosition: number, targetElement: MeactElement}[]}
       */
      getQueue() {
        return this.queue;
      },
      reset() {
        this.queue = [];
      }
    },
    // queue of all useEffect calls whose dependencies had changed in the last re-render
    effectHooksForPostRenderHandling: {
      queue: [],
      // {{component: MeactElement, index: number}[]}
      /**
       * @param {{component: MeactElement, index: number}} effectObject
       */
      enqueue(effectObject) {
        this.queue.push(effectObject);
      },
      dequeue() {
        return this.queue.shift();
      },
      /**
       * call to execute all useEffect setup and cleanup functions from this render
       */
      processQueue() {
        while (this.queue.length > 0) {
          const effectObject = this.dequeue();
          const { component, index } = effectObject;
          component.executeUseEffectSetupFunction(index);
        }
      }
    },
    /**
     * call this for housekeeping after every render and re-render activity on the browser DOM
     */
    postRenderHandler() {
      console.log("Post Render Cleanup Initiated...");
      this.domRefreshCounter += 1;
      resetHooksCallCounters(this.rootNode);
      this.rerenderDiffForDomHandler.reset();
      this.effectHooksForPostRenderHandling.processQueue();
      console.log("Post Render Cleanup Done!");
    },
    /**
     * call this to re-paint the browser DOM in sync with this updated sub-tree of the already painted render tree
     * @param {MeactElement} reactSubtree
     */
    reRender(reactSubtree) {
      console.log("Re-render from this subtree root node", reactSubtree.id);
      browserDomWriter.rerenderTheDiff(this.rootNode, reactSubtree);
    }
  };
  var render_tree_default2 = renderTree2;

  // meact/render-tree/treeDebugger.js
  var ReactElementTreeDebugger = class {
    /**
     * @param {MeactElement} meactElement
     */
    constructor(meactElement) {
      this.node = meactElement;
      this.treeContainer = document.getElementById("meact-element-tree");
    }
    /**
     * call this trigger function to create browser DOM from the root node of a given render tree
     * and append it at the appropriate DOM position in the HTML document
     */
    renderTreeInHtmlDocument() {
      this.treeContainer.innerHTML = "";
      this.createHtmlForTreeNode(this.node, 0);
    }
    /**
     * call this to create browser DOM from the root node of a given render tree
     * @param {MeactElement} node
     * @param {number} level
     */
    createHtmlForTreeNode(node, level = 0) {
      const leftMargin = "_".repeat(level * 2);
      const nestedLeftMargin = "_".repeat((level + 1) * 2);
      const nodeNameSpan = document.createElement("span");
      nodeNameSpan.className = "meact-element-tree-node";
      nodeNameSpan.innerText = `${leftMargin}_node: ${node.name}`;
      this.treeContainer.appendChild(nodeNameSpan);
      const nodeTypeSpan = document.createElement("span");
      nodeTypeSpan.className = "meact-element-tree-node";
      nodeTypeSpan.innerText = `${nestedLeftMargin}_type: ${node.type}`;
      this.treeContainer.appendChild(nodeTypeSpan);
      const nodeIdSpan = document.createElement("span");
      nodeIdSpan.className = "meact-element-tree-node";
      nodeIdSpan.innerText = `${nestedLeftMargin}_id: ${node.id}`;
      this.treeContainer.appendChild(nodeIdSpan);
      if (node.type === "MeactComponent") {
        const nodeStateSpan = document.createElement("span");
        nodeStateSpan.className = "meact-element-tree-node";
        nodeStateSpan.innerText = `${nestedLeftMargin}_STATE: "${JSON.stringify(
          node.stateManager.values
        )}"`;
        this.treeContainer.appendChild(nodeStateSpan);
      }
      if (node.props !== void 0 && node.props) {
        for (const [key, value] of Object.entries(node.props)) {
          const nodeAttributeSpan = document.createElement("span");
          nodeAttributeSpan.className = "meact-element-tree-node";
          nodeAttributeSpan.innerText = `${nestedLeftMargin}_${key}: ${JSON.stringify(
            value
          )}`;
          this.treeContainer.appendChild(nodeAttributeSpan);
        }
      }
      if (node.children && node.children.length > 0) {
        node.children.forEach((child) => {
          this.createHtmlForTreeNode(child, level + 1);
        });
      }
    }
  };

  // meact/render-tree/index.js
  var render_tree_default = render_tree_default2;

  // meact/utils.js
  var nextId = 0;
  function getNewElementId(elementName) {
    const id = nextId++;
    const instanceId = `${elementName ? elementName.toLowerCase() : "null"}-${id}`;
    return instanceId;
  }
  var rerenderMonitor = {
    isHijackOfCreateElementFnPaused: false,
    isCreateElementFunctionHijacked() {
      if (this.isHijackOfCreateElementFnPaused) {
        return false;
      }
      return render_tree_default.domRefreshCounter > 0;
    },
    pauseHijackOfCreateElementFn() {
      this.isHijackOfCreateElementFnPaused = true;
    },
    resumeHijackOfCreateElementFn() {
      this.isHijackOfCreateElementFnPaused = false;
    }
  };
  function arePropsEqual(oldProps, newProps) {
    if (typeof newProps !== "object" || typeof oldProps !== "object" || newProps === null || oldProps === null) {
      return newProps === oldProps;
    }
    const prevKeys = Object.keys(oldProps);
    const newKeys = Object.keys(newProps);
    if (prevKeys.length !== newKeys.length) {
      return false;
    }
    for (let key of prevKeys) {
      if (!Object.is(oldProps[key], newProps[key])) {
        return false;
      }
    }
    return true;
  }

  // meact/hooks/global.js
  var currActiveComponentForHooks = {
    referenceValue: null,
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
    }
  };

  // meact/memo.js
  var memoizedFunctionsMap = /* @__PURE__ */ new Map();
  var MemoizedFn = class {
    /**
     * @param {Function} componentFn
     */
    constructor(componentFn) {
      this.componentFn = componentFn;
    }
  };

  // meact/updateSubtree.js
  function updateSubtreeForElement(subtreeLevelFromStateChange, subtreeRootNode, childPosition, subtreeRootNodeChildPostStateUpdate) {
    let subtreeRootNodeChildRecalculated = subtreeRootNodeChildPostStateUpdate;
    if (!subtreeRootNodeChildRecalculated && subtreeRootNode.type === "MeactComponent") {
      const functionName = subtreeRootNode.name;
      if (typeof MdxToJsxBuild[functionName] !== "function") {
        console.log(`${functionName} is not a function`);
        return;
      }
      const functionArgs = {
        ...subtreeRootNode.props,
        children: subtreeRootNode.propChildrenSnapshot
      };
      if (subtreeLevelFromStateChange > 0 && memoizedFunctionsMap.has(functionName)) {
        const memoizedFunctionMappedValues = memoizedFunctionsMap.get(functionName);
        const customArePropsEqualFn = memoizedFunctionMappedValues.arePropsEqualFn;
        const lastPropsOfThisMemoizedFn = memoizedFunctionMappedValues.lastProps;
        const newPropsOfThisMemoizedFn = subtreeRootNode.props;
        let arePropsSameForThisMemoizedFn = false;
        if (customArePropsEqualFn !== void 0) {
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
        memoizedFunctionsMap.set(functionName, {
          ...memoizedFunctionsMap.get(functionName),
          lastProps: subtreeRootNode.props
        });
        if (arePropsSameForThisMemoizedFn) {
          return;
        }
      }
      currActiveComponentForHooks.set(reactComponent);
      subtreeRootNodeChildRecalculated = MdxToJsxBuild[functionName].call(
        null,
        functionArgs
      );
    }
    if (childPosition >= subtreeRootNode.children.length) {
      createElementDuringRerender(
        subtreeRootNode,
        childPosition,
        subtreeRootNodeChildRecalculated
      );
      return;
    }
    const existingChildOfSubtreeRootNode = subtreeRootNode.children[childPosition];
    const shouldUpdateExistingChildOfSubtreeRootNode = existingChildOfSubtreeRootNode.isSameRenderTreeNodeAs({
      type: subtreeRootNodeChildRecalculated.type,
      name: subtreeRootNodeChildRecalculated.name,
      props: subtreeRootNodeChildRecalculated.props
    });
    if (!shouldUpdateExistingChildOfSubtreeRootNode) {
      createElementDuringRerender(
        subtreeRootNode,
        childPosition,
        subtreeRootNodeChildRecalculated
      );
      existingChildOfSubtreeRootNode.unmount();
      return;
    }
    const lastProps = existingChildOfSubtreeRootNode.props;
    const newProps = subtreeRootNodeChildRecalculated.props;
    existingChildOfSubtreeRootNode.props = newProps;
    if (existingChildOfSubtreeRootNode.type !== "MeactComponent") {
      const isPropsSameInRerender = arePropsEqual(lastProps, newProps);
      if (!isPropsSameInRerender) {
        render_tree_default.rerenderDiffForDomHandler.enqueue({
          action: "updated",
          parentElement: subtreeRootNode,
          childPosition,
          targetElement: existingChildOfSubtreeRootNode
          // with updated props
        });
      }
    }
    if (existingChildOfSubtreeRootNode.type === "MeactComponent") {
      existingChildOfSubtreeRootNode.propChildrenSnapshot = subtreeRootNodeChildRecalculated.propChildrenSnapshot;
      updateSubtreeForElement(
        subtreeLevelFromStateChange + 1,
        existingChildOfSubtreeRootNode,
        0,
        null
      );
      return;
    }
    const existingNumberOfChildren = existingChildOfSubtreeRootNode.children.length;
    const recalculatedNumberOfChildren = subtreeRootNodeChildRecalculated.children.length;
    if (recalculatedNumberOfChildren < existingNumberOfChildren) {
      for (let i = recalculatedNumberOfChildren; i < existingNumberOfChildren; i++) {
        render_tree_default.rerenderDiffForDomHandler.enqueue({
          action: "deleted",
          parentElement: existingChildOfSubtreeRootNode,
          childPosition: i,
          targetElement: existingChildOfSubtreeRootNode.children[i]
        });
        existingChildOfSubtreeRootNode.children[i].unmount();
      }
      existingChildOfSubtreeRootNode.children = existingChildOfSubtreeRootNode.children.slice(
        0,
        recalculatedNumberOfChildren
      );
    }
    for (let i = 0; i < recalculatedNumberOfChildren; i++) {
      updateSubtreeForElement(
        subtreeLevelFromStateChange + 1,
        existingChildOfSubtreeRootNode,
        i,
        subtreeRootNodeChildRecalculated.children[i]
      );
    }
  }
  function createElementDuringRerender(subtreeRootNode, childPosition, { type, name, props, children }) {
    rerenderMonitor.pauseHijackOfCreateElementFn();
    if (type === "MeactComponent") {
      name = window[name];
    }
    const mountNewChildSubtree = createElement(name, props, ...children);
    subtreeRootNode.children[childPosition] = mountNewChildSubtree;
    render_tree_default.rerenderDiffForDomHandler.enqueue({
      action: "created",
      parentElement: subtreeRootNode,
      childPosition,
      targetElement: mountNewChildSubtree
    });
    rerenderMonitor.resumeHijackOfCreateElementFn();
  }

  // meact/element.js
  var MeactElement = class {
    /**
     * @param {"NullComponent" | "MeactComponent" | "ReactHtmlElement"} type
     * @param {string} name
     * @param {object} props
     * @param {MeactElement[]} children
     * @param {MeactElement[]} propChildrenSnapshot
     */
    constructor(type, name, props = {}, children = [], propChildrenSnapshot = void 0) {
      this.id = getNewElementId(name);
      this.type = type;
      this.name = name;
      this.props = props ? props : {};
      this.propChildrenSnapshot = type === "MeactComponent" ? propChildrenSnapshot : void 0;
      this.children = children;
      this.hooksCallCounter = type === "MeactComponent" ? {
        values: {},
        /**
         * call this to increment the counter value of this MeactElement against a given hook name e.g. "useState"
         * @param {string} hookName
         */
        increment(hookName) {
          this.values[hookName] = hookName in this.values ? this.values[hookName] + 1 : 1;
          console.log(
            `incremented hook [${hookName}]`,
            this.values[hookName]
          );
        },
        /**
         * call this to reset the hooks call counter values of this MeactElement after every render or re-render
         */
        reset() {
          this.values = {};
        }
      } : void 0;
      this.stateManager = type === "MeactComponent" ? {
        // ordered collection of state values of this component
        values: [],
        /**
         * call this to update state value at a given hook position of this MeactElement
         * @param {number} index
         * @param {any} newValue
         */
        updateValue: (index, newValue) => {
          let newStateValue = newValue;
          if (typeof newValue === "function") {
            newStateValue = newValue(this.stateManager.values[index]);
          }
          this.stateManager.values[index] = newStateValue;
          updateSubtreeForElement(0, this, 0, null);
          render_tree_default.reRender(this);
        }
      } : void 0;
      this.refManager = type === "MeactComponent" ? {
        // ordered collection of ref values of this component
        values: []
      } : void 0;
      this.effectManager = type === "MeactComponent" ? {
        // ordered collection of effect calls of this component
        values: []
      } : void 0;
      this.cacheManager = type === "MeactComponent" ? {
        // ordered collection of cached values of this component
        values: []
      } : void 0;
    }
    /**
     * call to run setup and cleanup functions of a useEffect hook at the given index
     * @param {number} index
     */
    executeUseEffectSetupFunction(index) {
      const targetUseEffectHook = this.effectManager.values[index];
      if (targetUseEffectHook.cleanupFunc) {
        console.log("Running the cleanup function at index", index);
        targetUseEffectHook.cleanupFunc();
      }
      const returnedCleanupFunc = targetUseEffectHook.setupFunc();
      this.effectManager.values[index] = {
        ...this.effectManager.values[index],
        cleanupFunc: returnedCleanupFunc
      };
    }
    /**
     * call this to trigger actions on unmounting of this MeactElement
     */
    unmount() {
      console.log("Unmount this MeactElement", this.id);
      if (this.type !== "MeactComponent") {
        return;
      }
      for (let i = 0; i < this.effectManager.values.length; i++) {
        const targetUseEffectHook = this.effectManager.values[i];
        targetUseEffectHook.cleanupFunc();
      }
    }
    /**
     * call this to check whether a MeactElement object representation created
     * at this MeactElement node's position during a re-render
     * represents this same MeactElement node in the render tree or not
     * @param {{type: string, name: string, props: object}} param0
     * @returns {boolean}
     */
    isSameRenderTreeNodeAs({ type, name, props }) {
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
     * call this to pretty-plot the render tree beginning from this node in browser for visual debugging
     */
    plotRenderTree() {
      new ReactElementTreeDebugger(this).renderTreeInHtmlDocument();
    }
  };
  var element_default = MeactElement;

  // meact/createElement.js
  function createElement2(element, props, ...children) {
    if (!(element === null || typeof element === "string" || typeof element === "function" || element instanceof MemoizedFn)) {
      throw new Error(
        "Invalid argument of createElement: element must be null, string, function, or memoized function"
      );
    }
    const propsObject = props === void 0 || !props ? {} : props;
    let type = element ? typeof element === "function" ? "MeactComponent" : "ReactHtmlElement" : "NullComponent";
    let name = element ? typeof element === "function" ? element.name : element : "null";
    const childrenArray = Array.isArray(children) && children.length > 0 && children[0] !== void 0 ? children : [];
    if (!element) {
      return new element_default(type, name, {}, []);
    }
    if (element instanceof MemoizedFn) {
      const memoizedFunction = element.componentFn;
      const memoizedFunctionName = memoizedFunction.name;
      if (renderTree.domRefreshCounter === 0) {
        memoizedFunctionsMap.set(memoizedFunctionName, {
          ...memoizedFunctionsMap.get(memoizedFunctionName),
          lastProps: propsObject
        });
      }
      return createElement2(memoizedFunction, props, ...childrenArray);
    }
    if (typeof element === "function") {
      if (!name) {
        throw new Error(
          `Anonymous function cannot be used as a component, please use named function only`
        );
      }
      const reactComponent2 = new element_default(
        type,
        name,
        propsObject,
        [],
        // snapshot of children elements passed by the parent component via props
        childrenArray
      );
      if (rerenderMonitor.isCreateElementFunctionHijacked()) {
        return reactComponent2;
      }
      if (element.name === "Fragment") {
        const returnedChildrenArray = element({ children: childrenArray });
        const childrenElements2 = createChildrenElementsHelper(
          returnedChildrenArray
        );
        reactComponent2.children = childrenElements2;
        return reactComponent2;
      }
      currActiveComponentForHooks.set(reactComponent2);
      const functionArgs = {
        ...propsObject,
        children: childrenArray
      };
      const returnedElement = element(functionArgs);
      reactComponent2.children = [returnedElement];
      return reactComponent2;
    }
    const childrenElements = createChildrenElementsHelper(childrenArray);
    const htmlElement = new element_default(
      type,
      name,
      propsObject,
      childrenElements
    );
    return htmlElement;
  }
  function createChildrenElementsHelper(childrenArray) {
    let childrenElements = [];
    if (childrenArray.length > 0) {
      for (let i = 0; i < childrenArray.length; i++) {
        const child = childrenArray[i];
        const childElement = child instanceof element_default ? child : createElement2("text", { content: child });
        childrenElements.push(childElement);
      }
    }
    return childrenElements;
  }

  // meact/index.js
  var Meact = {
    createElement: createElement2
  };
  var meact_default = Meact;

  // meact/jsx-runtime.js
  var { createElement: createElement3 } = meact_default;
  function jsx(type, props, key) {
    const { children, ...restOfProps } = props;
    const propsObject = key === void 0 ? restOfProps : { ...restOfProps, key };
    const child = Array.isArray(children) && children.length > 0 ? children[0] : children;
    return createElement3(type, propsObject, child);
  }

  // app/pages/about.js
  function Page() {
    return /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx("h1", { children: "This is the about page." }) });
  }
  return __toCommonJS(about_exports);
})();
