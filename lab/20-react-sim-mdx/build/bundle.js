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

  // meact/jsx-runtime.js
  function Fragment() {
    return "Fragment";
  }
  function jsx(type, props, key) {
    const { children, restOfProps } = props;
    return createElement(type, { ...restOfProps, key }, children);
  }
  function jsxs(type, props, key) {
    const { children, restOfProps } = props;
    return createElement(type, { ...restOfProps, key }, ...children);
  }

  // build/temp.mdx.js
  var Local = (props) =>
    /* @__PURE__ */ jsx("span", {
      style: {
        color: "red",
      },
      ...props,
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
    return /* @__PURE__ */ jsxs(Fragment, {
      children: [
        /* @__PURE__ */ jsx(_components.h1, { children: "Heading (rank 1)" }),
        "\n",
        "\n",
        "\n",
        /* @__PURE__ */ jsx(_components.p, {
          children: "An external component:",
        }),
        "\n",
        /* @__PURE__ */ jsx(GreetingApp, {}),
        "\n",
        /* @__PURE__ */ jsxs(_components.p, {
          children: [
            "and a ",
            /* @__PURE__ */ jsx(Local, { children: "local one" }),
            ".",
          ],
        }),
        "\n",
        /* @__PURE__ */ jsx(_components.h2, { children: "Heading 2" }),
        "\n",
        /* @__PURE__ */ jsx(_components.h3, { children: "3" }),
        "\n",
        /* @__PURE__ */ jsx(_components.h4, { children: "4" }),
        "\n",
        /* @__PURE__ */ jsx(_components.h5, { children: "5" }),
        "\n",
        /* @__PURE__ */ jsx(_components.h6, { children: "6" }),
        "\n",
        /* @__PURE__ */ jsx("div", {
          class: "note",
          children: /* @__PURE__ */ jsxs(_components.blockquote, {
            children: [
              "\n",
              /* @__PURE__ */ jsxs(_components.p, {
                children: [
                  "And here is ",
                  /* @__PURE__ */ jsx(_components.em, { children: "markdown" }),
                  " in ",
                  /* @__PURE__ */ jsx(_components.strong, { children: "JSX" }),
                  "!",
                ],
              }),
              "\n",
            ],
          }),
        }),
        "\n",
        /* @__PURE__ */ jsxs(_components.p, {
          children: [
            /* @__PURE__ */ jsx("abbr", {
              title: "HyperText Markup Language",
              children: "HTML",
            }),
            " is a lovely language.",
          ],
        }),
        "\n",
        /* @__PURE__ */ jsxs("section", {
          children: ["Two \u{1F370} is: ", Math.PI * 2],
        }),
        "\n",
        /* @__PURE__ */ jsxs(_components.ul, {
          children: [
            "\n",
            /* @__PURE__ */ jsx(_components.li, { children: "Unordered" }),
            "\n",
            /* @__PURE__ */ jsx(_components.li, { children: "List" }),
            "\n",
          ],
        }),
        "\n",
        /* @__PURE__ */ jsxs(_components.ol, {
          children: [
            "\n",
            /* @__PURE__ */ jsx(_components.li, { children: "Ordered" }),
            "\n",
            /* @__PURE__ */ jsx(_components.li, { children: "List" }),
            "\n",
          ],
        }),
        "\n",
        /* @__PURE__ */ jsx(_components.p, {
          children: "A paragraph, introducing a thematic break:",
        }),
        "\n",
        /* @__PURE__ */ jsx(_components.hr, {}),
        "\n",
        /* @__PURE__ */ jsx(_components.pre, {
          children: /* @__PURE__ */ jsx(_components.code, {
            className: "language-js",
            children: "some.code();\n",
          }),
        }),
        "\n",
        /* @__PURE__ */ jsxs(_components.p, {
          children: [
            "a ",
            /* @__PURE__ */ jsx(_components.a, {
              href: "https://example.com",
              children: "link",
            }),
            ", an ",
            /* @__PURE__ */ jsx(_components.img, {
              src: "./image.png",
              alt: "image",
            }),
            ", some ",
            /* @__PURE__ */ jsx(_components.em, { children: "emphasis" }),
            ",\r\nsomething ",
            /* @__PURE__ */ jsx(_components.strong, { children: "strong" }),
            ", and finally a little ",
            /* @__PURE__ */ jsx(_components.code, { children: "code()" }),
            ".",
          ],
        }),
      ],
    });
  }
  function MDXContent(props = {}) {
    const { wrapper: MDXLayout } = props.components || {};
    return MDXLayout
      ? /* @__PURE__ */ jsx(MDXLayout, {
          ...props,
          children: /* @__PURE__ */ jsx(_createMdxContent, { ...props }),
        })
      : _createMdxContent(props);
  }
  return __toCommonJS(temp_mdx_exports);
})();
