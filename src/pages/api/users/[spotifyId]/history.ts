import type { NextApiRequest, NextApiResponse } from "next";

import { withSessionApiRoute } from "lib/session";

import db from "lib/clients/db";

export type TrackPlay = {
  name: string;
  spotifyId: string;
  durationMs: number;
  artistNames: string[];
  albumName: string;
  playedAt: string;
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

  const trackPlays = await db.$queryRaw<TrackPlays>`
    SELECT t.name, t."spotifyId", t."durationMs", array_agg(art.name) as "artistNames", alb.name as "albumName", p."playedAt"
    FROM "Track" as t
    LEFT JOIN "Play" as p ON t.id=p."trackId"
    LEFT JOIN "Album" as alb ON t."albumId"=alb.id
    LEFT JOIN "ArtistTrack" as at ON t.id=at."trackId"
    LEFT JOIN "Artist" as art on at."artistId"=art.id
    GROUP BY t.name, t."spotifyId", t."durationMs", alb.name, p."playedAt", p."userId"
    HAVING p."userId"=${user.id}
    ORDER BY p."playedAt" DESC
    LIMIT 100;
  `;

  res.json(trackPlays);
}

export default withSessionApiRoute(handler);
