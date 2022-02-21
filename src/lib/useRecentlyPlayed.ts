import useSWR from "swr";

import { UserRecentlyPlayed } from "pages/api/users/[spotifyId]/recently-played";

export default function useRecentlyPlayed(userId: string) {
  const { data: recentlyPlayed, mutate: mutateRecentlyPlayed } =
    useSWR<UserRecentlyPlayed>(`/api/users/${userId}/recently-played`);

  return { recentlyPlayed, mutateRecentlyPlayed };
}
