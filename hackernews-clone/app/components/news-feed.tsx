import type { JSX } from "@meact/jsx-runtime";
import { useCurrentPathname } from "../custom-hooks/useLocation.js";
import { LoadingSpinner } from "./loading-spinner.js";
import { ItemDetail } from "./item-detail.js";
import { ItemTitle } from "./item-title.js";
import type { IStory } from "../../server/responses/index.js";

export interface INewsFeedProps {
  error?: any;
  isJobListing?: boolean;
  isLoading?: boolean;
  isPostScrutinyVisible?: boolean;
  isRankVisible?: boolean;
  isUpvoteVisible?: boolean;
  stories: Array<IStory | void> | void;
  notice?: JSX.Element;
  pageNumber: number;
  postsPerPage: number;
}

export function NewsFeed(props: INewsFeedProps): JSX.Element {
  const {
    error,
    isJobListing = false,
    isLoading,
    isPostScrutinyVisible = false,
    isRankVisible = true,
    isUpvoteVisible = true,
    notice = null,
    pageNumber,
    postsPerPage,
    stories,
  } = props;

  const currentPathname = useCurrentPathname();

  if (error) {
    return (
      <tr>
        <td>Error loading news items.</td>
      </tr>
    );
  }

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!stories?.length) {
    return (
      <tr>
        <td>No stories found.</td>
      </tr>
    );
  }

  const nextPage = pageNumber + 1;

  return (
    <tr>
      <td style={{ padding: "0px" }}>
        <table
          style={{
            border: "0px",
            padding: "0px",
            borderCollapse: "collapse",
            borderSpacing: "0px",
          }}
          className="itemlist"
        >
          <tbody>
            {notice ? notice : <null />}
            <>
              {...stories
                .filter(
                  (newsItem): newsItem is IStory =>
                    !!newsItem && !newsItem.hidden
                )
                .flatMap((newsItem, index) => [
                  <ItemTitle
                    key={`${newsItem.id}title`}
                    id={newsItem.id}
                    isRankVisible={isRankVisible}
                    isUpvoteVisible={isUpvoteVisible}
                    rank={postsPerPage * (pageNumber - 1) + index + 1}
                    title={newsItem.title}
                    upvoted={newsItem.didUserUpvote}
                    url={newsItem.url}
                  />,
                  <ItemDetail
                    key={`${newsItem.id}detail`}
                    commentCount={newsItem.commentCount}
                    creationTime={newsItem.creationTime}
                    hidden={newsItem.hidden}
                    id={newsItem.id}
                    isFavoriteVisible={false}
                    isJobListing={isJobListing}
                    isPostScrutinyVisible={isPostScrutinyVisible}
                    submitterId={newsItem.submitterId}
                    upvoteCount={newsItem.upvoteCount}
                  />,
                  <tr
                    key={`${newsItem.id}spacer`}
                    style={{ height: 5 }}
                    className="spacer"
                  />,
                ])}
              <tr
                key="morespace"
                style={{ height: "10px" }}
                className="morespace"
              />
              <tr key="morelinktr">
                <td key="morelinkcolspan" colSpan={2} />
                <td key="morelinktd" className="title">
                  <a
                    href={`${currentPathname}?p=${nextPage}`}
                    key="morelink"
                    className="morelink"
                    rel="nofollow"
                  >
                    More
                  </a>
                </td>
              </tr>
            </>
          </tbody>
        </table>
      </td>
    </tr>
  );
}
