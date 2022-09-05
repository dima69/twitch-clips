import { ChangeEvent, useEffect, useState } from "react";
import { LoadingSpinnerIcon } from "../assets/icons";
import type { NextPage } from "next";
import UsersGrid from "../components/home-users-grid";
import useSWR from "swr";
import useUserStore from "../store/store";
import { getUserFollows, getUserInfo } from "../utils/fetchers";


const Home: NextPage = () => {
  const [targetUsername, setTargetUsername] = useState("dima_dima69");
  const isAuth = useUserStore((state) => state.isAuth);
  const toggleIsAuth = useUserStore((state) => state.toggleIsAuth);
  const setUsername = useUserStore((state) => state.setUsername);
  const username = useUserStore((state) => state.username);
  const setUserFollowsData = useUserStore((state) => state.setUserFollowsData);
  const {
    data: userInfo,
    error: userInfoError,
    isValidating: userInfoValidating,
  } = useSWR(() => username, getUserInfo);
  const {
    data: userFollows,
    error: userFollowsError,
    isValidating: userFollowsValidating,
  } = useSWR(() => userInfo.data[0].id, getUserFollows);

  useEffect(() => {
    if (userFollows) {
      setUserFollowsData(userFollows);
    }
  }, [setUserFollowsData, userFollows]);

  if (userInfoError) return <span>{userInfoError}</span>;

  const hanleTargetUsernameChange = (e: ChangeEvent<HTMLInputElement>) => {
    // @@@ ??? why
    if (e.currentTarget.value.length <= 25) {
      setTargetUsername(e.currentTarget.value);
    }
  };

  function handleGo() {
    setUsername(targetUsername);
    toggleIsAuth();
  }

  if (!isAuth || userFollowsValidating || !userFollows || userInfoValidating)
    return (
      <div className="grid place-content-center h-full">
        <div className="flex flex-col items-center">
          <button
            className="bg-purple-500 text-white rounded-lg py-3 px-4 max-w-max disabled:bg-gray-300"
            disabled={userInfoValidating || userFollowsValidating}
          >
            Auth with Twitch
          </button>
        </div>
        <span className="text-center my-6">
          OR input your username to get your follows:
        </span>
        <div className="flex relative">
          <input
            type="text"
            className="border p-2 rounded-lg w-full"
            placeholder="username"
            maxLength={25}
            value={targetUsername}
            onChange={(e) => hanleTargetUsernameChange(e)}
            disabled={userInfoValidating || userFollowsValidating}
          />
          {targetUsername.length >= 4 ? (
            <button
              disabled={userInfoValidating || userFollowsValidating}
              className="text-yellow-400 rounded-lg absolute right-0 h-full px-4 hover:text-yellow-500"
              onClick={handleGo}
            >
              {userInfoValidating || userFollowsValidating ? (
                <div className="w-5 h-5">
                  <LoadingSpinnerIcon />
                </div>
              ) : (
                "go"
              )}
            </button>
          ) : (
            targetUsername.length >= 1 && (
              <button
                disabled
                className="text-gray-400 absolute right-0 h-full px-4"
              >
                {Math.abs(targetUsername.length - 4)}
              </button>
            )
          )}
        </div>
      </div>
    );

  return <UsersGrid followingUsersListData={userFollows} />;
};

export default Home;
