import type { NextApiRequest, NextApiResponse } from "next";

import { withSessionApiRoute } from "lib/session";

import db from "lib/clients/db";

export type UserData = {
  displayName: string;
  createdAtMs: number;
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

  const userData: UserData = {
    displayName: user.displayName,
    createdAtMs: user.createdAt.getTime(),
  };

  res.json(userData);
}

export default withSessionApiRoute(handler);
