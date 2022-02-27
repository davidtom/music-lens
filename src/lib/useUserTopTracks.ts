import useSWR from "swr";

import { UserTopTracks } from "pages/api/users/[spotifyId]/top";
import { FetchError } from "lib/fetchJson";

export default function useUserTopTracks(spotifyId: string) {
  const {
    data: userTopTracks,
    mutate: mutateUserTopTracks,
    error,
  } = useSWR<UserTopTracks, FetchError>(`/api/users/${spotifyId}/top`);

  return { userTopTracks, mutateUserTopTracks, error };
}
