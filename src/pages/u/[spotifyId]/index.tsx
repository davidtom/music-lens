import { useEffect, useMemo } from "react";
import prettyMs from "pretty-ms";

import { withSessionSsr, SessionUser } from "lib/session";
import useUser from "lib/useUser";
import useUserTopTracks from "lib/useUserTopTracks";
import UserNavBar from "components/UserNavBar";

type ProfilePageProps = {
  spotifyId: string;
  user: SessionUser | null;
};

export const getServerSideProps = withSessionSsr(async function ({
  req,
  query,
}) {
  const props: ProfilePageProps = {
    spotifyId: query.spotifyId as string,
    user: req.session.user ?? null,
  };

  return {
    props,
  };
});

const ProfilePage: React.FC<ProfilePageProps> = ({ user, spotifyId }) => {
  const { mutateUser } = useUser();

  // TODO: should probably improve this?
  // Need to do this here so we capture users on login
  useEffect(() => {
    if (user) {
      mutateUser(user);
    }
  }, [mutateUser, user]);

  const { userTopTracks } = useUserTopTracks(spotifyId);

  const topTracks = useMemo(
    () =>
      userTopTracks?.map((topTrack, i: number) => {
        return (
          <tr key={i}>
            <td>{i + 1}</td>
            <td>
              <p>{topTrack.track.name}</p>
              <p>
                {topTrack.track.artists
                  .map((a: any) => a.artist.name)
                  .join(",")}
              </p>
            </td>
            <td>{topTrack.track.album.name}</td>
            <td>
              {prettyMs(topTrack.track.durationMs, {
                colonNotation: true,
                secondsDecimalDigits: 0,
              })}
            </td>
            <td>{topTrack.playCount}</td>
          </tr>
        );
      }),
    [userTopTracks]
  );

  return (
    <>
      <UserNavBar />
      <h2>Top Songs</h2>
      <table>
        <thead>
          <tr>
            <th>#</th>
            <th>Track</th>
            <th>Album</th>
            <th>Song Duration</th>
            <th>Play Count</th>
          </tr>
        </thead>
        <tbody>{topTracks}</tbody>
      </table>
    </>
  );
};

export default ProfilePage;
