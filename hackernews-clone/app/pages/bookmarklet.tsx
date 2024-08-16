import { MeactElement } from "@meact";
import { NoticeLayout } from "../layouts/notice-layout";

export function BookmarkletPage(): MeactElement {
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
        <div style={{ textAlign: "center" }}>
          <a
            style={{ color: "#777", fontSize: "2em" }}
            href="javascript:window.location=%22http://news.ycombinator.com/submitlink?u=%22+encodeURIComponent(document.location)+%22&amp;t=%22+encodeURIComponent(document.title)"
          >
            post to HN
          </a>
        </div>
        <br />
        <br />
        <table
          style={{ padding: "0px", backgroundColor: "#ff6600", width: "100%" }}
        >
          <tbody>
            <tr style={{ height: "0px" }}>
              <td style={{ padding: "0px" }} />
            </tr>
          </tbody>
        </table>
        <p style={{ textAlign: "center" }}>
          <span class="foot">
            <br />
            <br />
          </span>
        </p>
      </div>
    </NoticeLayout>
  );
}

export default BookmarkletPage;
