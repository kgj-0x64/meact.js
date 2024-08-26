import { JSX } from "@meact/jsx-runtime";
import { useContext } from "@meact";
import { Form } from "./Form.js";
import { IUserPageLoader } from "../pages/user.js";
import { ICurrentLoggedInUser, MeContext } from "../utils/context.js";
import { convertNumberToTimeAgo } from "../utils/convert-number-to-time-ago.js";

interface IUserProfileProps {
  loaderData: IUserPageLoader | null;
}

export function UserProfile(
  props: JSX.PropsWithChildren<IUserProfileProps>
): JSX.Element {
  const user = props.loaderData?.user;

  const me = useContext<ICurrentLoggedInUser | undefined>(MeContext);

  if (!user) return <null />;

  let about = user.about || "";

  const onAboutChange = (e: any): void => {
    about = e.target.value;
  };

  if (!!me && user.id === me.id) {
    return (
      <>
        <tr>
          <td>
            <Form className="profileform" method="POST" action="/xuser">
              <table style={{ border: "0px" }}>
                <tbody>
                  <tr className="athing">
                    <td style={{ verticalAlign: "top" }}>user:</td>
                    <td>
                      <a
                        href={`/user?id=${user.id}`}
                        className="hnuser"
                        style={{ color: "#3c963c" }}
                      >
                        {user.id}
                      </a>
                    </td>
                  </tr>
                  <tr>
                    <td style={{ verticalAlign: "top" }}>created:</td>
                    <td>{convertNumberToTimeAgo(user.creationTime)}</td>
                  </tr>
                  <tr>
                    <td style={{ verticalAlign: "top" }}>karma:</td>
                    <td>{user.karma}</td>
                  </tr>
                  <tr>
                    <td style={{ verticalAlign: "top" }}>about:</td>
                    <td>
                      <textarea
                        name="about"
                        cols={60}
                        rows={5}
                        style={{ fontSize: "-2" }}
                        wrap="virtual"
                        defaultValue={about}
                        prop:value={about}
                        prop:onChange={onAboutChange}
                      />
                      <a
                        href="/formatdoc"
                        tabIndex={-1}
                        style={{ color: "#afafaf" }}
                      >
                        help
                      </a>
                    </td>
                  </tr>
                  <tr>
                    <td style={{ verticalAlign: "top" }}>showdead:</td>
                    <td>
                      <select defaultValue="no" name="showd">
                        <option prop:value="yes">yes</option>
                        <option prop:value="no">no</option>
                      </select>
                    </td>
                  </tr>
                  <tr>
                    <td style={{ verticalAlign: "top" }}>noprocrast:</td>
                    <td>
                      <select defaultValue="no" name="nopro">
                        <option prop:value="yes">yes</option>
                        <option prop:value="no">no</option>
                      </select>
                    </td>
                  </tr>
                  <tr>
                    <td style={{ verticalAlign: "top" }}>maxvisit:</td>
                    <td>
                      <input
                        type="text"
                        name="maxv"
                        defaultValue="20"
                        size={16}
                      />
                    </td>
                  </tr>
                  <tr>
                    <td style={{ verticalAlign: "top" }}>minaway:</td>
                    <td>
                      <input
                        type="text"
                        name="mina"
                        defaultValue="180"
                        size={16}
                      />
                    </td>
                  </tr>
                  <tr>
                    <td style={{ verticalAlign: "top" }}>delay:</td>
                    <td>
                      <input
                        type="text"
                        name="delay"
                        defaultValue="0"
                        size={16}
                      />
                    </td>
                  </tr>
                  <tr>
                    <td />
                    <td>
                      <a href="/changepw">
                        <u>change password</u>
                      </a>
                    </td>
                  </tr>
                  <tr>
                    <td />
                    <td>
                      <a href={`/submitted?id=${user.id}`}>
                        <u>submissions</u>
                      </a>
                    </td>
                  </tr>
                  <tr>
                    <td />
                    <td>
                      <a href={`/threads?id=${user.id}`}>
                        <u>comments</u>
                      </a>
                    </td>
                  </tr>
                  <tr>
                    <td />
                    <td>
                      <a href="/hidden">
                        <u>hidden</u>
                      </a>
                    </td>
                  </tr>
                  <tr>
                    <td />
                    <td>
                      <a href={`/upvoted?id=${user.id}`}>
                        <u>upvoted submissions</u>
                      </a>
                      {" / "}
                      <a href={`/upvoted?id=${user.id}&comments=t`}>
                        <u>comments</u>
                      </a>
                      &nbsp;&nbsp;
                      <span style={{ fontStyle: "italic" }}>(private)</span>
                    </td>
                  </tr>
                  <tr>
                    <td />
                    <td>
                      <a href={`/favorites?id=${user.id}`}>
                        <u>favorite submissions</u>
                      </a>
                      {" / "}
                      <a href={`/favorites?id=${user.id}&amp;comments=t`}>
                        <u>comments</u>
                      </a>
                      &nbsp;&nbsp;
                      <span style={{ fontStyle: "italic" }}>(shared)</span>
                    </td>
                  </tr>
                </tbody>
              </table>
              <br />
              <input type="submit" prop:value="update" />
            </Form>
            <br />
            <br />
          </td>
        </tr>
      </>
    );
  }

  return (
    <>
      <tr>
        <td>
          <table style={{ border: "0" }}>
            <tbody>
              <tr className="athing">
                <td style={{ verticalAlign: "top" }}>user:</td>
                <td>
                  <a href={`user?id=${user.id}`} className="hnuser">
                    {user.id}
                  </a>
                </td>
              </tr>
              <tr>
                <td style={{ verticalAlign: "top" }}>created:</td>
                <td>{convertNumberToTimeAgo(user.creationTime)}</td>
              </tr>
              <tr>
                <td style={{ verticalAlign: "top" }}>karma:</td>
                <td>{user.karma}</td>
              </tr>
              <tr>
                <td style={{ verticalAlign: "top" }}>about:</td>
                <td dangerouslySetInnerHTML={{ __html: user.about }} />
              </tr>
              <tr>
                <td />
                <td>
                  <a href={`submitted?id=${user.id}`}>
                    <u>submissions</u>
                  </a>
                </td>
              </tr>
              <tr>
                <td />
                <td>
                  <a href={`threads?id=${user.id}`}>
                    <u>comments</u>
                  </a>
                </td>
              </tr>
              <tr>
                <td />
                <td>
                  <a href={`favorites?id=${user.id}`}>
                    <u>favorites</u>
                  </a>
                </td>
              </tr>
            </tbody>
          </table>
          <br />
          <br />
        </td>
      </tr>
    </>
  );
}
