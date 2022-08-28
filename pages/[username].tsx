import { useRouter } from "next/router";
import useSWR from "swr";
import { LoadingSpinnerIcon } from "../assets/icons";
import UserSection from "../components/user-section";

const getUserInfo = async (username: string) => {
  return fetch(`/api/getUserInfo?username=${username}`).then((res) =>
    res.json()
  );
};

const UserPage = () => {
  const router = useRouter();
  const { data, error } = useSWR(router.query.username, getUserInfo);
  if (!data)
    return (
      <div className="h-6 w-6">
        <LoadingSpinnerIcon />
      </div>
    );
  if (error) return console.log(error);
  console.log("data", data.data[0].id);

  return (
    <div className="px-2">
      <UserSection user={data.data[0]} />
    </div>
  );
};

export default UserPage;
