import { PrismaClient } from "@prisma/client";
import getConfig from "next/config";

export type {
  Artist,
  ArtistTrack,
  Track,
  User,
  Play,
  Album,
} from "@prisma/client";

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: getConfig().serverRuntimeConfig.DATABASE_URL,
    },
  },
});

export default prisma;
