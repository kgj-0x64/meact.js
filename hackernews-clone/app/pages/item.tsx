import { JSX } from "@meact/jsx-runtime";
import { useLoaderData } from "@meact-framework/client-runtime";
import type { StoryModel } from "../../server/models/index.js";
import { MainLayout } from "../layouts/main-layout.js";
import { ItemWithComments } from "app/components/item-with-comments.js";

export interface IItemPageLoader {
  newsItem: StoryModel;
}

export function ItemPage(): JSX.Element {
  const loaderData = useLoaderData<IItemPageLoader>();
  const newsItem = loaderData?.newsItem;

  if (newsItem === undefined) return <null />;

  return (
    <MainLayout>
      {newsItem === undefined ? (
        <null />
      ) : (
        <ItemWithComments newsItem={newsItem} />
      )}
    </MainLayout>
  );
}

export default ItemPage;
