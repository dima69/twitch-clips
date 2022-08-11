import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";
import userFollowsMockData from "./userFollowsMockData.json";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  let { user_id } = req.query;
  const url = `https://api.twitch.tv/helix/users/follows?from_id=${user_id}`;
  try {
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${process.env.TWITCH_ACCESS_TOKEN}`,
        "Client-ID": `${process.env.CLIENT_ID}`,
      },
    });
    res.status(200).json(response.data);
  } catch (error) {
    console.log("something is wrong... falling back to mock data", error);
    res.status(400).json(userFollowsMockData);
  }
}
