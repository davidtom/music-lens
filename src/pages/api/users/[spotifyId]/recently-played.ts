import type { NextApiRequest, NextApiResponse } from "next";

import { withSessionApiRoute } from "lib/session";

import db from "lib/clients/db";

export type UserRecentlyPlayed = {
  playedAt: string;
  track: {
    name: string;
    durationMs: number;
    album: {
      name: string;
    };
    artists: {
      artist: {
        name: string;
      };
    }[];
  };
}[];

// FIXME: rename this to history yeah?
async function handler(req: NextApiRequest, res: NextApiResponse) {
  const spotifyId = req.query.spotifyId;
  // TODO: error handle this correctly
  if (typeof spotifyId !== "string") {
    console.log(req.query.spotifyId);
    throw new Error(`Invalid spotifyId: ${spotifyId}`);
  }

  const user = await db.user.findFirst({ where: { spotifyId } });

  if (!user) {
    res.status(404).end();
    return;
  }

  // TODO: this errored recently from having too many clients/connections? look into that
  const recentlyPlayed = await db.play.findMany({
    orderBy: {
      playedAt: "desc",
    },
    select: {
      playedAt: true,
      track: {
        select: {
          name: true,
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

  const recentlyPlayedFormatted = recentlyPlayed.map((recentPlay) => ({
    ...recentPlay,
    // TODO: this type is not being recognized correctly
    // -> since its a number, but is coming from json its assumed to be a string
    playedAt: recentPlay.playedAt.getTime(),
  }));

  res.json(recentlyPlayedFormatted);
}

export default withSessionApiRoute(handler);
