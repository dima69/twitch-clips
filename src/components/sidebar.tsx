import { FollowingUser, FollowingUsersResponse } from "../types/follower";
import { LoadingSpinnerIcon } from "../assets/icons";
import { useEffect } from "react";
import { useRouter } from "next/router";
import Image from "next/future/image";
import Link from "next/link";

type Props = {
  isOpen: boolean;
  onUserClick(user: FollowingUser): void;
  followingUsersListData: FollowingUsersResponse;
};

const SideBar = ({ isOpen, onUserClick, followingUsersListData }: Props) => {
  // @@@ if !auth return null or ask for auth
  const router = useRouter();

  // @@@ add users to sidebar from search menu, to/from cookies also

  if (!followingUsersListData) {
    // @@@ get from 
    console.log("daaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa loading spinner sidebar")
    return <></>;
  }
  let sortedData = followingUsersListData.data.sort((a, b) =>
    a.login.toLowerCase() > b.login.toLowerCase() ? 1 : -1
  );

  return (
    <nav
      className={
        isOpen
          ? "fixed md:static md:block z-50 md:max-w-max bg-gray-100 h-full overflow-y-auto no-scrollbar"
          : "hidden md:block md:w-11 h-full bg-gray-100 overflow-y-auto no-scrollbar"
      }
    >
      <div className="flex flex-col">
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
