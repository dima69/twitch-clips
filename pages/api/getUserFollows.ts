import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";
import userFollowsMockData from "./userFollowsMockData.json";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  let { user_id } = req.query;
  try {
    const response = await axios.get("https://api.twitch.tv/helix/users/follows", {
      headers: {
        Authorization: `Bearer ${process.env.TWITCH_ACCESS_TOKEN}`,
        "Client-ID": `${process.env.CLIENT_ID}`,
      },
      params: {
        from_id: user_id
      }
    });

    let array_of_ids = [];
    let { data } = response.data;
    for (const key in data) {
      if (Object.prototype.hasOwnProperty.call(data, key)) {
        const element = data[key];
        array_of_ids.push(element.to_id);
      }
    };
    const response2 = await axios.get("https://api.twitch.tv/helix/users", {
      headers: {
        Authorization: `Bearer ${process.env.TWITCH_ACCESS_TOKEN}`,
        "Client-ID": `${process.env.CLIENT_ID}`,
      },
      params: {
        id: array_of_ids,
      },
    });
    res.status(200).json(response2.data.data);
  } catch (error) {
    console.log("something is wrong... falling back to mock data");
    res.status(400).json(userFollowsMockData);
  }
}
