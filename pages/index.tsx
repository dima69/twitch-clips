import type { NextPage } from "next";
import { useState } from "react";
import Image from "next/future/image";
import useSWR from "swr";
import {
  PeopleIcon,
  CloseIcon,
  SearchIcon,
  LoadingSpinnerIcon,
} from "../assets/icons";
import { Dialog } from "@headlessui/react";

const getClips = (user_id: string) => {
  console.log("getClips called");
  return fetch(`/api/getClips?user_id=${user_id}`).then((res) => res.json());
};

const getUserFollows = async (user_id: string) => {
  console.log("getUserFollows called");
  return fetch(`/api/getUserFollows?user_id=${user_id}`).then((res) =>
    res.json()
  );
};

const Home: NextPage = () => {
  const { data, error } = useSWR("467997239", getUserFollows);
  const [isSidebarOpened, setIsSidebarOpened] = useState<boolean>(false);
  const [selectedUserId, setSelectedUserId] = useState<IUserFollow>();

  const sideMenuOpenCloseButtonHandler = () => {
    setIsSidebarOpened((value) => !value);
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
              {isSidebarOpened ? <CloseIcon /> : <PeopleIcon />}
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
          isOpened={isSidebarOpened}
          onUserClick={setSelectedUserId}
          userFollowsListData={data}
        />

        <main className="flex flex-col flex-1 overflow-auto px-2">
          {selectedUserId ? (
            <div key={selectedUserId.id} className="mb-2">
              <UserCard user={selectedUserId} />
            </div>
          ) : (
            <div className="mx-auto">
              {data ? (
                <UsersGrid
                  userFollowsListData={data}
                  onClick={setSelectedUserId}
                />
              ) : (
                // @@@
                <LoadingSpinnerIcon />
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Home;
