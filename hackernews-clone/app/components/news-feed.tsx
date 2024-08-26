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
      <td style={pageStyle}>
        <table style={tableStyle} className="itemlist">
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
                    id={newsItem.id}
                    submitterId={newsItem.submitterId}
                    creationTime={newsItem.creationTime}
                    hidden={newsItem.hidden}
                    isFavoriteVisible={false}
                    isJobListing={isJobListing}
                    isPostScrutinyVisible={isPostScrutinyVisible}
                    commentCount={newsItem.commentCount}
                    upvoteCount={newsItem.upvoteCount}
                    title={newsItem.title}
                  />,
                  <tr
                    key={`${newsItem.id}spacer`}
                    style={spacerStyle}
                    className="spacer"
                  />,
                ])}
              <tr
                key="morespace"
                style={moreSpacerStyle}
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

const pageStyle = { padding: "0px" };
const tableStyle = {
  border: "0px",
  padding: "0px",
  borderCollapse: "collapse",
  borderSpacing: "0px",
};
const spacerStyle = { height: 5 };
const moreSpacerStyle = { height: "10px" };
