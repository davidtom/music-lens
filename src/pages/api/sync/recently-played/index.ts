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

  const protocol = req.headers["x-forwarded-proto"] || "http";
  const baseUrl = req ? `${protocol}://${req.headers.host}` : "";

  const users = await db.user.findMany({
    select: {
      id: true,
    },
    orderBy: {
      id: "asc",
    },
  });

  const userIds = users.map(({ id }) => id);

  let hadErr = false;
  for (const userId of userIds) {
    // TODO: logger
    console.log("Requesting for userId: ", userId);
    try {
      const response = await fetch(
        `${baseUrl}/api/sync/recently-played/${userId}`,
        // TODO: DRY this up with other auth checking?
        {
          headers: { authorization: `Bearer ${API_SECRET}` },
        }
      );
      const body = await response.json();
      // TODO: logger
      console.log("New plays: ", body.count);
    } catch (err: any) {
      // TODO: logger
      console.error("Error syncing user", { err: err.message, userId });
      hadErr = true;
    }
  }

  if (hadErr) {
    res.status(500).end();
  } else {
    res.status(200).end();
  }
}

export default handler;
