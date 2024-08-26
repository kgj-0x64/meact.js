import type { JSX } from "@meact/jsx-runtime";
import { useLocation } from "../custom-hooks/useLocation.js";
import { Form } from "./Form.js";
import { convertNumberToTimeAgo } from "../utils/convert-number-to-time-ago.js";

export interface ISubItemTitleProps {
  id: number;
  parent: number;
  isUpvoteVisible?: boolean;
  upvoted: boolean;
  creationTime: number;
  submitterId: string;
  upvoteCount?: number | null;
  isFavoriteVisible?: boolean;
}

export function SubItemTitle(props: ISubItemTitleProps): JSX.Element {
  const {
    id,
    parent,
    isUpvoteVisible = true,
    upvoted,
    submitterId,
    creationTime,
    upvoteCount,
    isFavoriteVisible,
  } = props;

  const loc = useLocation();

  return (
    <tr>
      <td colSpan={1} />
      <td style={voteButtonColumnStyle} className="votelinks">
        <div style={voteButtonContainerStyle}>
          {isUpvoteVisible ? (
            <Form
              action={`/vote?id=${id}&how=up&goto=${loc.pathname + loc.search}`}
              method="POST"
            >
              <button
                type="submit"
                style={buttonStyle}
                className={upvoted ? "nosee" : " "}
              >
                <div className="votearrow" title="upvote" />
              </button>
            </Form>
          ) : (
            <null />
          )}
        </div>
      </td>
      <td className="subtext">
        <a href={`/user?id=${submitterId}`} className="hnuser">
          {submitterId}
        </a>{" "}
        <span className="age">
          <a href={`/item?id=${id}`}>{convertNumberToTimeAgo(creationTime)}</a>
        </span>
        {" | "}
        <span className="score">{upvoteCount ? upvoteCount : 0} points</span>
        {" | "}
        <span className="age">
          <a href={`/item?id=${parent}`}>parent</a>
        </span>
      </td>
    </tr>
  );
}

const voteButtonColumnStyle = { verticalAlign: "top" };
const voteButtonContainerStyle = { textAlign: "center" };
const buttonStyle = {
  background: "none",
  border: "none",
  cursor: "pointer",
};
