import { LoadingSpinnerIcon } from "../assets/icons";
import Image from "next/future/image";
import { IFollowingUser, IFollowingUsersListResponse } from "../interfaces/follower";

type Props = {
  isOpen: boolean;
  onUserClick(user: IFollowingUser): void;
  followingUsersListData: IFollowingUsersListResponse;
};

const SideBar = ({ isOpen, onUserClick, followingUsersListData }: Props) => {
  if (!followingUsersListData) {
    return (
      <nav className="hidden md:block md:w-11 h-full bg-gray-100">
        <div className="flex flex-col">
          <div className="flex my-1">
            <div className="px-1 py-1 w-full">
              <LoadingSpinnerIcon />
            </div>
          </div>
        </div>
      </nav>
    );
  }
  let sortedData = followingUsersListData.data.sort((a: IFollowingUser, b:IFollowingUser) => a.login.toLowerCase() > b.login.toLowerCase() ? 1 : -1);

  return (
    <nav
      className={
        isOpen
          ? "fixed md:static md:block z-50 md:max-w-max bg-gray-100 h-full overflow-y-auto no-scrollbar"
          : "hidden md:block md:w-11 h-full bg-gray-100 overflow-y-auto no-scrollbar"
      }
    >
      <div className="flex flex-col">
        {/* @@@ sort it */}
        {sortedData.map((user) => (
          <div key={user.id} className="flex my-1">
            <button
              className="hover:bg-yellow-300 px-1 py-1 w-full flex items-center"
              onClick={() => onUserClick(user)}
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
            </button>
          </div>
        ))}
      </div>
    </nav>
  );
};

export default SideBar;
