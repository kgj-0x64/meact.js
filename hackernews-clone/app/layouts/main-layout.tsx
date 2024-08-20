import { JSX } from "@meact/jsx-runtime";
import { useLoaderData } from "memix/client/useLoaderData";
import { Footer } from "../components/footer";
import { Header } from "../components/header";
import "../styles/news.css";
import { MeContext } from "../utils/context";

interface IMainLayoutProps {
  children?: JSX.Node;
  isNavVisible?: boolean;
  isUserVisible?: boolean;
  isFooterVisible?: boolean;
  title?: string;
}

export interface IMainLoader {
  me: { id: string; karma: number } | undefined;
}

export function MainLayout(props: IMainLayoutProps): JSX.Element {
  const {
    children,
    isNavVisible = true,
    isFooterVisible = true,
    title = "Hacker News",
  } = props;

  const { me } = useLoaderData<IMainLoader>();

  return (
    <MeContext.Provider value={me}>
      <div>
        <table
          id="hnmain"
          style={{
            backgroundColor: "#f6f6ef",
            border: "0px",
            borderCollapse: "collapse",
            borderSpacing: "0px",
            marginLeft: "auto",
            marginRight: "auto",
            padding: "0px",
            width: "85%",
          }}
        >
          <tbody>
            <Header isNavVisible={!!isNavVisible} title={title!} />
            <tr id="pagespace" style={{ height: "10px" }} />
            {...children}
            {isFooterVisible ? <Footer /> : <null />}
          </tbody>
        </table>
      </div>
    </MeContext.Provider>
  );
}
