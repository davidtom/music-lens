import type { NextApiRequest, NextApiResponse } from "next";
import getConfig from "next/config";

import client from "lib/clients/spotify";
import { mapSpotifyPlayHistoryToUserPlayHistoryData } from "lib/util";
import db, {
  addUserPlayHistoryData,
  UserPlayHistoryData,
} from "lib/clients/db";

/**
 * TODO: Idea for sync records table:
 * - capture sync time and success true/false
 * - run some process that deletes old TRUE records?
 *    only ever capture sync failures?
 *    probably at least want last successful sync time
 */

// TODO: need to auth this - just check a random string
// TODO: review this project for more ideas: https://github.com/paulphys/nextjs-cron
// TODO: should this be a POST?

const API_SECRET = getConfig().serverRuntimeConfig.API_SECRET;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.headers["authorization"] !== `Bearer ${API_SECRET}`) {
    res.status(403).end();
    return;
  }

  try {
    // Get the user associated with the request's userId param
    const { userId } = req.query;
    if (typeof userId !== "string") {
      throw new Error(`Invalid userId: ${userId}`);
    }
    const id = parseInt(userId, 10);
    const user = await db.user.findFirst({ where: { id } });

    if (!user) {
      throw new Error(`No user found for id ${id}`);
    }

    // Update user's access token
    // TODO: Spotify might be happier if I check the need for this first?
    // TODO: If we keep this approach - do we need to keep storing access tokens?
    const refreshToken = user.refreshToken;
    if (!refreshToken) {
      throw new Error(`User ${user.id} has no refresh token`);
    }
    const accessToken = await client.refreshAccessToken(refreshToken);

    db.user.update({
      data: {
        accessToken,
      },
      where: {
        id: user.id,
      },
    });

    // Get the last play for the user so we can query recent plays after that time
    // TODO: DRY this up with code we use in the user profile?
    const mostRecentPlay = await db.play.findFirst({
      orderBy: {
        playedAt: "desc",
      },
      select: {
        playedAt: true,
      },
      where: {
        userId: user.id,
      },
    });

    let lastPlayed: Date | undefined;
    if (mostRecentPlay) {
      lastPlayed = mostRecentPlay.playedAt;
      // TODO: logger
      console.log(
        "Querying recently played since most recent play: ",
        lastPlayed.toISOString()
      );
    }

    // Get user's recently played tracks and map them into a shape we can use
    const { items } = await client.getRecentlyPlayed(accessToken, lastPlayed);
    const recentlyPlayedTracks: UserPlayHistoryData[] =
      mapSpotifyPlayHistoryToUserPlayHistoryData(items);

    // Sync recently played tracks to the database
    for (const recentlyPlayedTrack of recentlyPlayedTracks) {
      await addUserPlayHistoryData(user, recentlyPlayedTrack);
    }

    const count = recentlyPlayedTracks.length;
    // TODO: logger
    console.log("Synced recently played tracks for user", {
      userId: user.id,
      spotifyId: user.spotifyId,
      count,
    });

    res.json({ count });
  } catch (err) {
    // TODO: logger
    console.error(err);
    res.status(500).end();
  }
}
