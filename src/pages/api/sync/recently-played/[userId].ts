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
// TODO: this should be a POST

const API_SECRET = getConfig().serverRuntimeConfig.API_SECRET;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // TODO: DRY
  if (req.headers["authorization"] !== `Bearer ${API_SECRET}`) {
    console.error(req.headers);
    res.status(403).end();
    return;
  }

  try {
    // Get the user associated with the request's userId param
    const { userId, syncAll } = req.query;
    const syncFullHistory = !!syncAll;

    if (typeof userId !== "string") {
      throw new Error(`Invalid userId: ${userId}`);
    }
    const id = parseInt(userId, 10);
    const user = await db.user.findFirst({ where: { id } });

    if (!user) {
      res.status(404).end();
      return;
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
    if (mostRecentPlay && !syncFullHistory) {
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

    // Tracks are sorted from most recently played to oldest, but we want to sync from oldest first
    // so if we fail we pick up at the right spot
    const sortedRecentlyPlayedTracks = recentlyPlayedTracks.sort(
      sortByPlayedAtAscending
    );

    // Sync recently played tracks to the database
    for (const userPlayHistoryData of sortedRecentlyPlayedTracks) {
      await addUserPlayHistoryData(user.id, userPlayHistoryData);
    }

    const count = recentlyPlayedTracks.length;
    // TODO: logger
    console.log("Synced recently played tracks for user", {
      userId: user.id,
      spotifyId: user.spotifyId,
      count,
    });

    res.json({ count, userId: user.id });
  } catch (err) {
    // TODO: logger
    console.error(err);
    res.status(500).end();
  }
}

/****************************************
 * Helper Methods
 ***************************************/
function sortByPlayedAtAscending(
  a: UserPlayHistoryData,
  b: UserPlayHistoryData
): number {
  if (a.playedAt < b.playedAt) {
    return -1;
  }
  if (a.playedAt > b.playedAt) {
    return 1;
  }
  return 0;
}
