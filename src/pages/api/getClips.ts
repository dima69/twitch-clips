import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";
import clipsMockData from "./clipsMockData.json";

const headers = {
  Authorization: `Bearer ${process.env.TWITCH_ACCESS_TOKEN}`,
  "Client-ID": `${process.env.CLIENT_ID}`,
};

const t24hoursInMillis = 86400000;
const t7dInMillis = 604800000;
const t30dInMillis = 2592000000;

// "24h" | "7d" | "30d" | "all"

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  let { user_id, top } = req.query;
  const url = `https://api.twitch.tv/helix/clips?broadcaster_id=${user_id}`;
  const currentTime = new Date();
  let t24hoursAgo = new Date(Date.now() - t24hoursInMillis).toISOString();
  let t7daysAgo = new Date(Date.now() - t7dInMillis).toISOString();
  let t30daysAgo = new Date(Date.now() - t30dInMillis).toISOString();

  let params = {};
  if (top === "24h") {
    params = {
      ended_at: currentTime.toISOString(),
      started_at: t24hoursAgo,
    };
  } else if (top === "7d") {
    params = {
      ended_at: currentTime.toISOString(),
      started_at: t7daysAgo,
    };
  } else if (top === "30d") {
    params = {
      ended_at: currentTime.toISOString(),
      started_at: t30daysAgo,
    };
  }

  try {
    const response = await axios.get(url, {
      headers,
      params,
    });
    res.status(200).json(response.data);
  } catch (error) {
    console.log("something is wrong... falling back to mock data", error);
    res.status(400).json(clipsMockData);
  }
}
