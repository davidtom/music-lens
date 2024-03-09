import useSWR from "swr";

import { TrackPlays } from "pages/api/users/[spotifyId]/history";
import { FetchError } from "lib/fetchJson";

export default function useUserPlayHistory(spotifyId: string) {
  const {
    data: userPlayHistory,
    mutate: mutateUserPlayHistory,
    error,
  } = useSWR<TrackPlays, FetchError>(`/api/users/${spotifyId}/history`);

  return { userPlayHistory, mutateUserPlayHistory, error };
}
