import type { NextPage } from "next";
import { useState } from "react";
import Image from "next/future/image";
import useSWR from "swr";
import {
  PeopleIcon,
  CloseIcon,
  SearchIcon,
  LoadingSpinnerIcon,
} from "../assets/icons";
import { Dialog } from "@headlessui/react";

const getClips = (user_id: string) => {
  console.log("getClips called");
  return fetch(`/api/getClips?user_id=${user_id}`).then((res) => res.json());
};

const getUserFollows = async (user_id: string) => {
  console.log("getUserFollows called");
  return fetch(`/api/getUserFollows?user_id=${user_id}`).then((res) =>
    res.json()
  );
};

interface IClip {
  id: string;
  url: string;
  embed_url: string;
  broadcaster_id: string;
  broadcaster_name: string;
  creator_id: string;
  creator_name: string;
  video_id: string;
  game_id: string;
  language: string;
  title: string;
  view_count: number;
  created_at: string;
  thumbnail_url: string;
  duration: number;
  vod_offset: null;
}

interface IClipsListResponse {
  data: IClip[];
}

const getClipVideoUrl = async (clipId: string) => {
  const myHeaders = new Headers();
  myHeaders.append("Client-Id", "kimne78kx3ncx6brgo4mv6wki5h1ko");
  myHeaders.append("Content-Type", "application/json");

  const graphql = JSON.stringify({
    query: `
      query ClipPlayer_Query(
      $slug: ID!
      $playerType: String!
      $platform: String!
      $skipPlayToken: Boolean!
    ) {
      ...ClipPlayer_token
    }
    
    fragment ClipPlayer_token on Query {
      clip(slug: $slug) {
        slug
        playbackAccessToken(params: {platform: $platform, playerType: $playerType}) @skip(if: $skipPlayToken) {
          signature
          value
          expiresAt
          authorization {
            isForbidden
            forbiddenReasonCode
          }
        }
        videoQualities {
          sourceURL
          frameRate
          quality
        }
        id
        __typename
      }
    }`,
    variables: {
      slug: clipId,
      platform: "web",
      playerType: "pulsar",
      skipPlayToken: false,
    },
  });

  const request = await fetch("https://gql.twitch.tv/gql", {
    method: "POST",
    headers: myHeaders,
    body: graphql,
    redirect: "follow",
  });
  const response = await request.json();

  const sig = response.data.clip.playbackAccessToken.signature;
  const videoUrl =
    response.data.clip.videoQualities[0].quality === "1080"
      ? response.data.clip.videoQualities[1].sourceURL
      : response.data.clip.videoQualities[0].sourceURL;
  const token_raw = response.data.clip.playbackAccessToken.value;
  const url = `${videoUrl}?token=${encodeURIComponent(token_raw)}&sig=${sig}`;
  return url;
};

const CleanDialogVideo = ({ isOpen, closeDialogHandler, videoSrcUrl }) => {
  return (
    <Dialog open={isOpen} className="z-10" onClose={closeDialogHandler}>
      <div className="fixed inset-0 overflow-y-auto bg-black/80">
        <div className="flex min-h-full items-center justify-center p-4 text-center">
          <Dialog.Panel className="overflow-hidden bg-white p-0.5">
            <div>
              {videoSrcUrl ? (
                <video src={videoSrcUrl} playsInline controls>
                  {"Sorry, your browser doesn't support embedded videos."}
                </video>
              ) : (
                <div className="h-10 w-10 ">
                  <LoadingSpinnerIcon />
                </div>
                // <video src="" playsInline controls></video>
              )}
            </div>
          </Dialog.Panel>
        </div>
      </div>
    </Dialog>
  );
};

const UserClips = ({
  clipsList,
  onClipClick,
}: {
  clipsList: IClipsListResponse;
  onClipClick: Function;
}) => {
  // @@@ loading state
  if (!clipsList)
    return (
      <div className="grid place-content-center h-full text-xl font-medium text-black">
        <div className="h-10 w-10">
          <LoadingSpinnerIcon />
        </div>
      </div>
    );
  if (!clipsList.data.length) {
    return (
      <span className="grid place-content-center h-full text-xl font-medium">
        Empty, no clips
      </span>
    );
  }

  function secondsToTime(total_seconds: number) {
    const min = Math.floor(total_seconds / 60);
    const seconds = Math.floor(total_seconds) % 60;
    return `${min.toString()}:${seconds.toString().padStart(2, "0")}`;
  }

  function timeToHMS(time: string) {
    return new Date(time).toLocaleDateString();
  }

  const something = clipsList.data.map((clip: IClip) => (
    <div key={clip.id}>
      <div className="relative ">
        <div className="absolute bg-yellow-300 w-full h-full -z-10"></div>
        <div className="md:hover:-translate-y-1.5 md:hover:translate-x-1.5 transition-all">
          <Image
            src={clip.thumbnail_url}
            alt=""
            width={480}
            height={272}
            style={{ width: "100%", height: "auto" }}
            onClick={() => onClipClick(clip.id)}
          />
          <div className="absolute top-0 left-0 m-2 bg-black text-white px-1 py-0.5 text-sm rounded">
            {secondsToTime(clip.duration)}
          </div>
          <div className="absolute bottom-0 left-0 m-2 bg-black text-white px-1 py-0.5 text-sm rounded">
            {clip.view_count === 1
              ? `${clip.view_count} view`
              : `${clip.view_count} views`}
          </div>
          <div className="absolute bottom-0 right-0 m-2 bg-black text-white px-1 py-0.5 text-sm rounded">
            {timeToHMS(clip.created_at)}
          </div>
        </div>
      </div>

      <div className="flex flex-col">
        <span className="font-semibold">{clip.title}</span>
        <a
          className="text-sm text-slate-500 hover:underline underline-offset-4 decoration-wavy w-max decoration-red-500 hover:text-black"
          href={`https://twitch.tv/${clip.creator_name}`}
        >
          Clipped by {clip.creator_name}
        </a>
      </div>
    </div>
  ));
  return <div className="grid grid-cols-custom_300_1fr gap-5">{something}</div>;
};

const UserCard = ({ user }: { user: IUserFollow }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [clipId, setClipId] = useState("");

  const { data, error } = useSWR(user.id, getClips);
  const { data: videoSrcUrl } = useSWR(() => clipId, getClipVideoUrl);
  // const { data: videoSrcUrl } = useSWR(clipId ? clipId : null, getClipVideoUrl)

  if (error) return <span>Clips An error has occurred.</span>;

  function openDialogHandler(clipId: string) {
    setClipId((value) => clipId);
    setIsOpen((value) => true);
  }

  function closeDialogHandler() {
    setClipId((value) => "");
    setIsOpen((value) => false);
  }

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
      {/* @@@ onlybans here */}
      <UserClips clipsList={data} onClipClick={openDialogHandler} />
      <CleanDialogVideo
        isOpen={isOpen}
        closeDialogHandler={closeDialogHandler}
        videoSrcUrl={videoSrcUrl}
      />
    </>
  );
};

// @@@ rename it
interface IUserFollow {
  id: string;
  login: string;
  display_name: string;
  type: string;
  broadcaster_type: string;
  description: string;
  profile_image_url: string;
  offline_image_url: string;
  view_count: string;
  created_at: string;
}

interface IUserFollowsListResponse {
  data: IUserFollow[];
}

const SideBar = ({
  isOpened,
  onUserClick,
  userFollowsListData,
}: {
  isOpened: boolean;
  onUserClick: Function;
  userFollowsListData: IUserFollowsListResponse;
}) => {
  if (!userFollowsListData) {
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
  // @@@ handle it properly
  // if (usersFollowsList.error) return <span>An error has occurred.</span>;

  return (
    <nav
      className={
        isOpened
          ? "fixed md:static md:block z-50 md:max-w-max bg-gray-100 h-full overflow-y-auto no-scrollbar"
          : "hidden md:block md:w-11 h-full bg-gray-100 overflow-y-auto no-scrollbar"
      }
    >
      <div className="flex flex-col">
        {/* @@@ sort it */}
        {userFollowsListData.data.map((user) => (
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
              <span className={isOpened ? "ml-2" : "hidden"}>
                {user.display_name}
              </span>
            </button>
          </div>
        ))}
      </div>
    </nav>
  );
};

const Home: NextPage = () => {
  const { data, error } = useSWR("467997239", getUserFollows);
  const [isSidebarOpened, setIsSidebarOpened] = useState<boolean>(false);
  const [selectedUserId, setSelectedUserId] = useState<IUserFollow>();

  const sideMenuOpenCloseButtonHandler = () => {
    setIsSidebarOpened((value) => !value);
  };

  if (error) return <span>{error}</span>;

  return (
    <div className="flex flex-col">
      <header className="flex sticky top-0 p-2 z-20 bg-gray-200 w-full h-12">
        <div className="flex w-full justify-between">
          <div className="flex">
            <button
              onClick={sideMenuOpenCloseButtonHandler}
              title="FOLLOWED CHANNELS"
              className="flex items-center rounded px-1 w-8 h-8 mr-2 text-center bg-yellow-300 md:hover:bg-yellow-400"
            >
              {isSidebarOpened ? <CloseIcon /> : <PeopleIcon />}
            </button>
          </div>
          {/* @@@ search */}
          <div className="flex w-96">
            <input
              type="text"
              placeholder="Username, clip name, author.."
              className="w-full rounded-r-none rounded pl-2 py-1 bg-gray-100 hover:border-gray-300 border hover:shadow border-transparent"
            />
            <button className="flex items-center rounded w-8 rounded-l-none border-l-0 text-center bg-yellow-300 hover:bg-yellow-400">
              <SearchIcon />
            </button>
          </div>
          {/* @@@ twitch auth button */}
          <div></div>
        </div>
      </header>
      {/* ESC key close event */}
      {/* transition css */}
      <div className="flex h-[calc(100vh-3rem)]">
        <SideBar
          isOpened={isSidebarOpened}
          onUserClick={setSelectedUserId}
          userFollowsListData={data}
        />

        <main className="flex flex-col flex-1 overflow-auto px-2">
          {selectedUserId ? (
            <div key={selectedUserId.id} className="mb-2">
              <UserCard user={selectedUserId} />
            </div>
          ) : (
            <div className="mx-auto">
              {data ? (
                <UsersGrid
                  userFollowsListData={data}
                  onClick={setSelectedUserId}
                />
              ) : (
                // @@@
                <LoadingSpinnerIcon />
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

const UsersGrid = ({
  userFollowsListData,
  onClick,
}: {
  userFollowsListData: IUserFollowsListResponse;
  onClick: Function;
}) => {
  const { data } = userFollowsListData;
  const something = data.map((user: IUserFollow) => (
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

export default Home;
