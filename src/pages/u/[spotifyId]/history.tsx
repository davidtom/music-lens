import { useMemo } from "react";
import { useRouter } from "next/router";
import prettyMs from "pretty-ms";

import useRecentlyPlayed from "lib/useRecentlyPlayed";

const RecentlyPlayedPage: React.FC = () => {
  const { asPath } = useRouter();

  const spotifyId = asPath.split("/")[2];
  const { recentlyPlayed } = useRecentlyPlayed(spotifyId);

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
        <tbody>{recentlyPlayedList}</tbody>
      </table>
    </>
  );
};

export default RecentlyPlayedPage;
