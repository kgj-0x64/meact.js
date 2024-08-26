import { JSX } from "@meact/jsx-runtime";

export interface ICommentBoxProps {
  parentId: number;
  isParentRootItem: boolean;
}

export function CommentBox(props: ICommentBoxProps): JSX.Element {
  const { parentId, isParentRootItem } = props;

  return (
    <tr>
      <td colSpan={2} />
      <td>
        <form method="post" action="comment">
          <input type="hidden" name="parent" prop:value={parentId} />
          <input type="hidden" name="goto" prop:value={`item?id=${parentId}`} />
          <textarea name="text" rows={6} cols={60} />
          <br />
          <br />
          <input
            type="submit"
            prop:value={isParentRootItem ? "add comment" : "reply"}
          />
        </form>
      </td>
    </tr>
  );
}
