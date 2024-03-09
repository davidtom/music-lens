import { useEffect, useMemo } from "react";
import prettyMs from "pretty-ms";

import { withSessionSsr, SessionUser } from "lib/session";
import useUser from "lib/useUser";
import useUserTopTracks from "lib/useUserTopTracks";
import UserNavBar from "components/UserNavBar";
import Track from "../../../components/Track";

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
      userTopTracks?.map(
        (
          { name, spotifyId, artistNames, albumName, durationMs, playCount },
          i: number
        ) => {
          return (
            <tr key={spotifyId}>
              <td>{i + 1}</td>
              <td>
                <Track
                  name={name}
                  spotifyId={spotifyId}
                  artistNames={artistNames}
                />
              </td>
              <td className={"optionalColumn"}>{albumName}</td>
              <td>
                {prettyMs(durationMs, {
                  colonNotation: true,
                  secondsDecimalDigits: 0,
                })}
              </td>
              <td>{playCount}</td>
            </tr>
          );
        }
      ),
    [userTopTracks]
  );

  return (
    <UserNavBar>
      <h2>Top Songs</h2>
      <table>
        <thead>
          <tr>
            <th>#</th>
            <th>Track</th>
            <th className={"optionalColumn"}>Album</th>
            <th>Song Duration</th>
            <th>Play Count</th>
          </tr>
        </thead>
        <tbody>{topTracks}</tbody>
      </table>
    </UserNavBar>
  );
};

export default ProfilePage;
