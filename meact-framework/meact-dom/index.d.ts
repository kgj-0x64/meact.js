import type { JSX } from "@meact/jsx-runtime";

declare module "@meact-dom" {
  interface BrowserDomWriter {
    targetNodeInBrowserDom: null;
    setbrowserDomWriterAtNode(nodeInBrowserDom: any): void;
    render(meactElement: JSX.Element): void;
    rerenderTheDiff(rootReactElement: JSX.Element): void;
  }

  export function createRoot(
    rootNodeInBrowserDom: HTMLElement
  ): BrowserDomWriter;

  export const browserDomWriter: BrowserDomWriter;
}
