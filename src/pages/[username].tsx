import { LoadingSpinnerIcon } from "../assets/icons";
import { useRouter } from "next/router";
import UserSection from "../components/user-section";
import useSWR from "swr";
import useUserStore from "../store/store";

const getUserInfo = async (username: string) => {
  console.log('getUserInfo [username]')
  return fetch(`/api/getUserInfo?username=${username}`).then((res) =>
    res.json()
  );
};

const UserPage = () => {
  // @@@ use effect check if data in zustand else useRouter

  const router = useRouter();
  const { data, error } = useSWR(router.query.username, getUserInfo);
  if (!data)
    return (
      <div className="h-6 w-6">
        <LoadingSpinnerIcon />
      </div>
    );
  if (error) return console.log(error);

  return (
    <div className="px-2">
      <UserSection user={data.data[0]} />
    </div>
  );
};

export default UserPage;
