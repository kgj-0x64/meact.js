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
        /// Follow this style https://jakearchibald.com/2024/attributes-vs-properties/#lit-html
        // Our library puts the onus of defining HTML element properties differently from atrributes on the library user
        const keyValue = key.substring(1);
        htmlElement[keyValue] = value;
      }
      // assign a ref created using useRef to this DOM element
      else if (key === "refKey") {
        console.log("Setting ref value after creating browser DOM node");
        value.current = htmlElement;
      }
      // SET DOM element's Attribute
      else {
        const attrKey = camelCaseToKebabCase(key);
        let attrValue = value;
        if (key === "style") {
          attrValue = inlineStyleObjectToStyleAttrValue(value);
        }
        htmlElement.setAttribute(attrKey, attrValue);
      }
    }
  }
}

/**
 * call to check if a propName value should be treated as an attribute or a property while writing the DOM
 * @param {string} propName
 * @returns {boolean}
 */
function isDomNodeProperty(propName) {
  return propName.startsWith(":");
}

/**
 * call this to convert camelCase to kebab-case
 * @param {string} attrKey
 * @returns {string}
 */
function camelCaseToKebabCase(attrKey) {
  return attrKey.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase();
}

/**
 * call this to convert inline style object into appropriate HTML style attribute value
 * @param {object} styleObj
 * @returns {string}
 */
function inlineStyleObjectToStyleAttrValue(styleObj) {
  return Object.entries(styleObj)
    .map(([key, value]) => {
      const kebabKey = camelCaseToKebabCase(key);
      return `${kebabKey}: ${value}`;
    })
    .join("; ");
}
