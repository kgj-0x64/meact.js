import type { JSX } from "@meact/jsx-runtime";
import { MainLayout } from "../layouts/main-layout.js";

export function FormatDocPage(): JSX.Element {
  return (
    <MainLayout
      isFooterVisible={false}
      isNavVisible={false}
      title="Formatting Options"
    >
      <tr>
        <td>
          <span class="admin">
            <div style={{ textAlign: "center" }}>
              <table style={{ width: "500px" }}>
                <tbody>
                  <tr>
                    <td>
                      Blank lines separate paragraphs.
                      <p>
                        Text after a blank line that is indented by two or more
                        spaces is reproduced verbatim. (This is intended for
                        code.)
                      </p>
                      <p>
                        Text surrounded by asterisks is italicized, if the
                        character after the first asterisk isn&#39;t whitespace.
                      </p>
                      <p>
                        Urls become links, except in the text field of a
                        submission.
                        <br />
                        <br />
                      </p>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </span>
          <br />
          <br />
        </td>
      </tr>
    </MainLayout>
  );
}

export default FormatDocPage;
