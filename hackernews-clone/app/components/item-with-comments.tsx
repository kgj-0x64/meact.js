import { JSX } from "@meact/jsx-runtime";
import { CommentBox } from "./comment-box.js";
import { Comments } from "./comments.js";
import { ItemDetail } from "./item-detail.js";
import { ItemTitle } from "./item-title.js";
import { StoryModel } from "../../server/models/index.js";
import { SubItemDetail } from "./subitem-detail.jsx";
import { SubItemTitle } from "./subitem-title.jsx";

export interface INewsItemWithCommentsProps {
  loading?: boolean;
  newsItem: StoryModel;
}

/** Acts as the component for a page of a news item with all it's comments */
export function ItemWithComments(
  props: INewsItemWithCommentsProps
): JSX.Element {
  const {
    newsItem: {
      id,
      submitterId,
      creationTime,
      title,
      text,
      parent,
      commentCount,
      comments,
      rank,
      upvoteCount,
      url,
    },
  } = props;

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
            {!parent ? (
              <ItemTitle
                key={id.toString()}
                id={id}
                rank={rank}
                title={!parent ? title : text!}
                url={url}
                isRankVisible={false}
                upvoted={false}
              />
            ) : (
              <SubItemTitle
                id={id}
                parent={parent}
                submitterId={submitterId}
                creationTime={creationTime}
                upvoteCount={upvoteCount}
                upvoted={false}
              />
            )}
            {!parent ? (
              <ItemDetail
                key={id.toString()}
                id={id}
                submitterId={submitterId}
                creationTime={creationTime}
                isPostScrutinyVisible
                commentCount={commentCount}
                upvoteCount={upvoteCount}
                title={title}
              />
            ) : (
              <SubItemDetail text={text!} />
            )}
            <tr
              key="morespace"
              className="morespace"
              style={{ height: "10px" }}
            />
            <CommentBox parentId={id} isParentRootItem={!parent} />
          </tbody>
        </table>
        <br />
        <br />
        <Comments comments={comments} shouldIndent />
        <br />
        <br />
      </td>
    </tr>
  );
}
