import { useLoaderData } from "@meact-framework/client-runtime";
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

  return (
    <MainLayout>
      {comments ? (
        <Comments comments={comments} shouldIndent={false} />
      ) : (
        <null />
      )}
    </MainLayout>
  );
}

export default NewCommentsPage;
