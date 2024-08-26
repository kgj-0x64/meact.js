import type { JSX } from "@meact/jsx-runtime";
import { useContext } from "@meact";
import { ICurrentLoggedInUser, MeContext } from "../utils/context.js";
import { getCurrentPathname } from "../utils/window.js";
import { HeaderLinks } from "./header-links.js";
import y18Gif from "../../public/static/y18.gif";
import { Form } from "./Form.js";

export interface IHeaderProps {
  isNavVisible: boolean;
  title: string;
}

export function Header(props: IHeaderProps): JSX.Element {
  const { isNavVisible, title } = props;

  const currentUrl = getCurrentPathname();
  const me = useContext<ICurrentLoggedInUser | undefined>(MeContext);

  return (
    <tr>
      <td style={headerColumnStyle}>
        <table style={tableStyle}>
          <tbody>
            <tr>
              <td style={logoColumnStyle}>
                <a href="/">
                  <img src={y18Gif} style={logoImageStyle} />
                </a>
              </td>
              <td style={headerLinksColumnStyle}>
                <HeaderLinks
                  currentUrl={currentUrl}
                  isNavVisible={isNavVisible}
                  title={title}
                />
              </td>
              <td style={headerRightColumnStyle}>
                {me ? (
                  <span className="pagetop">
                    <a href={`/user?id=${me.id}`}>{me.id}</a>
                    {` (${me.karma}) | `}
                    <Form action="/logout" method="POST">
                      <button type="submit" style={buttonStyle}>
                        logout
                      </button>
                    </Form>
                  </span>
                ) : (
                  <span className="pagetop">
                    <a href={`/login?goto=${currentUrl}`}>login</a>
                  </span>
                )}
              </td>
            </tr>
          </tbody>
        </table>
      </td>
    </tr>
  );
}

const headerColumnStyle = { backgroundColor: "#ff6600", padding: "0px" };
const tableStyle = {
  border: "0px",
  padding: "2px",
  borderSpacing: "0px",
  width: "100%",
};
const logoColumnStyle = { width: "18px", padding: "0px", paddingRight: "4px" };
const logoImageStyle = {
  border: "1px",
  borderColor: "white",
  borderStyle: "solid",
  height: "18px",
  width: "18px",
};
const headerLinksColumnStyle = {
  lineHeight: "12px",
  height: "10px",
  padding: "0px",
};
const headerRightColumnStyle = {
  textAlign: "right",
  padding: "0px",
  paddingRight: "4px",
};
const buttonStyle = {
  background: "none",
  border: "none",
  cursor: "pointer",
};
