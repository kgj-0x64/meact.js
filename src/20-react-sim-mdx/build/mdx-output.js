var MDXContent = (() => {
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
  var stdin_exports = {};
  __export(stdin_exports, {
    Local: () => Local,
    default: () => MDXContent,
  });
  var import_components = require("./src/components.jsx");
  var import_jsx_runtime = require("meact/jsx-runtime");
  const Local = (props) =>
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
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
    return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
      import_jsx_runtime.Fragment,
      {
        children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(_components.h1, {
            children: "Heading (rank 1)",
          }),
          "\n",
          "\n",
          "\n",
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(_components.p, {
            children: "An external component:",
          }),
          "\n",
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
            import_components.GreetingApp,
            {}
          ),
          "\n",
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(_components.p, {
            children: [
              "and a ",
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Local, {
                children: "local one",
              }),
              ".",
            ],
          }),
          "\n",
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(_components.h2, {
            children: "Heading 2",
          }),
          "\n",
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(_components.h3, {
            children: "3",
          }),
          "\n",
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(_components.h4, {
            children: "4",
          }),
          "\n",
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(_components.h5, {
            children: "5",
          }),
          "\n",
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(_components.h6, {
            children: "6",
          }),
          "\n",
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
            class: "note",
            children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
              _components.blockquote,
              {
                children: [
                  "\n",
                  /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(_components.p, {
                    children: [
                      "And here is ",
                      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                        _components.em,
                        { children: "markdown" }
                      ),
                      " in ",
                      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                        _components.strong,
                        { children: "JSX" }
                      ),
                      "!",
                    ],
                  }),
                  "\n",
                ],
              }
            ),
          }),
          "\n",
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(_components.p, {
            children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("abbr", {
                title: "HyperText Markup Language",
                children: "HTML",
              }),
              " is a lovely language.",
            ],
          }),
          "\n",
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
            children: ["Two \u{1F370} is: ", Math.PI * 2],
          }),
          "\n",
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(_components.ul, {
            children: [
              "\n",
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(_components.li, {
                children: "Unordered",
              }),
              "\n",
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(_components.li, {
                children: "List",
              }),
              "\n",
            ],
          }),
          "\n",
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(_components.ol, {
            children: [
              "\n",
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(_components.li, {
                children: "Ordered",
              }),
              "\n",
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(_components.li, {
                children: "List",
              }),
              "\n",
            ],
          }),
          "\n",
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(_components.p, {
            children: "A paragraph, introducing a thematic break:",
          }),
          "\n",
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(_components.hr, {}),
          "\n",
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(_components.pre, {
            children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
              _components.code,
              { className: "language-js", children: "some.code();\n" }
            ),
          }),
          "\n",
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(_components.p, {
            children: [
              "a ",
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(_components.a, {
                href: "https://example.com",
                children: "link",
              }),
              ", an ",
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(_components.img, {
                src: "./image.png",
                alt: "image",
              }),
              ", some ",
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(_components.em, {
                children: "emphasis",
              }),
              ",\r\nsomething ",
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(_components.strong, {
                children: "strong",
              }),
              ", and finally a little ",
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(_components.code, {
                children: "code()",
              }),
              ".",
            ],
          }),
        ],
      }
    );
  }
  function MDXContent(props = {}) {
    const { wrapper: MDXLayout } = props.components || {};
    return MDXLayout
      ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MDXLayout, {
          ...props,
          children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
            _createMdxContent,
            { ...props }
          ),
        })
      : _createMdxContent(props);
  }
  return __toCommonJS(stdin_exports);
})();
