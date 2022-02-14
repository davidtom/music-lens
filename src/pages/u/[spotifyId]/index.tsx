import { useEffect, useMemo } from "react";
import prettyMs from "pretty-ms";

import { withSessionSsr, SessionUser } from "lib/session";
import useUser from "lib/useUser";
import useRecentlyPlayed from "lib/useRecentlyPlayed";

type LinkPageProps = {
  user: SessionUser;
};

export const getServerSideProps = withSessionSsr(async function ({
  req,
  res,
  params,
}) {
  const user = req.session.user;

  // TODO: Keep these checks only here, but do it only if user profile is set to private
  // may be best to just show "user is private" instead of redirecting somewhere
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

  return {
    props: {
      user: req.session.user,
    },
  };
});

const LinkPage: React.FC<LinkPageProps> = ({ user }) => {
  const { mutateUser } = useUser();
  const { recentlyPlayed } = useRecentlyPlayed(user);

  // TODO: should probably improve this?
  // Need to do this here so we capture users on login
  useEffect(() => {
    mutateUser(user);
  }, [mutateUser, user]);

  const recentlyPlayedList = useMemo(
    () =>
      recentlyPlayed?.map((recentPlay, i: number) => {
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
      }),
    [recentlyPlayed]
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
