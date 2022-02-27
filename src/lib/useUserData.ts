import useSWR from "swr";

import { UserData } from "pages/api/users/[spotifyId]";

export default function useUserData(spotifyId: string) {
  const { data: userData, mutate: mutateUserData } = useSWR<UserData>(
    `/api/users/${spotifyId}`
  );

  return { userData, mutateUserData };
}
