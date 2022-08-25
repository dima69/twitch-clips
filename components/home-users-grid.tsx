import Image from "next/future/image";
import { LoadingSpinnerIcon } from "../assets/icons";
import {
  IFollowingUser,
  IFollowingUsersListResponse,
} from "../interfaces/follower";

type Props = {
  followingUsersListData: IFollowingUsersListResponse;
  onClick: (user: IFollowingUser) => void;
};

const UsersGrid = ({ followingUsersListData, onClick }: Props) => {
  if (!followingUsersListData) {
    console.log("data is not yet ready");
    return <div className="grid place-items-center h-full"><div className="w-8 h-8"><LoadingSpinnerIcon /></div></div>
  }
  const { data } = followingUsersListData;
  let sortedData = data.sort((a: IFollowingUser, b:IFollowingUser) => a.login.toLowerCase() > b.login.toLowerCase() ? 1 : -1);

  const something = sortedData.map((user: IFollowingUser) => (
    <button
      key={user.id}
      className="flex items-center p-2 hover:ring-2 ring-yellow-300 rounded"
      onClick={() => onClick(user)}
    >
      <Image
        src={user.profile_image_url}
        height={46}
        width={46}
        className="rounded-full"
        alt=""
      />
      <span className="font-medium ml-4 text-lg truncate">
        {user.display_name}
      </span>
    </button>
  ));
  return <div className="flex flex-col">{something}</div>;
};

export default UsersGrid;
