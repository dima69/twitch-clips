import { FollowingUser, FollowingUsersResponse } from "../types/follower";
import { LoadingSpinnerIcon } from "../assets/icons";
import { ChangeEvent, useEffect, useState } from "react";
import { useRouter } from "next/router";
import useSWR from "swr";
import useUserStore from "../store/store";
import { getUserFollows, getUserInfo } from "../utils/fetchers";

type Props = {
  isOpen: boolean;
};

const SideBarLogin = ({ isOpen }: Props) => {
  // @@@ if !auth return null or ask for auth
  const router = useRouter();

  const [targetUsername, setTargetUsername] = useState("dima_dima69");
  const setUsername = useUserStore((state) => state.setUsername);
  const username = useUserStore((state) => state.username);
  const setUserFollowsData = useUserStore((state) => state.setUserFollowsData);

  // @@@ add users to sidebar from search menu, to/from cookies also

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

  const hanleTargetUsernameChange = (e: ChangeEvent<HTMLInputElement>) => {
    // @@@ ??? why
    if (e.currentTarget.value.length <= 25) {
      setTargetUsername(e.currentTarget.value);
    }
  };

  function handleGo() {
    console.log("handle go called");
    console.log("targetUsername", targetUsername);
    console.log("userFollows", userFollows);
    setUsername(targetUsername);
  }

  return (
    <nav
      className={
        isOpen
          ? "fixed md:static md:block z-50 md:max-w-max bg-gray-100 h-full overflow-y-auto no-scrollbar"
          : "hidden overflow-y-auto no-scrollbar"
      }
    >
      <div className="flex flex-col">
        <div className="grid place-content-center h-full m-4">
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
      </div>
    </nav>
  );
};

export default SideBarLogin;
