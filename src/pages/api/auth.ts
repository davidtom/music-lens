import type { NextApiRequest, NextApiResponse } from "next";

import { withSessionApiRoute } from "lib/session";

import spotify from "lib/clients/spotify";
import db from "lib/clients/db";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const code = req.query.code;
  // TODO: error handle this correctly
  if (typeof code !== "string") {
    throw new Error(`Invalid code: ${code}`);
  }

  const { accessToken, refreshToken } = await spotify.authorize(code);
  const spotifyUser = await spotify.getUser(accessToken);
  const user = await db.user.upsert({
    create: {
      accessToken,
      displayName: spotifyUser.display_name || spotifyUser.id,
      refreshToken,
      spotifyId: spotifyUser.id,
    },
    update: {
      accessToken,
      displayName: spotifyUser.display_name,
      refreshToken,
    },
    where: {
      spotifyId: spotifyUser.id,
    },
  });

  // TODO: sync user data on login somehow

  req.session.user = {
    isLoggedIn: true,
    spotifyId: user.spotifyId,
  };
  await req.session.save();

  res.redirect(`/u/${user.spotifyId}`);
}

export default withSessionApiRoute(handler);
