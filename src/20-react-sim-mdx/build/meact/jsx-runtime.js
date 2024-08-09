(() => {
  function Fragment(props) {
    return createElement("Fragment", null, ...props.children);
  }
  function jsx(type, props, key) {
    const { children, restOfProps } = props;
    return createElement(type, { ...restOfProps, key }, ...children);
  }
  function jsxs(type, props, key) {
    const { children, restOfProps } = props;
    return createElement(type, { ...restOfProps, key }, ...children);
  }
})();
