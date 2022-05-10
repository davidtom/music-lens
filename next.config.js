/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  serverRuntimeConfig: {
    SPOTIFY_CLIENT_ID: process.env.SPOTIFY_CLIENT_ID,
    SPOTIFY_CLIENT_SECRET: process.env.SPOTIFY_CLIENT_SECRET,
    SPOTIFY_REDIRECT_URI: process.env.SPOTIFY_REDIRECT_URI,
    SPOTIFY_SCOPE: process.env.SPOTIFY_SCOPE,
    SPOTIFY_SHOW_LOGIN_DIALOG: process.env.SPOTIFY_SHOW_LOGIN_DIALOG === "true",
    SECRET_COOKIE_PASSWORD: process.env.SECRET_COOKIE_PASSWORD,
    API_SECRET: process.env.API_SECRET,
    DATABASE_URL: process.env.DATABASE_URL,
  },
  rewrites: async () => [
    {
      destination: "https://cdn.splitbee.io/sb.js",
      source: "/sb.js",
    },
    {
      destination: "https://hive.splitbee.io/:slug",
      source: "/sb-api/:slug",
    },
  ],
};

module.exports = nextConfig;
