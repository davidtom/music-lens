import type { NextApiRequest, NextApiResponse } from "next";

import { withSessionApiRoute } from "lib/session";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  req.session.destroy();
  res.redirect("/");
}

export default withSessionApiRoute(handler);
