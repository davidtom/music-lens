import { useEffect } from "react";
import prettyMs from "pretty-ms";

import { withSessionSsr, SessionUser } from "lib/session";
import db from "lib/clients/db";
import useUser from "lib/useUser";

type LinkPageProps = {
  user: SessionUser;
  recentlyPlayed: {
    playedAt: string;
    track: {
      name: string;
      durationMs: number;
      album: {
        name: string;
      };
      artists: {
        artist: {
          name: string;
        };
      }[];
    };
  }[];
};

export const getServerSideProps = withSessionSsr(async function ({
  req,
  res,
  params,
}) {
  const user = req.session.user;

  // TODO: include this check in withSessionSsr
  if (user === undefined || !user.id) {
    res.setHeader("location", "/");
    res.statusCode = 302;
    res.end();
    return {
      props: {
        user: { isLoggedIn: false, spotifyId: "" } as SessionUser,
      },
    };
  }

  // Users can only view their own pages for now
  if (user.spotifyId !== params?.spotifyId) {
    res.setHeader("location", `/u/${user.spotifyId}`);
    res.statusCode = 302;
    res.end();
  }

  const recentlyPlayed = await db.play.findMany({
    orderBy: {
      playedAt: "desc",
    },
    select: {
      playedAt: true,
      track: {
        select: {
          name: true,
          durationMs: true,
          album: {
            select: {
              name: true,
            },
          },
          artists: {
            select: {
              artist: {
                select: {
                  name: true,
                },
              },
            },
          },
        },
      },
    },
    where: {
      userId: user.id,
    },
    take: 100,
  });

  return {
    props: {
      user: req.session.user,
      recentlyPlayed: recentlyPlayed.map((recentPlay) => ({
        ...recentPlay,
        // TODO: this type is not being recognized correctly
        playedAt: recentPlay.playedAt.getTime(),
      })),
    },
  };
});

const LinkPage: React.FC<LinkPageProps> = ({ user, recentlyPlayed }) => {
  const { mutateUser } = useUser();

  // Need to do this here so we capture users on login
  useEffect(() => {
    mutateUser(user);
  }, [mutateUser, user]);

  if (!user) {
    return null;
  }

  const recentlyPlayedList = recentlyPlayed?.map(
    (recentPlay: any, i: number) => {
      const playedAt = new Date(recentPlay.playedAt).toLocaleString();
      return (
        <tr key={i}>
          <td>{i + 1}</td>
          <td>
            <p>{recentPlay.track.name}</p>
            <p>
              {recentPlay.track.artists
                .map((a: any) => a.artist.name)
                .join(",")}
            </p>
          </td>
          <td>{recentPlay.track.album.name}</td>
          <td>
            {prettyMs(recentPlay.track.durationMs, {
              colonNotation: true,
              secondsDecimalDigits: 0,
            })}
          </td>
          <td>{playedAt}</td>
        </tr>
      );
    }
  );

  return (
    <>
      <h2>Recently Played Tracks</h2>
      <table>
        <thead>
          <tr>
            <th>#</th>
            <th>Track</th>
            <th>Album</th>
            <th>Song Duration</th>
            <th>Played At</th>
          </tr>
        </thead>
        <tbody>{recentlyPlayedList}</tbody>
      </table>
    </>
  );
};

export default LinkPage;
