import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";
import userFollowsMockData from "./userFollowsMockData.json";

interface UserFollow {
  from_id: string;
  from_login: string;
  from_name: string;
  to_id: string;
  to_name: string;
  followed_at: string;
}

interface UserFollowsResponse {
  total: number;
  data: UserFollow[];
  pagination: {
    cursor?: string;
  };
}

interface UserInfo {
  broadcaster_type: string;
  created_at: string;
  description: string;
  display_name: string;
  email: string;
  id: string;
  login: string;
  offline_image_url: string;
  profile_image_url: string;
  type: string;
  view_count: number;
}

interface UserInfoResponse {
  data: UserInfo[];
}

const headers = {
  Authorization: `Bearer ${process.env.TWITCH_ACCESS_TOKEN}`,
  "Client-ID": `${process.env.CLIENT_ID}`,
};

interface getFollows {
  user_id: string;
  data: UserInfo[];
  cursor?: string;
  total: number;
}

async function getFollows(
  user_id: string,
  cursor?: string,
  data: UserInfoResponse = { data: [] }
): Promise<UserInfoResponse> {
  console.log("getting data getFollows");

  let params = {};
  params = { from_id: user_id, first: 100, after: cursor };

  const userFollowsResponse = await axios.get<UserFollowsResponse>(
    "https://api.twitch.tv/helix/users/follows",
    { headers, params }
  );
  let { pagination } = userFollowsResponse.data;

  let array_of_ids = [
    ...userFollowsResponse.data.data.map(({ to_id }) => to_id),
  ];

  const userInfoResponse = await axios.get(
    "https://api.twitch.tv/helix/users",
    { headers, params: { id: array_of_ids } }
  );

  data.data.push(...userInfoResponse.data.data);

  if (pagination.cursor) {
    return await getFollows(user_id, pagination.cursor, data);
  }
  return data;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  console.log("getUserFollows api called");
  let { user_id } = req.query;
  try {
    const response = await getFollows(user_id);
    res.status(200).json(response);
  } catch (error) {
    console.log("something is wrong... falling back to mock data");
    res.status(400).json(userFollowsMockData);
  }
}
