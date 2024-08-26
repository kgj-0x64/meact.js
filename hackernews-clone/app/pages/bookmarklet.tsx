import type { JSX } from "@meact/jsx-runtime";
import { NoticeLayout } from "../layouts/notice-layout.js";

export function BookmarkletPage(): JSX.Element {
  return (
    <NoticeLayout>
      <b>Bookmarklet</b>
      <br />
      <br />
      <div id="main">
        <p id="first">
          Thanks to Phil Kast for writing this bookmarklet for submitting links
          to <a href="/">Hacker News</a>
          . When you click on the bookmarklet, it will submit the page
          you&#39;re on. To install, drag this link to your browser toolbar:
          <br />
          <br />
        </p>
        <div style={textCenteringStyle}>
          <a
            style={linkStyle}
            href="javascript:window.location=%22http://news.ycombinator.com/submitlink?u=%22+encodeURIComponent(document.location)+%22&amp;t=%22+encodeURIComponent(document.title)"
          >
            post to HN
          </a>
        </div>
        <br />
        <br />
        <table style={tableStyle}>
          <tbody>
            <tr style={tableRowStyle}>
              <td style={tableColumnStyle} />
            </tr>
          </tbody>
        </table>
        <p style={textCenteringStyle}>
          <span className="foot">
            <br />
            <br />
          </span>
        </p>
      </div>
    </NoticeLayout>
  );
}

const textCenteringStyle = { textAlign: "center" };
const linkStyle = { color: "#777", fontSize: "2em" };
const tableStyle = {
  padding: "0px",
  backgroundColor: "#ff6600",
  width: "100%",
};
const tableRowStyle = { height: "0px" };
const tableColumnStyle = { padding: "0px" };

export default BookmarkletPage;
