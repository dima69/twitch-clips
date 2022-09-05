import { FollowingUsersResponse } from "../types/follower";
import Image from "next/future/image";
import Link from "next/link";

type Props = {
  followingUsersListData: FollowingUsersResponse;
};

const UsersGrid = ({ followingUsersListData }: Props) => {
  const { data } = followingUsersListData;
  let sortedData = data.sort((a, b) =>
    a.login.toLowerCase() > b.login.toLowerCase() ? 1 : -1
  );

  const something = sortedData.map((user) => (
    <Link href={`/${user.login}`} key={user.id}>
      <a className="flex items-center p-2 hover:ring-2 ring-yellow-300 w-max border bg-white rounded-lg m-1">
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
      </a>
    </Link>
  ));
  return <div className="flex flex-row flex-wrap">{something}</div>;
};

export default UsersGrid;
