import { FollowingUser } from "../types/follower";
import { getClipVideoUrl } from "../utils/fetchers";
import { LoadingSpinnerIcon } from "../assets/icons";
import { useRouter } from "next/router";
import { useState } from "react";
import ClipsGrid from "./clips-grid";
import Image from "next/future/image";
import ModalVideo from "./modal-video";
import useSWR from "swr";

type Props = {
  user: FollowingUser;
};

type TopFilter = "24h" | "7d" | "30d" | "all";

const getClips = (user_id: string, topFilter: TopFilter) => {
  let url = `/api/getClips?user_id=${user_id}&top=${topFilter}`;
  console.log("API fetch: getClips, ", url);
  return fetch(url).then((res) => res.json());
};

const UserSection = ({ user }: Props) => {
  const router = useRouter();

  const [isOpen, setIsOpen] = useState(false);
  const [clipId, setClipId] = useState<null | string>(null);
  const [topFilter, setTopFilter] = useState<TopFilter>("24h");

  const { data, error } = useSWR([user.id, topFilter], getClips);

  // @@@ videoSrcUrl is already fetched, keep it
  const { data: videoSrcUrl, isValidating } = useSWR(
    () => clipId,
    getClipVideoUrl
  );

  if (error) return <span>Clips An error has occurred.</span>;

  function openDialogHandler(clipId: string) {
    setClipId((value) => clipId);
    setIsOpen((value) => true);
  }

  function closeDialogHandler() {
    setClipId((value) => null);
    setIsOpen((value) => false);
  }

  const handleTopFilter = (range: TopFilter) => {
    if (router.query.top === range) return;
    setTopFilter((value) => range);
    router.replace(
      {
        query: { username: router.query.username, top: range },
      },
      undefined,
      { shallow: true }
    );
  };

  return (
    <>
      <a
        className="flex my-1 py-1 w-full overflow-auto items-center font-semibold text-3xl hover:underline underline-offset-8 decoration-wavy decoration-red-500"
        href={`https://twitch.tv/${user.login}`}
      >
        <Image
          src={user.profile_image_url}
          height={64}
          width={64}
          alt=""
          className="rounded-full mr-2"
        />
        <span>{user.display_name}</span>
      </a>
      <div className="my-2">
        <span className="text-gray-600">top:</span>
        <button
          className={`${
            topFilter === "24h" ? "bg-yellow-300" : "bg-white"
          } ml-3 py-1 px-3 rounded-lg shadow-sm border`}
          onClick={() => handleTopFilter("24h")}
        >
          24H
        </button>
        <button
          className={`${
            topFilter === "7d" ? "bg-yellow-300" : "bg-white"
          } ml-3 py-1 px-3 rounded-lg shadow-sm border`}
          onClick={() => handleTopFilter("7d")}
        >
          7d
        </button>
        <button
          className={`${
            topFilter === "30d" ? "bg-yellow-300" : "bg-white"
          } ml-3 py-1 px-3 rounded-lg shadow-sm border`}
          onClick={() => handleTopFilter("30d")}
        >
          30d
        </button>
        <button
          className={`${
            topFilter === "all" ? "bg-yellow-300" : "bg-white"
          } ml-3 py-1 px-3 rounded-lg shadow-sm border`}
          onClick={() => handleTopFilter("all")}
        >
          ALL
        </button>
      </div>
      {/* @@@ onlybans here */}
      <ClipsGrid clipsList={data} onClipClick={openDialogHandler} />
      {videoSrcUrl ? (
        <ModalVideo
          isOpen={isOpen}
          onClose={closeDialogHandler}
          videoSrcUrl={videoSrcUrl}
        />
      ) : isValidating ? (
        <div className="fixed inset-0 overflow-y-auto bg-black/80">
          <div className="flex min-h-full items-center justify-center p-1 text-center">
            <div className="h-10 w-10 absolute">
              <LoadingSpinnerIcon />
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
};

export default UserSection;
