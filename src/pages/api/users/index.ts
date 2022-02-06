import type { NextApiRequest, NextApiResponse } from "next";

import db from "lib/clients/db";

async function handler(_: NextApiRequest, res: NextApiResponse) {
  const users = await db.user.findMany({
    select: {
      id: true,
    },
    orderBy: {
      id: "asc",
    },
  });
  res.json(users);
}

export default handler;
