import type { NextApiRequest, NextApiResponse } from "next";

import { withSessionApiRoute } from "lib/session";

import db from "lib/clients/db";

export type TopTrack = {
  name: string;
  spotifyId: string;
  durationMs: number;
  artistNames: string[];
  albumName: string;
  playCount: number;
  lastPlayedAt: string;
};
export type TopTracks = TopTrack[];

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const spotifyId = req.query.spotifyId;
  // TODO: error handle this correctly
  if (typeof spotifyId !== "string") {
    throw new Error(`Invalid spotifyId: ${spotifyId}`);
  }

  const user = await db.user.findFirst({ where: { spotifyId } });

  if (!user) {
    res.status(404).end({});
    return;
  }

  const topTracks = await db.$queryRaw<TopTrack[]>`
    WITH "topTracks" AS (
      SELECT "trackId", COUNT(*) as count, MAX(p."playedAt") as "lastPlayedAt"
      FROM "Play" as p
      WHERE "userId"=${user.id}
      -- TODO: implement date filtering
      -- 	AND "playedAt" >= '2024-02-01'::timestamp
      -- 	do I need an equal sign on both sides of this or just one?
      -- 	AND "playedAt" > '2023-01-01'::timestamp
      GROUP BY "trackId"
      ORDER BY count DESC
    )

    SELECT t.name, t."spotifyId", t."durationMs", array_agg(art.name) as "artistNames", alb.name as "albumName", tt.count as "playCount", tt."lastPlayedAt"
    FROM "topTracks" as tt
    LEFT JOIN "Track" as t ON tt."trackId"=t.id
    LEFT JOIN "Album" as alb ON t."albumId"=alb.id
    LEFT JOIN "ArtistTrack" as at ON t.id=at."trackId"
    LEFT JOIN "Artist" as art ON at."artistId"=art.id
    GROUP BY t.name, t."spotifyId", t."durationMs", alb.name, tt.count, tt."lastPlayedAt"
    ORDER BY tt.count DESC, tt."lastPlayedAt" DESC
    LIMIT 100; 
  `;

  res.json(topTracks);
}

export default withSessionApiRoute(handler);
