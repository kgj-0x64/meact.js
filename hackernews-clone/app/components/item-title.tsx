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
    <tr class="athing">
      <td style={{ textAlign: "right", verticalAlign: "top" }} class="title">
        <span class="rank">{isRankVisible ? `${rank}.` : <null />}</span>
      </td>
      <td style={{ verticalAlign: "top" }} class="votelinks">
        <div style={{ textAlign: "center" }}>
          {isUpvoteVisible ? (
            <a
              href={`/vote?id=${id}&how=up&goto=${loc.pathname + loc.search}`}
              class={upvoted ? "nosee" : " "}
              style={{ cursor: "pointer" }}
            >
              <div class="votearrow" title="upvote" />
            </a>
          ) : (
            <null />
          )}
        </div>
      </td>
      <td class="title">
        {url ? (
          <>
            <a href={url} class="storylink">
              {title}
            </a>
            <span class="sitebit comhead">
              {" "}
              (
              <a href={`/from?site=${hostname}`}>
                <span class="sitestr">{hostname}</span>
              </a>
              )
            </span>
          </>
        ) : (
          <a href={`/item?id=${id}`} class="storylink">
            {title}
          </a>
        )}
      </td>
    </tr>
  );
}
