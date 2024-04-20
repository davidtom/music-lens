import type { NextApiRequest, NextApiResponse } from "next";
import getConfig from "next/config";

import db from "lib/clients/db";

const API_SECRET = getConfig().serverRuntimeConfig.API_SECRET;

async function handler(req: NextApiRequest, res: NextApiResponse) {
  // TODO: DRY - API SECRET CHECK
  if (req.headers["authorization"] !== `Bearer ${API_SECRET}`) {
    res.status(403).end();
    return;
  }

  const results = await db.user.findMany({
    select: {
      id: true,
    },
  });

  res.json(results);
}

export default handler;
