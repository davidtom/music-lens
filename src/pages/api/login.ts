import type { NextApiRequest, NextApiResponse } from "next";

import spotify from "lib/clients/spotify";

export default function handler(_: NextApiRequest, res: NextApiResponse) {
  res.redirect(spotify.getAuthorizeUrl());
}
