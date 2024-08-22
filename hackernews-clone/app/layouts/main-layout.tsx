import { JSX } from "@meact/jsx-runtime";
import { useLoaderData } from "@meact-framework/client";
import { Footer } from "../components/footer.js";
import { Header } from "../components/header.js";
import { MeContext } from "../utils/context.js";
import "../styles/news.css";

interface IMainLayoutProps {
  isNavVisible?: boolean;
  isUserVisible?: boolean;
  isFooterVisible?: boolean;
  title?: string;
}

export interface IMainLoader {
  me: { id: string; karma: number } | undefined;
}

export function MainLayout(
  props: JSX.PropsWithChildren<IMainLayoutProps>
): JSX.Element {
  const {
    children,
    isNavVisible = true,
    isFooterVisible = true,
    title = "Hacker News",
  } = props;

  const loaderData = useLoaderData<IMainLoader>();
  const me = loaderData?.me;

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
            {children}
            {isFooterVisible ? <Footer /> : <null />}
          </tbody>
        </table>
      </div>
    </MeContext.Provider>
  );
}
