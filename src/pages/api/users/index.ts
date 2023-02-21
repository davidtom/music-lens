import type { NextApiRequest, NextApiResponse } from "next";

import db, { User } from "lib/clients/db";

type UserWithPlaysPerDay = Pick<User, "displayName" | "spotifyId"> & {
  playsPerDay: number;
};

export type Users = UserWithPlaysPerDay[];

async function handler(_: NextApiRequest, res: NextApiResponse) {
  const results = await db.$queryRaw<Users>`
    SELECT "displayName", "spotifyId", ROUND("totalPlays" / "daysSinceCreation") as "playsPerDay"
    FROM (
      SELECT
        u.id,
        u."displayName",
        u."spotifyId",
        DATE_PART('day', (now()AT TIME ZONE 'UTC') - u."createdAt") AS "daysSinceCreation",
        p."totalPlays"
      FROM "User" as u
      JOIN (SELECT "userId", COUNT(*) as "totalPlays" FROM "Play" GROUP BY "userId") as p
      ON u.id=p."userId"
    ) as subq
    ORDER BY "playsPerDay" DESC;
  `;

  res.json(results);
}

export default handler;
