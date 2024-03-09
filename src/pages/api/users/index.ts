import type { NextApiRequest, NextApiResponse } from "next";
import getConfig from "next/config";

import db, { User } from "lib/clients/db";

type UserWithPlaysPerDay = Pick<User, "id" | "displayName" | "spotifyId"> & {
  playsPerDay: number;
};

export type Users = UserWithPlaysPerDay[];

const API_SECRET = getConfig().serverRuntimeConfig.API_SECRET;

async function handler(req: NextApiRequest, res: NextApiResponse) {
  // TODO: DRY - API SECRET CHECK
  if (req.headers["authorization"] !== `Bearer ${API_SECRET}`) {
    res.status(403).end();
    return;
  }

  const results = await db.$queryRaw<Users>`
    SELECT "id", "displayName", "spotifyId", ROUND("totalPlays" / "daysSinceCreation") as "playsPerDay"
    FROM (
      SELECT
        u.id,
        u."displayName",
        u."spotifyId",
        COALESCE(NULLIF(DATE_PART('day', (now()AT TIME ZONE 'UTC') - u."createdAt"), 0), 1) AS "daysSinceCreation",
        p."totalPlays"
      FROM "User" as u
      LEFT JOIN (SELECT "userId", COUNT(*) as "totalPlays" FROM "Play" GROUP BY "userId") as p
      ON u.id=p."userId"
    ) as subq
    ORDER BY "playsPerDay" DESC;
  `;

  res.json(results);
}

export default handler;
