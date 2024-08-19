import { MeactElement } from "@meact";
import { MeactMeta } from "@meact-csr";
import { MainLayout } from "../layouts/main-layout";

export const meta: MeactMeta = () => [
  { title: { text: "Formatting Options | Hacker News Clone" } },
];

export function FormatDocPage(): MeactElement {
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
