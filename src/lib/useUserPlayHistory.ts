import useSWR from "swr";

import { UserPlayHistory } from "pages/api/users/[spotifyId]/history";

export default function useUserPlayHistory(spotifyId: string) {
  const { data: userPlayHistory, mutate: mutateUserPlayHistory } =
    useSWR<UserPlayHistory>(`/api/users/${spotifyId}/history`);

  return { userPlayHistory, mutateUserPlayHistory };
}
