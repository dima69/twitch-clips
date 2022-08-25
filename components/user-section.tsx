import { useState } from "react";
import useSWR from "swr";
import { IFollowingUser } from "../interfaces/follower";
import Image from "next/future/image";
import ModalVideo from "./modal-video";
import ClipsGrid from "./clips-grid";
import ClipsFilterDropdown from "./clips-filter-dropdown";
import { LoadingSpinnerIcon } from "../assets/icons";

type Props = {
  user: IFollowingUser;
};

const getClips = (user_id: string) => {
  console.log("getClips called");
  return fetch(`/api/getClips?user_id=${user_id}`).then((res) => res.json());
};

const UserSection = ({ user }: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const [clipId, setClipId] = useState<null | string>(null);
  const [selectedRange, setSelectedRange] = useState("24hr");

  const { data, error } = useSWR(user.id, getClips);

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
      {clipId ? (
        <ModalVideo
          isOpen={isOpen}
          onClose={closeDialogHandler}
          clipId={clipId}
        />
      ) : null}
    </>
  );
};

export default UserSection;
