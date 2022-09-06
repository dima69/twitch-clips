import { useEffect } from "react";
import type { NextPage } from "next";
import UsersGrid from "../components/home-users-grid";
import useUserStore from "../store/store";
import AuthForm from "../components/auth-form";

const Home: NextPage = () => {
  const userFollowsData = useUserStore((state) => state.userFollowsData);

  if (userFollowsData.data.length) {
    return <UsersGrid followingUsersListData={userFollowsData} />;
  }
  return <AuthForm />;
};

export default Home;
