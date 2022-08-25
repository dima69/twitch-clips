import {
  PeopleIcon,
  CloseIcon,
  SearchIcon,
  LoadingSpinnerIcon,
} from "../assets/icons";
import { IFollowingUser } from "../interfaces/follower";
import { useState } from "react";
import SideBar from "../components/sidebar";
import type { NextPage } from "next";
import UserSection from "../components/user-section";
import UsersGrid from "../components/home-users-grid";
import useSWR from "swr";

const getUserFollows = async (user_id: string) => {
  return fetch(`/api/getUserFollows?user_id=${user_id}`).then((res) =>
    res.json()
  );
};

const Home: NextPage = () => {
  const { data, error } = useSWR("467997239", getUserFollows);
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const [selectedUserId, setSelectedUserId] = useState<IFollowingUser>();

  const sideMenuOpenCloseButtonHandler = () => {
    setIsSidebarOpen((value) => !value);
  };

  const onUserClickHandler = (user: IFollowingUser) => {
    setSelectedUserId((value) => user);
  };

  if (error) return <span>{error}</span>;

  return (
    <div className="flex flex-col">
      <header className="flex sticky top-0 p-2 z-20 bg-gray-200 w-full h-12">
        <div className="flex w-full justify-between">
          <div className="flex">
            <button
              onClick={sideMenuOpenCloseButtonHandler}
              title="FOLLOWED CHANNELS"
              className="flex items-center rounded px-1 w-8 h-8 mr-2 text-center bg-yellow-300 md:hover:bg-yellow-400"
            >
              {isSidebarOpen ? <CloseIcon /> : <PeopleIcon />}
            </button>
          </div>
          {/* @@@ search */}
          <div className="flex w-96">
            <input
              type="text"
              placeholder="Username, clip name, author.."
              className="w-full rounded-r-none rounded pl-2 py-1 bg-gray-100 hover:border-gray-300 border hover:shadow border-transparent"
            />
            <button className="flex items-center rounded w-8 rounded-l-none border-l-0 text-center bg-yellow-300 hover:bg-yellow-400">
              <SearchIcon />
            </button>
          </div>
          {/* @@@ twitch auth button */}
          <div></div>
        </div>
      </header>
      {/* ESC key close event */}
      {/* transition css */}
      <div className="flex h-[calc(100vh-3rem)]">
        <SideBar
          isOpen={isSidebarOpen}
          onUserClick={onUserClickHandler}
          followingUsersListData={data}
        />

        <main className="flex flex-col flex-1 overflow-auto px-2">
          {selectedUserId ? (
            <div key={selectedUserId.id} className="mb-2">
              <UserSection user={selectedUserId} />
            </div>
          ) : (
            <UsersGrid
              followingUsersListData={data}
              onClick={setSelectedUserId}
            />
          )}
        </main>
      </div>
    </div>
  );
};

export default Home;
