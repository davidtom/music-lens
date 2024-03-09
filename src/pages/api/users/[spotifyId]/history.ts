import type { NextApiRequest, NextApiResponse } from "next";

import { withSessionApiRoute } from "lib/session";

import db from "lib/clients/db";

export type TrackPlay = {
  name: string;
  spotifyId: string;
  durationMs: number;
  albumName: string;
  artistNames: string[];
  playedAt: number;
};

export type TrackPlays = TrackPlay[];

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const spotifyId = req.query.spotifyId;
  // TODO: error handle this correctly
  if (typeof spotifyId !== "string") {
    throw new Error(`Invalid spotifyId: ${spotifyId}`);
  }

  const user = await db.user.findFirst({ where: { spotifyId } });

  if (!user) {
    res.status(404).send({});
    return;
  }

  const trackPlaysRaw = await db.play.findMany({
    orderBy: {
      playedAt: "desc",
    },
    select: {
      playedAt: true,
      track: {
        select: {
          name: true,
          spotifyId: true,
          durationMs: true,
          album: {
            select: {
              name: true,
            },
          },
          artists: {
            select: {
              artist: {
                select: {
                  name: true,
                },
              },
            },
          },
        },
      },
    },
    where: {
      userId: user.id,
    },
    take: 100,
  });

  const trackPlays: TrackPlays = trackPlaysRaw.map(({ track, playedAt }) => ({
    name: track.name,
    spotifyId: track.spotifyId,
    durationMs: track.durationMs,
    albumName: track.album.name,
    artistNames: track.artists.map(({ artist }) => artist.name),
    playedAt: playedAt.getTime(),
  }));

  res.json(trackPlays);
}

export default withSessionApiRoute(handler);
