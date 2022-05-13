import type { NextApiRequest, NextApiResponse } from "next";

import db, { User } from "lib/clients/db";

type UserWithPlaysPerDay = Pick<User, "id" | "displayName" | "spotifyId"> & {
  playsPerDay: number;
};

export type Users = UserWithPlaysPerDay[];

async function handler(_: NextApiRequest, res: NextApiResponse) {
  const dbUsers = await db.user.findMany({
    select: {
      id: true,
      displayName: true,
      spotifyId: true,
      createdAt: true,
    },
    orderBy: {
      id: "asc",
    },
  });

  const users: Users = await Promise.all(
    dbUsers.map(
      async ({
        id,
        displayName,
        spotifyId,
        createdAt,
      }): Promise<UserWithPlaysPerDay> => {
        const now = new Date();
        const msSinceCreate = Math.floor(now.getTime() - createdAt.getTime());
        // Use ceiling because for the first day a user sings up, this should be 1
        const daysSinceCreate = Math.ceil(
          msSinceCreate / (1000 * 60 * 60 * 24)
        );

        const totalPlaysQueryResults = await db.play.groupBy({
          where: {
            userId: id,
          },
          by: ["userId"],
          _count: true,
        });

        const totalPlaysQueryResult = totalPlaysQueryResults[0];
        const totalPlays = totalPlaysQueryResult?._count || 0;

        const playsPerDay = Math.round(totalPlays / daysSinceCreate);

        return {
          id,
          displayName,
          spotifyId,
          playsPerDay,
        };
      }
    )
  );

  // Sort descending order by plays per day
  const sortedUsers = users.sort(
    ({ playsPerDay: a }, { playsPerDay: b }): number => {
      if (a < b) {
        return 1;
      }

      if (a > b) {
        return -1;
      }

      return 0;
    }
  );

  res.json(sortedUsers);
}

export default handler;
