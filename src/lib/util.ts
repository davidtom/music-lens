import { RecentlyPlayedTrackData } from "./clients/db";

type SpotifyAlbumImageData = {
  height: number;
  width: number;
  url: string;
};

export const mapSpotifyPlayHistoryToRecentlyPlayedTrackData = (
  playHistory: SpotifyApi.PlayHistoryObject[]
): RecentlyPlayedTrackData[] =>
  playHistory.reduce(
    (
      data: RecentlyPlayedTrackData[],
      item: SpotifyApi.PlayHistoryObject
    ): any => {
      const { track, played_at } = item;
      const artists = track.artists.map(
        (artist: SpotifyApi.ArtistObjectSimplified) => ({
          name: artist.name,
          spotifyId: artist.id,
        })
      );
      data.push({
        album: {
          // TODO: USE PATCH PACKAGE
          // @ts-ignore - fix this in the libraries
          imageUrl: track.album.images.sort(
            (a: SpotifyAlbumImageData, b: SpotifyAlbumImageData) =>
              a.width - b.width
          )[0].url,
          // @ts-ignore - fix this in the libraries
          name: track.album.name,
          // @ts-ignore - fix this in the libraries
          spotifyId: track.album.id,
        },
        artists,
        durationMs: track.duration_ms,
        name: track.name,
        playedAt: new Date(Date.parse(played_at)),
        spotifyId: track.id,
      });
      return data;
    },
    []
  );
