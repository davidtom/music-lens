import type { NextApiRequest, NextApiResponse } from "next";
import { withSessionApiRoute, SessionUser } from "lib/session";

async function handler(req: NextApiRequest, res: NextApiResponse<SessionUser>) {
  if (req.session.user) {
    // in a real world application you might read the user id from the session and then do a database request
    // to get more information on the user if needed
    res.json({
      ...req.session.user,
      isLoggedIn: true,
    });
  } else {
    res.json({
      isLoggedIn: false,
      id: null,
      spotifyId: "",
    });
  }
}

export default withSessionApiRoute(handler);
