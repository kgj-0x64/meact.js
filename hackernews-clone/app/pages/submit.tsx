import { JSX } from "@meact/jsx-runtime";
import { useMemo, useState } from "@meact";
import { MainLayout } from "../layouts/main-layout.js";
import { FormAction } from "../components/FormAction.js";

export interface ISubmitPageAction {
  title?: boolean;
  textOrUrl?: boolean;
  text?: boolean;
  url?: boolean;
}

function SubmitPage(): JSX.Element {
  const [actionData, setActionData] = useState<ISubmitPageAction | null>(null);

  const [title, setTitle] = useState<string>("");
  const [url, setUrl] = useState<string>("");
  const [text, setText] = useState<string>("");

  const memoizedOnSuccess = useMemo(
    () => (data: ISubmitPageAction) => setActionData(data),
    []
  );

  const memoizedOnTitleInputChange = useMemo(
    () => (e: any) => setTitle(e.target.value),
    []
  );

  const memoizedOnUrlInputChange = useMemo(
    () => (e: any) => setUrl(e.target.value),
    []
  );

  const memoizedOnTextAreaChange = useMemo(
    () => (e: any) => setText(e.target.value),
    []
  );

  return (
    <MainLayout title="Submit" isNavVisible={false} isFooterVisible={false}>
      {actionData?.title ? (
        <div style={errorTextStyle}>A title is required.</div>
      ) : (
        <null />
      )}
      {actionData?.textOrUrl ? (
        <div style={errorTextStyle}>URL or Text is required.</div>
      ) : (
        <null />
      )}
      {actionData?.url ? (
        <div style={errorTextStyle}>URL is not correctly formatted.</div>
      ) : (
        <null />
      )}
      <tr>
        <td>
          <div style={{ color: "blue" }}>{JSON.stringify(actionData)}</div>
          <FormAction
            method="POST"
            action="/submit"
            onSuccess={memoizedOnSuccess}
          >
            <div style={{ color: "blue" }}>{JSON.stringify(actionData)}</div>
            <table style={tableStyle}>
              <tbody>
                <tr>
                  <td>title</td>
                  <td>
                    <input
                      type="text"
                      name="title"
                      defaultValue=""
                      size={50}
                      prop:value={title}
                      prop:onChange={memoizedOnTitleInputChange}
                    />
                  </td>
                </tr>
                <tr>
                  <td>url</td>
                  <td>
                    <input
                      type="text"
                      name="url"
                      defaultValue=""
                      size={50}
                      prop:value={url}
                      prop:onChange={memoizedOnUrlInputChange}
                    />
                  </td>
                </tr>
                <tr>
                  <td>text</td>
                  <td>
                    <textarea
                      name="text"
                      rows={4}
                      cols={49}
                      prop:value={text}
                      prop:onChange={memoizedOnTextAreaChange}
                    />
                  </td>
                </tr>
                <tr>
                  <td />
                  <td />
                </tr>
                <tr>
                  <td />
                  <td>
                    <input type="submit" prop:value="submit" />
                  </td>
                </tr>
                <tr style={placeholderRowStyle} />
                <tr>
                  <td />
                  <td>
                    Leave url blank to submit a question for discussion. If
                    there is no url, the text (if any) will appear at the top of
                    the thread.
                    <br />
                    <br />
                    You can also submit via{" "}
                    <a href="/bookmarklet" rel="nofollow">
                      <u>bookmarklet</u>
                    </a>
                    .
                  </td>
                </tr>
              </tbody>
            </table>
          </FormAction>
        </td>
      </tr>
    </MainLayout>
  );
}

const errorTextStyle = { color: "red" };
const tableStyle = { border: "0" };
const placeholderRowStyle = { height: "20px" };

export default SubmitPage;
