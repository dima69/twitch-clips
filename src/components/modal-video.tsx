import { Dialog } from "@headlessui/react";
import { SyntheticEvent, useEffect, useLayoutEffect, useRef } from "react";
import useUserStore from "../store/store";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  videoSrcUrl: string;
};

const ModalVideo = ({ isOpen, onClose, videoSrcUrl }: Props) => {
  const globalVolume = useUserStore((state) => state.globalVolume);
  const setGlobalVolume = useUserStore((state) => state.setGlobalVolume);
  const videoMuted = useUserStore((state) => state.videoMuted);
  const setVideoMuted = useUserStore((state) => state.setVideoMuted);

  const videoRef = useRef<HTMLVideoElement>(null);
  // if (videoRef.current != undefined) {
  //   videoRef.current.volume = 0.1;
  // }

  // useEffect(() => {
  //   videoRef.current.volume = 0.1;
  //   if (videoRef.current) {
  //     console.log("current", videoRef.current);
  //   }
  //   console.log(videoRef);
  // });

  // useEffect(() => {
  //   videoRef.current!.volume = globalVolume;
  // }, [globalVolume]);

  // useEffect(() => {
  //   videoRef.current!.volume = globalVolume;
  // });

  function onVolumeChangeHandler(e: SyntheticEvent<HTMLVideoElement>) {
    console.log("onVolumeChangeHandler called");
    if (e.currentTarget.muted && !videoMuted) return setVideoMuted(true);
    if (!e.currentTarget.muted && videoMuted) return setVideoMuted(false);

    // setGlobalVolume(e.currentTarget.volume);
    console.log("global volume:", globalVolume);
    console.log(e.currentTarget.muted);
    console.log(e.currentTarget.volume);
  }
  function onLoadedDataHandler(e: SyntheticEvent<HTMLVideoElement, Event>) {
    videoRef.current!.volume = globalVolume;
    console.log("onLoadedDataHandler", e.currentTarget.volume);
  }

  // return (
  //   <div className="fixed inset-0 overflow-y-auto bg-black/80">
  //     <div className="flex min-h-full items-center justify-center p-1 text-center">
  //       <video
  //         ref={videoRef}
  //         src={videoSrcUrl}
  //         controls
  //         loop
  //         playsInline
  //         onLoadedData={() => videoRef.current!.volume=globalVolume}
  //         onVolumeChange={(e) => onVolumeChangeHandler(e)}
  //       >
  //         {"Sorry, your browser doesn't support embedded videos."}
  //       </video>
  //     </div>
  //   </div>
  // );
  return (
    <Dialog open={isOpen} className="z-10" onClose={onClose}>
      <div className="fixed inset-0 overflow-y-auto bg-black/80">
        <div className="flex min-h-full items-center justify-center p-1 text-center">
          <Dialog.Panel className="overflow-hidden bg-white p-0.5">
            <video
              ref={videoRef}
              src={videoSrcUrl}
              muted={videoMuted}
              // onVolumeChangeCapture={(e) => onVolumeChangeHandler(e)}
              onVolumeChange={(e) => onVolumeChangeHandler(e)}
              onLoadedData={(e) => onLoadedDataHandler(e)}
              controls
              loop
            >
              {"Sorry, your browser doesn't support embedded videos."}
            </video>
          </Dialog.Panel>
        </div>
      </div>
    </Dialog>
  );
};

export default ModalVideo;
