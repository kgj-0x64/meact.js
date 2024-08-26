import { convertNumberToTimeAgo } from "../utils/convert-number-to-time-ago.js";

import sGif from "../../public/static/s.gif";
import { JSX } from "@meact/jsx-runtime";
import { useMemo } from "@meact";
import { Form } from "./Form.js";

export interface ICommentProps {
  key: string;
  collapsedChildrenCommentsCount: number | undefined;
  creationTime: number;
  id: number;
  indentationLevel: number;
  isCollapsed: boolean;
  submitterId: string;
  text: string;
  toggleCollapseComment: (id: number) => void;
}

export function Comment(props: ICommentProps): JSX.Element {
  const {
    creationTime,
    collapsedChildrenCommentsCount,
    id,
    indentationLevel,
    isCollapsed,
    submitterId,
    text,
    toggleCollapseComment,
  } = props;

  const collapseComment = useMemo(
    () => () => {
      toggleCollapseComment(id);
    },
    [toggleCollapseComment, id]
  );

  return (
    <tr className="athing comtr" key={id.toString()} id={id.toString()}>
      <td>
        <table style={tableStyle}>
          <tbody>
            <tr>
              <td className="ind">
                <img
                  alt=""
                  src={sGif}
                  height="1"
                  width={
                    indentationLevel * 40
                  } /* Width varies depending on comment level */
                />
              </td>
              <td style={voteButtonColumnStyle} className="votelinks">
                <div style={voteButtonContainerStyle}>
                  <Form
                    action={`vote?id=${id}&how=up&goto=item?id=${id}`}
                    method="POST"
                  >
                    <button type="submit" style={textButtonStyle}>
                      <div className="votearrow" title="upvote" />
                    </button>
                  </Form>
                </div>
              </td>
              <td className="default">
                <div style={metaInfoContainerStyle}>
                  <span className="comhead">
                    <a href={`/user?id=${submitterId}`} className="hnuser">
                      {submitterId}
                    </a>
                    <span className="age">
                      {" "}
                      <a href={`/item?id=${id}`}>
                        {convertNumberToTimeAgo(creationTime)}
                      </a>
                    </span>{" "}
                    <span id="unv_15238246" />
                    <span className="par" />{" "}
                    {/** ! TODO collapseComment -- useMemo is perfect -- recursive function `renderCommentTreeAsFlatArray` might be buggy 
                      <button
                        type="button"
                        style={textButtonStyle}
                        className="togg"
                        prop:onClick={() => {}}
                      >
                        {isCollapsed
                          ? `[${
                              collapsedChildrenCommentsCount
                                ? `${collapsedChildrenCommentsCount + 1} more`
                                : "+"
                            }] `
                          : "[-]"}
                      </button>
                      */}
                    <span className="storyon" />
                  </span>
                </div>
                <br />
                <div key="help" className="comment">
                  <span className="c00">
                    {!isCollapsed ? (
                      <>
                        <div dangerouslySetInnerHTML={{ __html: text }} />
                        <div className="reply">
                          <p style={replyTextButtonStyle}>
                            <a href={`/reply?id=${id}&goto=item?id=${id}`}>
                              reply
                            </a>
                          </p>
                        </div>
                      </>
                    ) : (
                      <null />
                    )}
                  </span>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </td>
    </tr>
  );
}

const tableStyle = { border: "0" };
const voteButtonColumnStyle = { verticalAlign: "top" };
const voteButtonContainerStyle = { textAlign: "center" };
const textButtonStyle = {
  background: "none",
  border: "none",
  cursor: "pointer",
};
const metaInfoContainerStyle = { marginTop: "2px", marginBottom: "-10px" };
const replyTextButtonStyle = { fontSize: "1" };
