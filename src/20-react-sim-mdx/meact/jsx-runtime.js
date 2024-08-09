// Fragment allows grouping elements without adding extra DOM nodes
export function Fragment(props) {
  return createElement("Fragment", null, ...props.children);
}

// The `jsx` function is used for creating elements with no or one child
export function jsx(type, props, key) {
  const { children, restOfProps } = props;
  return createElement(type, { ...restOfProps, key }, ...children);
}

// The `jsxs` function is used for creating elements with multiple children
export function jsxs(type, props, key) {
  const { children, restOfProps } = props;
  return createElement(type, { ...restOfProps, key }, ...children);
}
