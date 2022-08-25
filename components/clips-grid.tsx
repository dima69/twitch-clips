import Image from "next/future/image";
import { LoadingSpinnerIcon } from "../assets/icons";
import { IClip, IClipsListResponse } from "../interfaces/clip";

type Props = {
  clipsList: IClipsListResponse;
  onClipClick: (clip: IClip["id"]) => void;
};

const ClipsGrid = ({ clipsList, onClipClick }: Props) => {
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

export default ClipsGrid;
