import type { NextApiRequest, NextApiResponse } from "next";

import { withSessionApiRoute } from "lib/session";

import db from "lib/clients/db";

// Note: this is sent as json so everything should be a string
export type UserPlayHistory = {
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
  const history = await db.play.findMany({
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

  const userPlayHistoryFormatted: UserPlayHistory = history.map((play) => ({
    ...play,
    playedAt: play.playedAt.getTime().toString(),
  }));

  res.json(userPlayHistoryFormatted);
}

export default withSessionApiRoute(handler);
