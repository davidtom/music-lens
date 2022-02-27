import useSWR from "swr";

import { UserData } from "pages/api/users/[spotifyId]";
import { FetchError } from "lib/fetchJson";

export default function useUserData(spotifyId: string) {
  const {
    data: userData,
    mutate: mutateUserData,
    error,
  } = useSWR<UserData, FetchError>(`/api/users/${spotifyId}`);

  return { userData, mutateUserData, error };
}
