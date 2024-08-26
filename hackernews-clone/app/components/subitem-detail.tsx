import type { JSX } from "@meact/jsx-runtime";

export interface ISubItemDetailProps {
  text: string;
}

export function SubItemDetail(props: ISubItemDetailProps): JSX.Element {
  const { text } = props;

  return (
    <tr>
      <td colSpan={2} />
      <td>
        <div className="comment">
          <span className="c00">
            <div dangerouslySetInnerHTML={{ __html: text }} />
          </span>
        </div>
      </td>
    </tr>
  );
}
