var meactCsrClient = (() => {
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // meact-csr/client.js
  var client_exports = {};
  __export(client_exports, {
    hydration: () => hydration,
    run: () => run
  });

  // app/components/Layout.js
  function Layout({ children }) {
    return /* @__PURE__ */ createElement("div", null, /* @__PURE__ */ createElement("nav", null, /* @__PURE__ */ createElement("a", { href: "/home" }, "Home"), " | ", /* @__PURE__ */ createElement("a", { href: "/about" }, "About")), /* @__PURE__ */ createElement("main", null, children));
  }
  var Layout_default = Layout;

  // app/app.js
  function MyApp({ Page, pageProps }) {
    return /* @__PURE__ */ createElement(Layout_default, null, /* @__PURE__ */ createElement(Page, { ...pageProps }));
  }
  var app_default = MyApp;

  // meact-csr/client.js
  function hydration(PageComponent, pageProps) {
    const targetNodeInBrowserDom = document.getElementById("root");
    const browserDomPainterAtTargetNode = createRoot(targetNodeInBrowserDom);
    const renderTreeRootNode = createElement(app_default, {
      Page: PageComponent,
      pageProps
    });
    browserDomPainterAtTargetNode.render(renderTreeRootNode);
  }
  async function run({ stylesheetBundlePath, scriptBundlePath }) {
    try {
      const pageName = getFileNameWithoutExtension(scriptBundlePath);
      const pageBuildRef = window[pageName];
      hydration(pageBuildRef.default, {});
      console.log("App script has been loaded and executed successfully");
    } catch (error) {
      console.error(
        "An error occurred in loading or executing app script:",
        error
      );
    }
  }
  function getFileNameWithoutExtension(relativePath) {
    const fileNameWithExtension = relativePath.slice(
      relativePath.lastIndexOf("/") + 1
    );
    const lastDotIndex = fileNameWithExtension.lastIndexOf(".");
    const fileNameWithoutExtension = lastDotIndex !== -1 ? fileNameWithExtension.slice(0, lastDotIndex) : fileNameWithExtension;
    return fileNameWithoutExtension;
  }
  return __toCommonJS(client_exports);
})();
