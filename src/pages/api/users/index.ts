import type { NextApiRequest, NextApiResponse } from "next";

import db, { User } from "lib/clients/db";

export type Users = Pick<User, "id" | "displayName" | "spotifyId">[];

async function handler(_: NextApiRequest, res: NextApiResponse) {
  const dbUsers = await db.user.findMany({
    select: {
      id: true,
      displayName: true,
      spotifyId: true,
    },
    orderBy: {
      id: "asc",
    },
  });

  const users: Users = dbUsers.map(({ id, displayName, spotifyId }) => ({
    id,
    displayName,
    spotifyId,
  }));
  res.json(users);
}

export default handler;
