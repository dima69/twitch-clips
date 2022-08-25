import { Dialog } from "@headlessui/react";
import useSWR from "swr";
import { LoadingSpinnerIcon } from "../assets/icons";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  clipId: string;
};

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

const ModalVideo = ({ isOpen, onClose, clipId }: Props) => {
  const { data } = useSWR(clipId, getClipVideoUrl);
  if (!data) {
    return (
      <div className="fixed inset-0 overflow-y-auto bg-black/80">
        <div className="flex min-h-full items-center justify-center p-1 text-center">
          <div className="h-10 w-10 absolute">
            <LoadingSpinnerIcon />
          </div>
        </div>
      </div>
    );
  }

  return (
    <Dialog open={isOpen} className="z-10" onClose={onClose}>
      <div className="fixed inset-0 overflow-y-auto bg-black/80">
        <div className="flex min-h-full items-center justify-center p-1 text-center">
          <Dialog.Panel className="overflow-hidden bg-white p-0.5">
            <video src={data} playsInline controls>
              {"Sorry, your browser doesn't support embedded videos."}
            </video>
          </Dialog.Panel>
        </div>
      </div>
    </Dialog>
  );
};

export default ModalVideo;
