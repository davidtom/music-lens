import useSWR from "swr";

import { TopTracks } from "pages/api/users/[spotifyId]/top";
import { FetchError } from "lib/fetchJson";

export default function useUserTopTracks(spotifyId: string) {
  const {
    data: userTopTracks,
    mutate: mutateUserTopTracks,
    error,
  } = useSWR<TopTracks, FetchError>(`/api/users/${spotifyId}/top`);

  return { userTopTracks, mutateUserTopTracks, error };
}
