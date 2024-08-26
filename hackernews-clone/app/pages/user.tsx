import { useLoaderData } from "@meact-framework/client-runtime";
import { JSX } from "@meact/jsx-runtime";
import { MainLayout } from "../layouts/main-layout.js";
import { UserProfile } from "../components/user-profile.jsx";

export interface IUserPageLoader {
  user: {
    id: string;
    about: string;
    creationTime: number;
    email: string;
    karma: number;
  };
}

function UserPage(): JSX.Element {
  const loaderData = useLoaderData<IUserPageLoader>();

  return (
    <MainLayout isFooterVisible={false}>
      <UserProfile loaderData={loaderData} />
    </MainLayout>
  );
}

export default UserPage;
