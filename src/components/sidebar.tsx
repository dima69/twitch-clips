import { FollowingUsersResponse } from "../types/follower";
import { useRouter } from "next/router";
import { useState } from "react";
import AuthForm from "./auth-form";
import Image from "next/future/image";
import Link from "next/link";

type Props = {
  isOpen: boolean;
  followingUsersListData: FollowingUsersResponse;
};

type SortVariations = "asc" | "desc";

const SideBar = ({ isOpen, followingUsersListData }: Props) => {
  const router = useRouter();
  const [sort, setSort] = useState<SortVariations>("asc");

  if (!followingUsersListData.data.length)
    return (
      <nav
        className={
          isOpen
            ? "fixed md:static md:block z-50 md:max-w-max bg-gray-100 h-full overflow-y-auto no-scrollbar"
            : "hidden overflow-y-auto no-scrollbar"
        }
      >
        <div className="flex flex-col">
          <AuthForm />
        </div>
      </nav>
    );

  function handleSort(sort: SortVariations) {
    setSort((value) => sort);
  }

  let sortedData;
  if (sort === "asc") {
    sortedData = followingUsersListData.data.sort((a, b) =>
      a.login.toLowerCase() > b.login.toLowerCase() ? 1 : -1
    );
  } else {
    sortedData = followingUsersListData.data.sort((a, b) =>
      a.login.toLowerCase() > b.login.toLowerCase() ? -1 : 1
    );
  }

  return (
    <nav
      className={
        isOpen
          ? "fixed md:static md:block z-50 md:max-w-max bg-gray-100 h-full overflow-y-auto no-scrollbar"
          : "hidden md:block md:w-11 h-full bg-gray-100 overflow-y-auto no-scrollbar"
      }
    >
      <div className="flex flex-col">
        <div className="flex my-1 px-1">
          {isOpen ? (
            <div>
              <span className="text-sm text-gray-600">sort by:</span>
              <button
                className={`${
                  sort === "asc" ? "bg-yellow-300" : "bg-white"
                } ml-3 py-1 px-3 rounded-lg shadow-sm`}
                onClick={() => handleSort("asc")}
              >
                asc
              </button>
              <button
                className={`${
                  sort === "desc" ? "bg-yellow-300" : "bg-white"
                } ml-3 py-1 px-3 rounded-lg shadow-sm`}
                onClick={() => handleSort("desc")}
              >
                desc
              </button>
            </div>
          ) : (
            <div className="bg-white py-1 h-8"></div>
          )}
        </div>
        {sortedData.map((user) => (
          <div key={user.id} className="flex my-1">
            <Link href={user.login}>
              {/* @@@ ugly */}
              <a
                className={
                  router.query.username === user.login
                    ? "bg-yellow-300 px-1 py-1 w-full flex items-center"
                    : "hover:bg-yellow-300 px-1 py-1 w-full flex items-center"
                }
              >
                <Image
                  src={user.profile_image_url}
                  height={36}
                  width={36}
                  className="rounded-full"
                  alt=""
                />
                <span className={isOpen ? "ml-2" : "hidden"}>
                  {user.display_name}
                </span>
              </a>
            </Link>
          </div>
        ))}
      </div>
    </nav>
  );
};

export default SideBar;
