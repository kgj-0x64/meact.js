/**
 * call this to set attributes and properties on an HTML element given its MeactElement representation
 * @param {MeactElement} meactElement
 * @param {HTMLElement} htmlElement
 */
export function setAttributesAndProperties(meactElement, htmlElement) {
  if (meactElement.props !== undefined && meactElement.props) {
    for (const [key, value] of Object.entries(meactElement.props)) {
      const isNodeProperty = isDomNodeProperty(key, value);

      // SET DOM element's Property
      if (isNodeProperty) {
        // `htmlElement.setAttribute(attrKey, attrValue);` does not work for "onclick" function call or value update on "onchange" function call
        // because HTML Document sees:
        //     onclick --> `<button id="button-9" onclick="() => updateCountBy(compounder)">👍🏽</button>`
        //     onchange --> `<select id="select-6" value="lightcoral" onchange="(event) => updateColor(event)">...</select>`
        // so, given the style of our function passing, we should update corresponding property on this DOM element's object
        // then HTML Document sees (can be seen using `console.dir`):
        //     `<button id="button-9">👍🏽</button>` and `<select id="select-6" value="lightcoral">...</select>`

        // Event handler properties (like `onclick`, `onmouseover`, etc.) are typically lowercase in the DOM,
        // but other properties may retain camelCase or other casing styles (like `innerHTML`, `className`, `style.backgroundColor`).
        // ! FIXME: Follow this style https://jakearchibald.com/2024/attributes-vs-properties/#lit-html
        const keyValue = key.startsWith("on") ? key.toLowerCase() : key;
        htmlElement[keyValue] = value;
      }
      // assign a ref created using useRef to this DOM element
      else if (key === "refKey") {
        console.log("Setting ref value after creating browser DOM node");
        value.current = htmlElement;
      }
      // SET DOM element's Attribute
      else {
        htmlElement.setAttribute(key.toLowerCase(), value);
      }
    }
  }
}

/**
 * call to check if a propName value should be treated as an attribute or a property while writing the DOM
 * @param {string} propName
 * @param {string} propValue
 * @returns {boolean}
 */
function isDomNodeProperty(propName, propValue) {
  // Attribute values are always strings
  if (typeof propValue !== "string") return true;

  // Event listeners (e.g., onClick, onChange, etc.)
  if (propName.startsWith("on")) return true;

  // DOM node's property can only be camelCased
  if (isGuaranteedHtmlAttributeName(propName)) {
    return false;
  }

  // Properties that are common across elements
  const knownPropertyKeys = new Set([
    "id",
    "value",
    "checked",
    "indeterminate",
    "disabled",
    "selected",
    "innerHTML",
    "textContent",
  ]);
  if (knownPropertyKeys.has(propName)) return true;

  // Otherwise, assume it's an attribute
  return false;
}

/**
 * call this to check if an attribute name is all lowercase and has at least one hyphen separator
 * e.g. 'value' -> false, 'aria-label' -> true, 'data-test-id' -> true
 * @param {*} attrName
 * @returns {boolean}
 */
function isGuaranteedHtmlAttributeName(attrName) {
  const pattern = /^[a-z]+-[a-z]+(?:-[a-z]+)*$/;
  return pattern.test(attrName);
}
