import type { JSX } from "@meact/jsx-runtime";

interface IHeaderNavProps {
  userId?: string;
  currentUrl: string;
  isNavVisible: boolean;
  title: string;
}

export function HeaderLinks(props: IHeaderNavProps): JSX.Element {
  const { userId, currentUrl, isNavVisible, title } = props;

  return isNavVisible ? (
    <span className="pagetop">
      <b className="hnname">
        <a href="/">{title}</a>
      </b>
      &nbsp;
      {userId ? (
        <>
          <a href="/newswelcome">welcome</a>
          {" | "}
        </>
      ) : (
        <null />
      )}
      <a href="/newest" className={currentUrl === "/newest" ? "topsel" : ""}>
        new
      </a>
      {userId ? (
        <>
          {" | "}
          <a
            href={`/threads?id=${userId}`}
            className={currentUrl === "/threads" ? "topsel" : ""}
          >
            threads
          </a>
        </>
      ) : (
        <null />
      )}
      {" | "}
      <a
        href="/newcomments"
        className={currentUrl === "/newcomments" ? "topsel" : ""}
      >
        comments
      </a>
      {" | "}
      <a href="/show" className={currentUrl === "/show" ? "topsel" : ""}>
        show
      </a>
      {" | "}
      <a href="/ask" className={currentUrl === "/ask" ? "topsel" : ""}>
        ask
      </a>
      {" | "}
      <a href="/jobs" className={currentUrl === "/jobs" ? "topsel" : ""}>
        jobs
      </a>
      {" | "}
      <a href="/submit" className={currentUrl === "/submit" ? "topsel" : ""}>
        submit
      </a>
      {currentUrl === "/best" ? (
        <>
          {" | "}
          <a href="/best" className="topsel">
            best
          </a>
        </>
      ) : (
        <null />
      )}
    </span>
  ) : (
    <span className="pagetop">
      <b>{title}</b>
    </span>
  );
}
