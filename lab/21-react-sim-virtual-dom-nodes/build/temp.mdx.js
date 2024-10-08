/*Only exported values or functions are callable from the window namespace.*/
import {
  Fragment as _Fragment,
  jsx as _jsx,
  jsxs as _jsxs,
} from "@meact/jsx-runtime";
import { GreetingApp, Greeting } from "@src/components.jsx";
export const Local = (props) =>
  _jsx("span", {
    style: "color:Tomato;",
    children: props.children,
  });
export { GreetingApp, Greeting };
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
  return _jsxs(_Fragment, {
    children: [
      _jsx(_components.h1, {
        children: "Heading (rank 1)",
      }),
      _jsx(_components.p, {
        children: "An external component:",
      }),
      _jsx(GreetingApp, {}),
      _jsxs(_components.p, {
        children: [
          "and a ",
          _jsx(Local, {
            children: "local one",
          }),
          ".",
        ],
      }),
      _jsx(_components.h2, {
        children: "Heading 2",
      }),
      _jsx(_components.h3, {
        children: "Heading 3",
      }),
      _jsx(_components.h4, {
        children: "Heading 4",
      }),
      _jsx(_components.h5, {
        children: "Heading 5",
      }),
      _jsx(_components.h6, {
        children: "Heading 6",
      }),
      _jsx("div", {
        class: "note",
        children: _jsxs(_components.blockquote, {
          children: [
            _jsxs(_components.p, {
              children: [
                "And here is ",
                _jsx(_components.em, {
                  children: "markdown",
                }),
                " in ",
                _jsx(_components.strong, {
                  children: "JSX",
                }),
                "!",
              ],
            }),
            "\n",
          ],
        }),
      }),
      _jsxs(_components.p, {
        children: [
          _jsx("abbr", {
            title: "HyperText Markup Language",
            children: "HTML",
          }),
          " is a lovely language.",
        ],
      }),
      _jsxs("section", {
        children: ["Two 🍰 is: ", Math.PI * 2],
      }),
      _jsxs(_components.ul, {
        children: [
          _jsx(_components.li, {
            children: "Unordered",
          }),
          _jsx(_components.li, {
            children: "List",
          }),
          "\n",
        ],
      }),
      _jsxs(_components.ol, {
        children: [
          _jsx(_components.li, {
            children: "Ordered",
          }),
          _jsx(_components.li, {
            children: "List",
          }),
          "\n",
        ],
      }),
      _jsx(_components.p, {
        children: "A paragraph, introducing a thematic break:",
      }),
      _jsx(_components.hr, {}),
      _jsx(_components.pre, {
        children: _jsx(_components.code, {
          class: "language-js",
          children: "some.code();\n",
        }),
      }),
      _jsxs(_components.p, {
        children: [
          "a ",
          _jsx(_components.a, {
            href: "https://example.com",
            children: "link",
          }),
          ", an ",
          _jsx(_components.img, {
            src: "./image.png",
            alt: "image",
          }),
          ", some ",
          _jsx(_components.em, {
            children: "emphasis",
          }),
          ",\r\nsomething ",
          _jsx(_components.strong, {
            children: "strong",
          }),
          ", and finally a little ",
          _jsx(_components.code, {
            children: "code()",
          }),
          ".",
        ],
      }),
    ],
  });
}
export default function MDXContent(props = {}) {
  const { wrapper: MDXLayout } = props.components || {};
  return MDXLayout
    ? _jsx(MDXLayout, {
        ...props,
        children: _jsx(_createMdxContent, {
          ...props,
        }),
      })
    : _createMdxContent(props);
}
