import type { NextApiRequest, NextApiResponse } from "next";

import { withSessionApiRoute } from "lib/session";

import spotify from "lib/clients/spotify";
import db, { User } from "lib/clients/db";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const code = req.query.code;

  // If users cancel a login request from the Spotify page, we end up back here without a token
  if (!code) {
    res.redirect("/");
    return;
  }

  // TODO: error handle this correctly
  if (typeof code !== "string") {
    throw new Error(`Invalid code: ${code}`);
  }

  let accessToken: string | undefined;
  let refreshToken: string | undefined;
  let spotifyUser: SpotifyApi.CurrentUsersProfileResponse | undefined;
  try {
    ({ accessToken, refreshToken } = await spotify.authorize(code));
    spotifyUser = await spotify.getUser(accessToken);
  } catch (err) {
    // TODO: log and report
    console.error("Auth error", err);
    throw err;
  }

  let user: User | undefined;
  try {
    user = await db.user.upsert({
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
  } catch (err) {
    console.error("Db error", err);
    throw err;
  }

  const protocol = req.headers["x-forwarded-proto"] || "http";
  const baseUrl = req ? `${protocol}://${req.headers.host}` : "";

  // TODO: ideally we do this while/after getting user to page
  try {
    await fetch(`${baseUrl}/api/sync/recently-played/${user.id}`);
  } catch (err) {
    // TODO: logger
    console.error(
      `Failed to sync recently played on login for user ${user.id}`,
      err
    );
  }

  req.session.user = {
    isLoggedIn: true,
    id: user.id,
    spotifyId: user.spotifyId,
  };
  await req.session.save();

  res.redirect(`/u/${user.spotifyId}`);
}

export default withSessionApiRoute(handler);
