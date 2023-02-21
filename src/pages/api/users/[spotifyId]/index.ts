import type { NextApiRequest, NextApiResponse } from "next";

import { withSessionApiRoute } from "lib/session";

import db, { User } from "lib/clients/db";

export type UserData = {
  displayName: User["displayName"];
  createdAt: string;
  daysSinceCreation: number;
  totalPlays: number;
  playsPerDay: number;
};

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const spotifyId = req.query.spotifyId;
  // TODO: error handle this correctly
  if (typeof spotifyId !== "string") {
    throw new Error(`Invalid spotifyId: ${spotifyId}`);
  }

  const result = await db.$queryRaw<UserData[]>`
  SELECT *, ROUND("totalPlays" / "daysSinceCreation") as "playsPerDay" FROM (
    SELECT
      u."displayName",
      u."createdAt",
      DATE_PART('day', (now()AT TIME ZONE 'UTC') - u."createdAt") AS "daysSinceCreation",
	  (SELECT "totalPlays" FROM (SELECT "userId", COUNT(*) as "totalPlays" FROM "Play" WHERE "userId"=u.id GROUP BY "userId") as plays) as "totalPlays"
    FROM "User" as u WHERE "spotifyId"=${spotifyId}) as subq;
  `;
  const userData = result[0];

  if (!userData) {
    res.status(404).send({});
    return;
  }

  res.json(userData);
}

export default withSessionApiRoute(handler);
