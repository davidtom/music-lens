import useSWR from "swr";

import { UserPlayHistory } from "pages/api/users/[spotifyId]/history";

export default function useUserPlayHistory(userId: string) {
  const { data: userPlayHistory, mutate: mutateUserPlayHistory } =
    useSWR<UserPlayHistory>(`/api/users/${userId}/history`);

  return { userPlayHistory, mutateUserPlayHistory };
}
