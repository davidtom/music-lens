import useSWR from "swr";

import { UserTopTracks } from "pages/api/users/[spotifyId]/top";

export default function useUserTopTracks(userId: string) {
  const { data: userTopTracks, mutate: mutateUserTopTracks } =
    useSWR<UserTopTracks>(`/api/users/${userId}/top`);

  return { userTopTracks, mutateUserTopTracks };
}
