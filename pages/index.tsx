import type { NextPage } from "next";
import { useState, useEffect } from "react";
import Image from "next/future/image";
import useSWR from "swr";
import {
  PeopleIcon,
  CloseIcon,
  SearchIcon,
  LoadingSpinnerIcon,
} from "../assets/icons";

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

const UserClips = ({ user_id }: { user_id: string }) => {
  const { data, error } = useSWR(user_id, getClips);

  if (error) return <span>Clips An error has occurred.</span>;
  if (!data) return <span>Clips Loading...</span>;

  if (!data.data.length) {
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

  const something = data.data.map((clip: IClip) => (
    <div key={clip.id}>
      <div className="relative ">
        <div className="absolute bg-yellow-300 w-full h-full -z-10"></div>
        {/* disable translate on mobile */}
        <div className="md:hover:-translate-y-2 md:hover:translate-x-2 transition-all">
          <Image
            src={clip.thumbnail_url}
            alt=""
            width={480}
            height={272}
            style={{width: '100%', height: 'auto'}}
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
          className="text-sm text-slate-500 hover:underline underline-offset-2 decoration-wavy w-max decoration-red-500 hover:text-black"
          href={`https://twitch.tv/${clip.creator_name}`}
        >
          Clipped by {clip.creator_name}
        </a>
      </div>
    </div>
  ));

  // const something2 = data.data.map(
  //   (clip: { id: string; embed_url: string }) => (
  //     <iframe
  //       key={clip.id}
  //       src={`${clip.embed_url}&parent=localhost`}
  //       frameBorder="0"
  //       width={720}
  //       height={500}
  //       // preload="metadata"
  //     ></iframe>
  //   )
  // );

  return <div className="grid grid-cols-custom_300_1fr gap-5">{something}</div>;
};

const UserCard = ({ user }: { user: IUserFollow }) => {
  return (
    <>
      <a
        className="flex my-1  py-1 w-full overflow-auto items-center font-semibold text-3xl hover:underline underline-offset-8 decoration-wavy decoration-red-500"
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
      <UserClips user_id={user.id} />
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

const SideBar = ({
  isOpened,
  onUserClick,
}: {
  isOpened: boolean;
  onUserClick: any;
}) => {
  // @@@
  const { data, error } = useSWR("467997239", getUserFollows);
  if (error) return <span>An error has occurred.</span>;
  if (!data)
    return (
      <nav
        className={
          isOpened
            ? "fixed md:static md:block z-50 md:max-w-max bg-gray-100 h-full"
            : "hidden md:block md:w-11 h-full bg-gray-100"
        }
      >
        <div className="flex flex-col">
          <div className="flex my-1">
            <div className="px-1 py-1 w-full">
              <LoadingSpinnerIcon />
            </div>
          </div>
        </div>
      </nav>
    );

  return (
    <nav
      className={
        isOpened
          ? "fixed md:static md:block z-50 md:max-w-max bg-gray-100 h-full"
          : "hidden md:block md:w-11 h-full bg-gray-100"
      }
    >
      <div className="flex flex-col">
        {/* @@@ sort it */}
        {data.map((user: UsersFollows) => (
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
  const [isSidebarOpened, setIsSidebarOpened] = useState<boolean>(false);
  const [selectedUserId, setSelectedUserId] = useState<IUserFollow>();

  const sideMenuOpenCloseButtonHandler = () => {
    setIsSidebarOpened((value) => !value);
  };

  return (
    <div className="flex flex-col">
      <header className="flex sticky top-0 p-2 z-20 bg-gray-200 w-full h-12">
        <div className="flex w-full justify-between">
          <div className="flex">
            <button
              onClick={sideMenuOpenCloseButtonHandler}
              title="FOLLOWED CHANNELS"
              // @@@ disable hover on mobile devices md:hover:bg-yellow-400
              className="flex items-center rounded px-1 mr-2 text-center bg-yellow-300 hover:bg-yellow-400"
            >
              {isSidebarOpened ? <CloseIcon /> : <PeopleIcon />}
            </button>
          </div>
          {/* search */}
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
          {/* twitch auth button */}
          <div></div>
        </div>
      </header>
      {/* ESC key close event */}
      {/* transition css */}
      <div className="flex h-[calc(100vh-3rem)]">
        <SideBar isOpened={isSidebarOpened} onUserClick={setSelectedUserId} />

        <main className="flex flex-col flex-1 overflow-auto px-2">
          {selectedUserId ? (
            <div key={selectedUserId.id} className="mb-2">
              <UserCard user={selectedUserId} />
            </div>
          ) : (
            <div>@@@ grid with user follows</div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Home;
