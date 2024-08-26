import type { JSX } from "@meact/jsx-runtime";
import sGif from "../../public/static/s.gif";

export function Footer(): JSX.Element {
  return (
    <tr>
      <td style={footerColumnStyle}>
        <img alt="" src={sGif} height="10" width="0" />
        <table style={tableStyle}>
          <tbody>
            <tr>
              <td style={ycColorStyle} />
            </tr>
          </tbody>
        </table>
        <br />
        <div style={linksContainerStyle}>
          <span className="yclinks">
            <a href="/newsguidelines">Guidelines</a>
            &nbsp;| <a href="/newsfaq">FAQ</a>
            &nbsp;| <a href="mailto:hn@ycombinator.com">Support</a>
            &nbsp;| <a href="https://github.com/HackerNews/API">API</a>
            &nbsp;| <a href="/security">Security</a>
            &nbsp;| <a href="/lists">Lists</a>
            &nbsp;| <a href="/bookmarklet">Bookmarklet</a>
            &nbsp;| <a href="/dmca">DMCA</a>
            &nbsp;| <a href="http://www.ycombinator.com/apply/">Apply to YC</a>
            &nbsp;| <a href="mailto:hn@ycombinator.com">Contact</a>
          </span>
          <br />
          <br />
          <form method="get" action="//hn.algolia.com/" style={searchFormStyle}>
            Search:
            <input
              type="text"
              name="q"
              size={17}
              autoCorrect="off"
              spellCheck={false}
              autoCapitalize="off"
              autoComplete="false"
            />
          </form>
        </div>
      </td>
    </tr>
  );
}

const footerColumnStyle = { padding: "0px" };
const tableStyle = { height: "2px", width: "100%", borderSpacing: "0px" };
const ycColorStyle = { backgroundColor: "#ff6600" };
const linksContainerStyle = { textAlign: "center" };
const searchFormStyle = { marginBottom: "1em" };
