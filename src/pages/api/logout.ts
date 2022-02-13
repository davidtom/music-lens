import type { NextApiRequest, NextApiResponse } from "next";

import { SessionUser, withSessionApiRoute } from "lib/session";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  req.session.destroy();

  const user: SessionUser = { isLoggedIn: false, id: null, spotifyId: null };
  res.json(user);
}

export default withSessionApiRoute(handler);
