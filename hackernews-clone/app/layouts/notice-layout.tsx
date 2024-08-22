import { JSX } from "@meact/jsx-runtime";
import yc500Gif from "../../public/static/yc500.gif";
import "../styles/yc.css";

export function NoticeLayout(props: JSX.PropsWithChildren<{}>): JSX.Element {
  const { children } = props;

  return (
    <div>
      <br />
      <br />
      <table
        style={{
          marginLeft: "auto",
          marginRight: "auto",
          padding: "0px",
          width: "500px",
        }}
      >
        <tbody>
          <tr>
            <td style={{ backgroundColor: "#fafaf0" }}>
              <a href="http://www.ycombinator.com">
                <img
                  alt=""
                  src={yc500Gif}
                  style={{ border: "0px" }}
                  width="500"
                />
              </a>
              <br />
              <br />
              {children}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
