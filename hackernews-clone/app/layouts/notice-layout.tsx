import { JSX } from "@meact/jsx-runtime";
import yc500Gif from "../../public/static/yc500.gif";
import "../styles/yc.css";

export function NoticeLayout(props: JSX.PropsWithChildren<{}>): JSX.Element {
  const { children } = props;

  return (
    <div>
      <br />
      <br />
      <table style={tableStyle}>
        <tbody>
          <tr>
            <td style={logoContainerStyle}>
              <a href="http://www.ycombinator.com">
                <img alt="" src={yc500Gif} style={logoImageStyle} width="500" />
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

const tableStyle = {
  marginLeft: "auto",
  marginRight: "auto",
  padding: "0px",
  width: "500px",
};
const logoContainerStyle = { backgroundColor: "#fafaf0" };
const logoImageStyle = { border: "0px" };
