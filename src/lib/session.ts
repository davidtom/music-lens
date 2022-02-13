import type { NextApiHandler, GetServerSideProps } from "next";
import getConfig from "next/config";
import type { IronSessionOptions } from "iron-session";
import { withIronSessionApiRoute, withIronSessionSsr } from "iron-session/next";

export type SessionUser = {
  isLoggedIn: boolean;
  id: number | null;
  spotifyId: string | null;
};

declare module "iron-session" {
  interface IronSessionData {
    user?: SessionUser;
  }
}

export const sessionOptions: IronSessionOptions = {
  password: getConfig().serverRuntimeConfig.SECRET_COOKIE_PASSWORD,
  // TODO: update when I rename project
  cookieName: "spotify-next",
  cookieOptions: {
    // secure: true should be used in production (HTTPS) but can't be used in development (HTTP)
    secure: process.env.NODE_ENV === "production",
  },
};

export const withSessionApiRoute = (handler: NextApiHandler) => {
  return withIronSessionApiRoute(handler, sessionOptions);
};

export const withSessionSsr = (handler: GetServerSideProps) => {
  return withIronSessionSsr(handler, sessionOptions);
};
