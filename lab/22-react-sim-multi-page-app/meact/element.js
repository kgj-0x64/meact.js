import renderTree from "@meact/render-tree";
import { getNewElementId } from "./utils.js";
import { updateSubtreeForElement } from "./updateSubtree.js";
import { MeactElementTreeDebugger } from "./render-tree/treeDebugger.js";

/**
 * A MeactElement object is a node in our "render tree"
 */
class MeactElement {
  /**
   * @param {"NullComponent" | "MeactComponent" | "MeactHtmlElement"} type
   * @param {string} name
   * @param {object} props
   * @param {MeactElement[]} children
   * @param {MeactElement[]} propChildrenSnapshot
   */
  constructor(
    type,
    name,
    props = {},
    children = [],
    propChildrenSnapshot = undefined
  ) {
    // ID of this element to uniquely identify an instance of it
    this.id = getNewElementId(name);
    // type of this element
    this.type = type;
    // name of this element
    this.name = name;
    // set of props set on this element
    this.props = props ? props : {}; // map-like object
    // children passed by parent component to a ReactComponent via props (saved for use during re-rendering)
    this.propChildrenSnapshot =
      type === "MeactComponent" ? propChildrenSnapshot : undefined;
    // ordered collection of children elements of this element
    this.children = children; // array
    // in this render, number of hook calls seen by this component
    this.hooksCallCounter =
      type === "MeactComponent"
        ? {
            values: {},

            /**
             * call this to increment the counter value of this MeactElement against a given hook name e.g. "useState"
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
             * call this to reset the hooks call counter values of this MeactElement after every render or re-render
             */
            reset() {
              this.values = {};
            },
          }
        : undefined;
    // useState manager useful for an element of type "MeactComponent"
    this.stateManager =
      type === "MeactComponent"
        ? {
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
              // re-evaluate the subtree of the render tree which is rooted at this element
              updateSubtreeForElement(0, this, 0, null);
              // repaint the browser DOM
              renderTree.reRender(this);
            },
          }
        : undefined;
    // useRef manager useful for an element of type "MeactComponent"
    this.refManager =
      type === "MeactComponent"
        ? {
            // ordered collection of ref values of this component
            values: [],
          }
        : undefined;
    // useEffect manager useful for an element of type "MeactComponent"
    this.effectManager =
      type === "MeactComponent"
        ? {
            // ordered collection of effect calls of this component
            values: [],
          }
        : undefined;
    // useMemo manager useful for an element of type "MeactComponent"
    this.cacheManager =
      type === "MeactComponent"
        ? {
            // ordered collection of cached values of this component
            values: [],
          }
        : undefined;
  }

  /**
   * call to run setup and cleanup functions of a useEffect hook at the given index
   * @param {number} index
   */
  executeUseEffectSetupFunction(index) {
    const targetUseEffectHook = this.effectManager.values[index];

    // first run the cleanup function if it's not the first render
    if (targetUseEffectHook.cleanupFunc) {
      console.log("Running the cleanup function at index", index);
      targetUseEffectHook.cleanupFunc();
    }

    // then run the setup function with the new values
    const returnedCleanupFunc = targetUseEffectHook.setupFunc();
    // save it for next re-render
    this.effectManager.values[index] = {
      ...this.effectManager.values[index],
      cleanupFunc: returnedCleanupFunc,
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
    new MeactElementTreeDebugger(this).renderTreeInHtmlDocument();
  }
}

export default MeactElement;
