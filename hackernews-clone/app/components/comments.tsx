import { JSX } from "@meact/jsx-runtime";
import { IComment } from "../../server/responses/index.js";
import { Comment } from "./comment.js";
import { useMemo, useState } from "@meact";

export interface ICommentsProps {
  comments: IComment[];
  shouldIndent: boolean;
}

export interface ICollapsedComments {
  [key: number]: boolean;
}

export function Comments(props: ICommentsProps): JSX.Element {
  const { comments, shouldIndent } = props;

  const [collapsedComments, setCollapsedComments] =
    useState<ICollapsedComments>({});

  const toggleCollapseComment = useMemo(
    () => (id: number) => {
      setCollapsedComments({
        ...collapsedComments,
        [id]: !collapsedComments[id],
      });
    },
    [collapsedComments, setCollapsedComments]
  );

  return (
    <table className="comment-tree" style={commentsTableStyle}>
      <tbody>
        {renderCommentTreeAsFlatArray(
          [],
          comments,
          0,
          shouldIndent,
          collapsedComments,
          toggleCollapseComment
        )}
      </tbody>
    </table>
  );
}

/**
 * Recursively flattens tree into flat array and calls the callback on each item
 */
function renderCommentTreeAsFlatArray(
  array: any[],
  comments: IComment[],
  level: number,
  shouldIndent: boolean,
  collapsedComments: ICollapsedComments,
  toggleCollapseComment: (id: number) => void
): JSX.Node {
  for (const comment of comments) {
    if (typeof comment === "number") continue;

    const isCollapsed = collapsedComments[comment.id];
    const children = comment.comments;

    array.push(
      <Comment
        key={comment.id.toString()}
        collapsedChildrenCommentsCount={
          isCollapsed ? countChildrenComments(children) : undefined
        }
        submitterId={comment.submitterId}
        text={comment.text}
        toggleCollapseComment={toggleCollapseComment}
        creationTime={comment.creationTime}
        id={comment.id}
        indentationLevel={level}
        isCollapsed={isCollapsed}
      />
    );

    if (!isCollapsed && Array.isArray(children) && children.length > 0) {
      renderCommentTreeAsFlatArray(
        array,
        children,
        level + (shouldIndent ? 1 : 0),
        shouldIndent,
        collapsedComments,
        toggleCollapseComment
      );
    }
  }

  return array;
}

function countChildrenComments(comments: IComment[]): number {
  return (
    comments.length +
    comments.reduce((count, comment) => {
      if (comment.comments) count += countChildrenComments(comment.comments);
      return count;
    }, 0)
  );
}

const commentsTableStyle = { border: "0" };
