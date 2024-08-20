import type { JSX } from "@meact/jsx-runtime";

declare module "@meact-dom" {
  export function createRoot(
    rootNodeInBrowserDom: HTMLElement
  ): BrowserDomWriter;

  export const browserDomWriter: BrowserDomWriter;

  interface BrowserDomWriter {
    targetNodeInBrowserDom: null;
    setbrowserDomWriterAtNode(nodeInBrowserDom: any): void;
    render(meactElement: JSX.Element): void;
    rerenderTheDiff(rootReactElement: JSX.Element): void;
  }
}
