import { useMemo } from "react";
import { useRouter } from "next/router";
import prettyMs from "pretty-ms";

import useUserPlayHistory from "lib/useUserPlayHistory";

const HistoryPage: React.FC = () => {
  const { asPath } = useRouter();

  const spotifyId = asPath.split("/")[2];
  const { userPlayHistory } = useUserPlayHistory(spotifyId);

  const playHistory = useMemo(
    () =>
      userPlayHistory?.map((play, i: number) => {
        const playedAt = new Date(play.playedAt).toLocaleString();
        return (
          <tr key={i}>
            <td>{i + 1}</td>
            <td>
              <p>{play.track.name}</p>
              <p>
                {play.track.artists.map((a: any) => a.artist.name).join(",")}
              </p>
            </td>
            <td>{play.track.album.name}</td>
            <td>
              {prettyMs(play.track.durationMs, {
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
    <>
      <h2>Play History</h2>
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
        <tbody>{playHistory}</tbody>
      </table>
    </>
  );
};

export default HistoryPage;
