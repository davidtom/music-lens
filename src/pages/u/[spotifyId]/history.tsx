import { useMemo } from "react";
import { GetServerSideProps } from "next";
import prettyMs from "pretty-ms";

import useUserPlayHistory from "lib/useUserPlayHistory";
import UserNavBar from "components/UserNavBar";
import Track from "../../../components/Track";

/**
 * TODO: all /u/:spotifyId pages will probably need/want to use get serverSideProps to access the
 * spotifyId of the page - most importantly because without it nextjs's prerendering will run and
 * it wont have a spotifyId, which will cause errors to be thrown. Adding server side props fixes
 * that, but now we're in a place where all these pages will need it - can we DRY this up?
 * https://nextjs.org/docs/advanced-features/automatic-static-optimization
 */
type HistoryPageProps = {
  spotifyId: string;
};

export const getServerSideProps: GetServerSideProps = async function ({
  query,
}) {
  const props: HistoryPageProps = {
    spotifyId: query.spotifyId as string,
  };

  return {
    props,
  };
};

const HistoryPage: React.FC<HistoryPageProps> = ({ spotifyId }) => {
  const { userPlayHistory } = useUserPlayHistory(spotifyId);

  const playHistory = useMemo(
    () =>
      userPlayHistory?.map((trackPlay, i: number) => {
        const playedAt = new Date(trackPlay.playedAt * 1000).toLocaleString();
        return (
          <tr key={i}>
            <td>{i + 1}</td>
            <td>
              <Track
                name={trackPlay.name}
                artistNames={trackPlay.artistNames}
                spotifyId={trackPlay.spotifyId}
              />
            </td>
            <td className={"optionalColumn"}>{trackPlay.albumName}</td>
            <td>
              {prettyMs(trackPlay.durationMs, {
                colonNotation: true,
                secondsDecimalDigits: 0,
              })}
            </td>
            <td>{playedAt}</td>
          </tr>
        );
      }),
    [userPlayHistory]
  );

  return (
    <UserNavBar>
      <h2>Play History</h2>
      <table>
        <thead>
          <tr>
            <th>#</th>
            <th>Track</th>
            <th className={"optionalColumn"}>Album</th>
            <th>Song Duration</th>
            <th>Played At</th>
          </tr>
        </thead>
        <tbody>{playHistory}</tbody>
      </table>
    </UserNavBar>
  );
};

export default HistoryPage;
