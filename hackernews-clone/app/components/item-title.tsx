import type { JSX } from "@meact/jsx-runtime";
import { useLocation } from "../custom-hooks/useLocation.js";

export interface IItemTitleProps {
  key: string;
  id: number;
  isRankVisible?: boolean;
  isUpvoteVisible?: boolean;
  rank?: number;
  title: string;
  url: string | undefined;
  upvoted: boolean;
}

export function ItemTitle(props: IItemTitleProps): JSX.Element {
  const {
    id,
    isRankVisible = true,
    isUpvoteVisible = true,
    rank,
    title,
    upvoted,
    url,
  } = props;

  const loc = useLocation();

  const hostname: string | undefined = url ? new URL(url).hostname : undefined;

  return (
    <tr className="athing">
      <td
        style={{ textAlign: "right", verticalAlign: "top" }}
        className="title"
      >
        <span className="rank">{isRankVisible ? `${rank}.` : <null />}</span>
      </td>
      <td style={{ verticalAlign: "top" }} className="votelinks">
        <div style={{ textAlign: "center" }}>
          {isUpvoteVisible ? (
            <a
              href={`/vote?id=${id}&how=up&goto=${loc.pathname + loc.search}`}
              className={upvoted ? "nosee" : " "}
              style={{ cursor: "pointer" }}
            >
              <div className="votearrow" title="upvote" />
            </a>
          ) : (
            <null />
          )}
        </div>
      </td>
      <td className="title">
        {url ? (
          <>
            <a href={url} className="storylink">
              {title}
            </a>
            <span className="sitebit comhead">
              {" "}
              (
              <a href={`/from?site=${hostname}`}>
                <span className="sitestr">{hostname}</span>
              </a>
              )
            </span>
          </>
        ) : (
          <a href={`/item?id=${id}`} className="storylink">
            {title}
          </a>
        )}
      </td>
    </tr>
  );
}
