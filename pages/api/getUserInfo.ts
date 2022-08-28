// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // NOTE Third-party apps that call the Twitch APIs and maintain an OAuth session
  // must call the /validate endpoint to verify that the access token is still valid.
  let { username } = req.query;
  const url = `https://api.twitch.tv/helix/users?login=${username}`;

  try {
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${process.env.TWITCH_ACCESS_TOKEN}`,
        "Client-ID": `${process.env.CLIENT_ID}`,
      },
    });
    res.status(200).json(response.data);
  } catch (error) {
    res.status(400).json(error);
  }
}
