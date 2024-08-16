import { MeactElement } from "@meact";

interface IHeaderNavProps {
  userId?: string;
  currentUrl: string;
  isNavVisible: boolean;
  title: string;
}

export function HeaderLinks(props: IHeaderNavProps): MeactElement {
  const { userId, currentUrl, isNavVisible, title } = props;

  return isNavVisible ? (
    <span class="pagetop">
      <b class="hnname">
        <a href="/">{title}</a>
      </b>
      &nbsp;
      {userId && (
        <>
          <a href="/newswelcome">welcome</a>
          {" | "}
        </>
      )}
      <a href="/newest" class={currentUrl === "/newest" ? "topsel" : ""}>
        new
      </a>
      {userId && (
        <>
          {" | "}
          <a
            href={`/threads?id=${userId}`}
            class={currentUrl === "/threads" ? "topsel" : ""}
          >
            threads
          </a>
        </>
      )}
      {" | "}
      <a
        href="/newcomments"
        class={currentUrl === "/newcomments" ? "topsel" : ""}
      >
        comments
      </a>
      {" | "}
      <a href="/show" class={currentUrl === "/show" ? "topsel" : ""}>
        show
      </a>
      {" | "}
      <a href="/ask" class={currentUrl === "/ask" ? "topsel" : ""}>
        ask
      </a>
      {" | "}
      <a href="/jobs" class={currentUrl === "/jobs" ? "topsel" : ""}>
        jobs
      </a>
      {" | "}
      <a href="/submit" class={currentUrl === "/submit" ? "topsel" : ""}>
        submit
      </a>
      {currentUrl === "/best" && (
        <>
          {" | "}
          <a href="/best" class="topsel">
            best
          </a>
        </>
      )}
    </span>
  ) : (
    <span class="pagetop">
      <b>{title}</b>
    </span>
  );
}
