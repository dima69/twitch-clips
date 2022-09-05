import { FollowingUser } from "../types/follower";
import { getClipVideoUrl } from "../utils/fetchers";
import { LoadingSpinnerIcon } from "../assets/icons";
import { useState } from "react";
import ClipsFilterDropdown from "./clips-filter-dropdown";
import ClipsGrid from "./clips-grid";
import Image from "next/future/image";
import ModalVideo from "./modal-video";
import useSWR from "swr";

type Props = {
  user: FollowingUser;
};

const getClips = (user_id: string) => {
  console.log("getClips called user-section");
  return fetch(`/api/getClips?user_id=${user_id}`).then((res) => res.json());
};

const UserSection = ({ user }: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const [clipId, setClipId] = useState<null | string>(null);
  const [selectedRange, setSelectedRange] = useState("24hr");

  const { data, error } = useSWR(user.id, getClips);

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

  const handleSelectedRange = (range: string) => {
    setSelectedRange((value) => range);
    console.log("selected range is: ", selectedRange);
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
      <ClipsFilterDropdown
        menuActiveElement={"30D"}
        selectedRange={handleSelectedRange}
      />
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
