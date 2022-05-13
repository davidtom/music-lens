import type { NextApiRequest, NextApiResponse } from "next";

import { withSessionApiRoute } from "lib/session";

import db from "lib/clients/db";

export type UserData = {
  displayName: string;
  createdAtMs: number;
  totalPlays: number;
};

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

  const totalPlaysQueryResults = await db.play.groupBy({
    where: {
      userId: user.id,
    },
    by: ["userId"],
    _count: true,
  });

  const totalPlaysQueryResult = totalPlaysQueryResults[0];
  const totalPlays = totalPlaysQueryResult?._count || 0;

  const userData: UserData = {
    displayName: user.displayName,
    createdAtMs: user.createdAt.getTime(),
    totalPlays,
  };

  res.json(userData);
}

export default withSessionApiRoute(handler);
