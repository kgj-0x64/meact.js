// Fragment allows grouping elements without adding extra DOM nodes
export function Fragment(props) {
  return props.children;
}

// The `jsx` function is used for creating elements with no or one child
export function jsx(type, props, key) {
  const { children, ...restOfProps } = props;
  const propsObject = key === undefined ? restOfProps : { ...restOfProps, key };

  // MDX compiler may choose jsx when destructuring children from props
  // if it sees only one child node in the .mdx file
  // e.g. <span>{props.children}</span>
  const child =
    Array.isArray(children) && children.length > 0 ? children[0] : children;

  return createElement(type, propsObject, child);
}

// The `jsxs` function is used for creating elements with multiple children
export function jsxs(type, props, key) {
  const { children, ...restOfProps } = props;
  const propsObject = key === undefined ? restOfProps : { ...restOfProps, key };
  const childrenArray = Array.isArray(children) ? children : [];

  return createElement(type, propsObject, ...childrenArray);
}
