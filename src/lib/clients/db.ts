import { PrismaClient, User, Artist } from "@prisma/client";
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

/********************
 * DB Methods
 *******************/
export type UserPlayHistoryData = {
  spotifyId: string;
  name: string;
  durationMs: number;
  playedAt: Date;
  artists: {
    spotifyId: string;
    name: string;
  }[];
  album: {
    spotifyId: string;
    name: string;
    imageUrl: string;
  };
};

export const addUserPlayHistoryData = async (
  user: User,
  userPlayHistoryData: UserPlayHistoryData[]
): Promise<void> => {
  // FIXME: this is breaking for some reason:
  // https://www.google.com/search?q=Transaction+already+closed%3A+Transaction+is+no+longer+valid.+Last+state%3A+%27Expired%27&rlz=1C5CHFA_enES503ES503&oq=Transaction+already+closed%3A+Transaction+is+no+longer+valid.+Last+state%3A+%27Expired%27&aqs=chrome..69i57.150j0j7&sourceid=chrome&ie=UTF-8
  // await prisma.$transaction(async (prisma): Promise<void> => {
  for (const playData of userPlayHistoryData) {
    const { artists, album, ...track } = playData;

    // Album
    const dbAlbum = await prisma.album.upsert({
      create: {
        imageUrl: album.imageUrl,
        name: album.name,
        spotifyId: album.spotifyId,
      },
      update: {
        imageUrl: album.imageUrl,
        name: album.name,
      },
      where: {
        spotifyId: album.spotifyId,
      },
    });

    // Track
    const dbTrack = await prisma.track.upsert({
      create: {
        albumId: dbAlbum.id,
        durationMs: track.durationMs,
        name: track.name,
        spotifyId: track.spotifyId,
      },
      update: {
        durationMs: track.durationMs,
        name: track.name,
      },
      where: {
        spotifyId: track.spotifyId,
      },
    });

    // Artists
    const dbArtists: Artist[] = [];
    for (const artist of artists) {
      const a = await prisma.artist.upsert({
        create: {
          name: artist.name,
          spotifyId: artist.spotifyId,
        },
        update: {
          name: artist.name,
        },
        where: {
          spotifyId: artist.spotifyId,
        },
      });
      dbArtists.push(a);
    }

    // Union: Play
    await prisma.play.upsert({
      create: {
        playedAt: track.playedAt,
        trackId: dbTrack.id,
        userId: user.id,
      },
      update: {},
      where: {
        userId_trackId_playedAt: {
          playedAt: track.playedAt,
          trackId: dbTrack.id,
          userId: user.id,
        },
      },
    });

    // Union ArtistTrack
    for (const dbArtist of dbArtists) {
      await prisma.artistTrack.upsert({
        create: {
          artistId: dbArtist.id,
          trackId: dbTrack.id,
        },
        update: {},
        where: {
          artistId_trackId: {
            artistId: dbArtist.id,
            trackId: dbTrack.id,
          },
        },
      });
    }
  }
  // });
};
