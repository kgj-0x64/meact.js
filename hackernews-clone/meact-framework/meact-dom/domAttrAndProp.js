const domNodePropertySymbol = "prop:";

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
        const propKey = key.replace(domNodePropertySymbol, "");
        const attrKey = transformNodePropertyKey(propKey, value);
        htmlElement[attrKey] = value;
      }
      // assign a ref created using useRef to this DOM element
      else if (key === "refKey") {
        console.log("Setting ref value after creating browser DOM node");
        value.current = htmlElement;
      }
      // SET DOM element's Attribute
      else {
        const attrKey = transformNodeAttributeKey(key);
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
  return propName.startsWith(domNodePropertySymbol);
}

/**
 * call this to transform a DOM node's property key
 * to handle event handlers naming convention
 * @param {string} propName
 * @param {any} propValue
 * @returns {string}
 */
function transformNodePropertyKey(propName, propValue) {
  if (propName.startsWith("on") && typeof propValue === "function") {
    return propName.toLowerCase();
  }

  return propName;
}

/**
 * call this to convert inline style object into appropriate HTML style attribute value
 * @param {object} styleObj
 * @returns {string}
 */
function inlineStyleObjectToStyleAttrValue(styleObj) {
  if (styleObj === undefined) return "";

  return Object.entries(styleObj)
    .map(([key, value]) => {
      const kebabKey = camelCaseToKebabCase(key);
      return `${kebabKey}: ${value}`;
    })
    .join("; ");
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
 * call this to transform a DOM node's attribute key because kebab-case transformation alone is not always correct
 * e.g. "colSpan" gives "col-span" when it should be "colspan" only
 * @param {string} attrKey
 * @returns {string}
 */
function transformNodeAttributeKey(attrKey) {
  // Dictionary for special cases where React property doesn't map directly to kebab-case
  const specialCases = {
    className: "class",
    htmlFor: "for",
    colSpan: "colspan",
    rowSpan: "rowspan",
    tabIndex: "tabindex",
    readOnly: "readonly",
    maxLength: "maxlength",
    minLength: "minlength",
    autoComplete: "autocomplete",
    autoCapitalize: "autocapitalize",
    autoFocus: "autofocus",
    spellCheck: "spellcheck",
    srcSet: "srcset",
    useMap: "usemap",
    contentEditable: "contenteditable",
    formAction: "formaction",
    formEncType: "formenctype",
    formMethod: "formmethod",
    formNoValidate: "formnovalidate",
    formTarget: "formtarget",
    acceptCharset: "accept-charset",
    httpEquiv: "http-equiv",
    accessKey: "accesskey",
    encType: "enctype",
    inputMode: "inputmode",
  };

  // Check if the HTML attribute name is in the specialCases dictionary
  if (specialCases.hasOwnProperty(attrKey)) {
    return specialCases[attrKey];
  }

  // Convert camelCase to kebab-case for general cases
  return camelCaseToKebabCase(attrKey);
}
