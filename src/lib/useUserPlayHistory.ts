import useSWR from "swr";

import { UserPlayHistory } from "pages/api/users/[spotifyId]/history";
import { FetchError } from "lib/fetchJson";

export default function useUserPlayHistory(spotifyId: string) {
  const {
    data: userPlayHistory,
    mutate: mutateUserPlayHistory,
    error,
  } = useSWR<UserPlayHistory, FetchError>(`/api/users/${spotifyId}/history`);

  return { userPlayHistory, mutateUserPlayHistory, error };
}
