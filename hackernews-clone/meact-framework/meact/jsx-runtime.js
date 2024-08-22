import { createElement } from "./createElement.js";

// Fragment allows grouping elements without adding extra DOM nodes
export function Fragment(props) {
  return props.children;
}

// The `jsx` function is used for creating elements with no or one child
export function jsx(type, props, key) {
  const { children, ...restOfProps } = props;
  const propsObject = key === undefined ? restOfProps : { ...restOfProps, key };

  return createElement(type, propsObject, children);
}

// The `jsxs` function is used for creating elements with multiple children
export function jsxs(type, props, key) {
  const { children, ...restOfProps } = props;
  const propsObject = key === undefined ? restOfProps : { ...restOfProps, key };

  // handle `{props.children}` array as a potential child in the `children` array
  const childrenArray = Array.isArray(children) ? flattenArray(children) : [];

  return createElement(type, propsObject, ...childrenArray);
}

function flattenArray(arr) {
  return arr.reduce((acc, item) => {
    if (Array.isArray(item)) {
      // Recursively flatten the array
      acc.push(...flattenArray(item));
    } else {
      // Directly push the object
      acc.push(item);
    }
    return acc;
  }, []);
}
