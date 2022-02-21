import type { NextApiRequest, NextApiResponse } from "next";

import db from "lib/clients/db";

// FIXME: figure out what to do here - this seems like the best way to test queries
// since scripts seem out of the import flow?
export default async function handler(_: NextApiRequest, res: NextApiResponse) {
  // FIXME: figure out how to count
  const topPlays = await db.play.groupBy({
    by: ["trackId"],
    where: {
      userId: 1,
    },
    _count: {
      id: true,
    },
  });
  res.json(topPlays);
}
