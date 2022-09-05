export const getClipVideoUrl = async (clipId: string) => {
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

export const getUserFollows = async (user_id: string) => {
  console.log("getUserFollows called index");
  return fetch(`/api/getUserFollows?user_id=${user_id}`).then((res) =>
    res.json()
  );
};

export const getUserInfo = async (username: string) => {
  console.log("getUserInfo called index");
  return fetch(`/api/getUserInfo?username=${username}`).then((res) =>
    res.json()
  );
};
