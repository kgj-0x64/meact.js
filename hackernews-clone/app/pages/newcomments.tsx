import { useLoaderData } from "@meact-framework/client";
import { JSX } from "@meact/jsx-runtime";
import { MainLayout } from "../layouts/main-layout.js";
import { Comments } from "../components/comments.js";
import { IComment } from "../../server/responses/index.js";

export interface INewCommentsPageLoader {
  comments: IComment[];
}

export function NewCommentsPage(): JSX.Element {
  const loaderData = useLoaderData<INewCommentsPageLoader>();
  const comments = loaderData?.comments;

  if (comments === undefined) return <null />;

  return (
    <MainLayout>
      <Comments comments={comments} shouldIndent={false} />
    </MainLayout>
  );
}

export default NewCommentsPage;
