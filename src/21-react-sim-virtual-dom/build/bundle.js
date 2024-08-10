var MdxToJsxBuild = (() => {
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if ((from && typeof from === "object") || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, {
            get: () => from[key],
            enumerable:
              !(desc = __getOwnPropDesc(from, key)) || desc.enumerable,
          });
    }
    return to;
  };
  var __toCommonJS = (mod) =>
    __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // build/temp.mdx.js
  var temp_mdx_exports = {};
  __export(temp_mdx_exports, {
    Local: () => Local,
    default: () => MDXContent,
  });

  // meact/jsx-runtime.js
  function Fragment(props) {
    return props.children;
  }
  function jsx(type, props, key) {
    const { children, ...restOfProps } = props;
    const propsObject = key === void 0 ? restOfProps : { ...restOfProps, key };
    const child =
      Array.isArray(children) && children.length > 0 ? children[0] : children;
    return createElement(type, propsObject, child);
  }
  function jsxs(type, props, key) {
    const { children, ...restOfProps } = props;
    const propsObject = key === void 0 ? restOfProps : { ...restOfProps, key };
    const childrenArray = Array.isArray(children) ? children : [];
    return createElement(type, propsObject, ...childrenArray);
  }

  // src/components.jsx
  function GreetingApp() {
    const [name, setName] = useState("");
    const [address, setAddress] = useState("");
    const memoizedSetName = useMemo(
      () => (e) => setName(e.target.value),
      [name]
    );
    const memoizedSetAddress = useMemo(
      () => (e) => setAddress(e.target.value),
      [address]
    );
    return /* @__PURE__ */ createElement(
      "div",
      null,
      /* @__PURE__ */ createElement(
        "label",
        null,
        "Name: ",
        /* @__PURE__ */ createElement("input", {
          value: name,
          onChange: memoizedSetName,
        })
      ),
      /* @__PURE__ */ createElement(
        "label",
        null,
        "Address: ",
        /* @__PURE__ */ createElement("input", {
          value: address,
          onChange: memoizedSetAddress,
        })
      ),
      /* @__PURE__ */ createElement(MemoizedGreeting, { name })
    );
  }
  var MemoizedGreeting = memo(Greeting);
  function Greeting({ name }) {
    console.log(
      "Greeting was rendered at",
      /* @__PURE__ */ new Date().toLocaleTimeString()
    );
    const [count, setCount] = useState(0);
    const increment = useMemo(() => () => setCount(count + 1), [count]);
    return /* @__PURE__ */ createElement(
      "div",
      null,
      /* @__PURE__ */ createElement(
        "h3",
        null,
        name ? `Hello, ${name}!` : "Hello!"
      ),
      /* @__PURE__ */ createElement("p", null, "Count: ", count),
      /* @__PURE__ */ createElement(
        "button",
        { onClick: increment },
        "Increment"
      )
    );
  }

  // build/temp.mdx.js
  var Local = (props) =>
    jsx("span", {
      style: "color:Tomato;",
      children: props.children,
    });
  function _createMdxContent(props) {
    const _components = {
      a: "a",
      blockquote: "blockquote",
      code: "code",
      em: "em",
      h1: "h1",
      h2: "h2",
      h3: "h3",
      h4: "h4",
      h5: "h5",
      h6: "h6",
      hr: "hr",
      img: "img",
      li: "li",
      ol: "ol",
      p: "p",
      pre: "pre",
      strong: "strong",
      ul: "ul",
      ...props.components,
    };
    return jsxs(Fragment, {
      children: [
        jsx(_components.h1, {
          children: "Heading (rank 1)",
        }),
        jsx(_components.p, {
          children: "An external component:",
        }),
        jsx(GreetingApp, {}),
        jsxs(_components.p, {
          children: [
            "and a ",
            jsx(Local, {
              children: "local one",
            }),
            ".",
          ],
        }),
        jsx(_components.h2, {
          children: "Heading 2",
        }),
        jsx(_components.h3, {
          children: "Heading 3",
        }),
        jsx(_components.h4, {
          children: "Heading 4",
        }),
        jsx(_components.h5, {
          children: "Heading 5",
        }),
        jsx(_components.h6, {
          children: "Heading 6",
        }),
        jsx("div", {
          class: "note",
          children: jsxs(_components.blockquote, {
            children: [
              jsxs(_components.p, {
                children: [
                  "And here is ",
                  jsx(_components.em, {
                    children: "markdown",
                  }),
                  " in ",
                  jsx(_components.strong, {
                    children: "JSX",
                  }),
                  "!",
                ],
              }),
              "\n",
            ],
          }),
        }),
        jsxs(_components.p, {
          children: [
            jsx("abbr", {
              title: "HyperText Markup Language",
              children: "HTML",
            }),
            " is a lovely language.",
          ],
        }),
        jsxs("section", {
          children: ["Two \u{1F370} is: ", Math.PI * 2],
        }),
        jsxs(_components.ul, {
          children: [
            jsx(_components.li, {
              children: "Unordered",
            }),
            jsx(_components.li, {
              children: "List",
            }),
            "\n",
          ],
        }),
        jsxs(_components.ol, {
          children: [
            jsx(_components.li, {
              children: "Ordered",
            }),
            jsx(_components.li, {
              children: "List",
            }),
            "\n",
          ],
        }),
        jsx(_components.p, {
          children: "A paragraph, introducing a thematic break:",
        }),
        jsx(_components.hr, {}),
        jsx(_components.pre, {
          children: jsx(_components.code, {
            class: "language-js",
            children: "some.code();\n",
          }),
        }),
        jsxs(_components.p, {
          children: [
            "a ",
            jsx(_components.a, {
              href: "https://example.com",
              children: "link",
            }),
            ", an ",
            jsx(_components.img, {
              src: "./image.png",
              alt: "image",
            }),
            ", some ",
            jsx(_components.em, {
              children: "emphasis",
            }),
            ",\r\nsomething ",
            jsx(_components.strong, {
              children: "strong",
            }),
            ", and finally a little ",
            jsx(_components.code, {
              children: "code()",
            }),
            ".",
          ],
        }),
      ],
    });
  }
  function MDXContent(props = {}) {
    const { wrapper: MDXLayout } = props.components || {};
    return MDXLayout
      ? jsx(MDXLayout, {
          ...props,
          children: jsx(_createMdxContent, {
            ...props,
          }),
        })
      : _createMdxContent(props);
  }
  return __toCommonJS(temp_mdx_exports);
})();
