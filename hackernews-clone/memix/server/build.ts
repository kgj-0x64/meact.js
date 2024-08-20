import * as MainLayout from "server/api/routes/_mainLayout";

type ComponentType = "Page" | "Layout" | "Component";

interface IComponentServerSideHandlers {
  type: ComponentType;
  memoFn?: Function;
  loaderFn?: Function;
  actionFn?: Function;
}

export const mapOfComponentNameToServerSideHandlers: Map<
  string,
  IComponentServerSideHandlers
> = new Map([
  /// LAYOUTS ///
  [
    "MainLayout",
    {
      type: "Layout",
      loaderFn: MainLayout.loader,
    },
  ],

  /// PAGES ///
  [
    "ActivePage",
    {
      type: "Page",
    },
  ],
]);
