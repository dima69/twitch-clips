import { LoadingSpinnerIcon } from "../assets/icons";
import { useRouter } from "next/router";
import UserSection from "../components/user-section";
import useSWR from "swr";
import { useEffect } from "react";

const getUserInfo = async (username: string) => {
  console.log("API fetch: getUserInfo [username] called");
  return fetch(`/api/getUserInfo?username=${username}`).then((res) =>
    res.json()
  );
};

const UserPage = () => {
  const router = useRouter();
  const { username, top } = router.query;

  useEffect(() => {
    if (username) {
      if (!top) {
        router.replace(
          {
            pathname: "/[username]",
            query: { username, top: "24h" },
          },
          undefined,
          { shallow: true }
        );
      }
    }
  }, [username, top, router]);

  const { data, error } = useSWR(username, getUserInfo);
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
