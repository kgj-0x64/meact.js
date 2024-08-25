import type { JSX } from "@meact/jsx-runtime";
import { convertNumberToTimeAgo } from "../utils/convert-number-to-time-ago.js";

export interface IItemDetailProps {
  key: string;
  commentCount: number;
  creationTime: number;
  hidden?: boolean;
  id: number;
  isFavoriteVisible?: boolean;
  isJobListing?: boolean;
  isPostScrutinyVisible?: boolean;
  submitterId: string;
  upvoteCount: number;
}

const HIDE_BUTTON_STYLE = { cursor: "pointer" };

export function ItemDetail(props: IItemDetailProps): JSX.Element {
  const {
    commentCount,
    creationTime,
    hidden,
    id,
    isFavoriteVisible = true,
    isJobListing = false,
    isPostScrutinyVisible = false,
    submitterId,
    upvoteCount,
  } = props;

  return isJobListing ? (
    <tr>
      <td colSpan={2} />
      <td className="subtext">
        <span className="age">
          <a href={`/item?id=${id}`}>{convertNumberToTimeAgo(creationTime)}</a>
        </span>
      </td>
    </tr>
  ) : (
    <tr>
      <td colSpan={2} />
      <td className="subtext">
        <span className="score">{upvoteCount} points</span>
        {" by "}
        <a href={`/user?id=${submitterId}`} className="hnuser">
          {submitterId}
        </a>{" "}
        <span className="age">
          <a href={`/item?id=${id}`}>{convertNumberToTimeAgo(creationTime)}</a>
        </span>
        {
          // TODO (since, not a priority rn)
          /**
            <span>
              {" | "}
              {
                hidden ? (
                  <a href={`/hide?id=${id}&how=un&goto=news`} style={HIDE_BUTTON_STYLE}>
                    unhide
                  </a>
                ) : (
                  <a href={`/hide?id=${id}&how=up&goto=news`} style={HIDE_BUTTON_STYLE}>
                    hide
                  </a>
                )
              }
            </span>
           */
        }
        {isPostScrutinyVisible ? (
          <span>
            {" | "}
            <a href="https://hn.algolia.com/?query=Sublime%20Text%203.0&sort=byDate&dateRange=all&type=story&storyText=false&prefix&page=0">
              past
            </a>
            {" | "}
            <a href="https://www.google.com/search?q=Sublime%20Text%203.0">
              web
            </a>
          </span>
        ) : (
          <null />
        )}
        <span>
          {" | "}
          <a href={`/item?id=${id}`}>
            {commentCount === 0
              ? "discuss"
              : commentCount === 1
              ? "1 comment"
              : `${commentCount} comments`}
          </a>
        </span>
        {isFavoriteVisible ? " | favorite" : <null />}
      </td>
    </tr>
  );
}
