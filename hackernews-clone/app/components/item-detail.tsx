import type { JSX } from "@meact/jsx-runtime";
import { convertNumberToTimeAgo } from "../utils/convert-number-to-time-ago.js";
import { generateHnUrl } from "../utils/generateThirdPartyUrl.js";

export interface IItemDetailProps {
  key: string;
  creationTime: number;
  hidden?: boolean;
  id: number;
  isFavoriteVisible?: boolean;
  isJobListing?: boolean;
  isPostScrutinyVisible?: boolean;
  submitterId: string;
  commentCount?: number;
  upvoteCount?: number | null;
  title: string;
}

const HIDE_BUTTON_STYLE = { cursor: "pointer" };

export function ItemDetail(props: IItemDetailProps): JSX.Element {
  const {
    id,
    submitterId,
    creationTime,
    isFavoriteVisible = true,
    isJobListing = false,
    isPostScrutinyVisible = false,
    commentCount,
    upvoteCount,
    title,
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
        <span className="score">{upvoteCount ? upvoteCount : 0} points</span>
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
            <a href={generateHnUrl(title)}>past</a>
          </span>
        ) : (
          <null />
        )}
        <span>
          {" | "}
          <a href={`/item?id=${id}`}>
            {!commentCount || commentCount === 0
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
