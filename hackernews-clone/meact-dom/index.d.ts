import { MeactElement } from "@meact";

declare module "@meact-dom" {
  export function createRoot(
    rootNodeInBrowserDom: HTMLElement
  ): BrowserDomWriter;

  export const browserDomWriter: BrowserDomWriter;

  interface BrowserDomWriter {
    targetNodeInBrowserDom: null;
    setbrowserDomWriterAtNode(nodeInBrowserDom: any): void;
    render(meactElement: MeactElement): void;
    rerenderTheDiff(rootReactElement: MeactElement): void;
  }
}
