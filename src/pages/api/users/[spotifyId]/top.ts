import type { NextApiRequest, NextApiResponse } from "next";

import { withSessionApiRoute } from "lib/session";

import db from "lib/clients/db";

type TopTrack = {
  name: string;
  spotifyId: string;
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

export type UserTopTrack = {
  playCount: number;
  track: TopTrack;
};

export type UserTopTracks = UserTopTrack[];

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const spotifyId = req.query.spotifyId;
  // TODO: error handle this correctly
  if (typeof spotifyId !== "string") {
    throw new Error(`Invalid spotifyId: ${spotifyId}`);
  }

  const user = await db.user.findFirst({ where: { spotifyId } });

  // FIXME: is something still returning something that cant be parsed by json?
  if (!user) {
    res.status(404).end({});
    return;
  }

  const topTrackIdsByPlayCount = await db.play.groupBy({
    where: {
      userId: user.id,
    },
    by: ["trackId"],
    _count: true,
    orderBy: {
      _count: {
        trackId: "desc",
      },
    },
    take: 100,
  });

  const topTrackIds = topTrackIdsByPlayCount.map(
    (topTrack) => topTrack.trackId
  );

  const topTracks = await db.track.findMany({
    where: {
      id: {
        in: topTrackIds,
      },
    },
    select: {
      id: true,
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
  });

  // TODO: optimize this, ideally fully with sql
  const topTracksById: { [trackId: string]: TopTrack } = topTracks.reduce(
    (data, item) => {
      return {
        ...data,
        [item.id]: item,
      };
    },
    {}
  );

  const topTracksWithPlayCount: UserTopTracks = topTrackIdsByPlayCount.map(
    ({ trackId, _count }) => ({
      track: topTracksById[trackId],
      playCount: _count,
    })
  );

  res.json(topTracksWithPlayCount);
}

export default withSessionApiRoute(handler);
