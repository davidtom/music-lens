import useSWR from "swr";

import { UserTopTracks } from "pages/api/users/[spotifyId]/top";

export default function useUserTopTracks(spotifyId: string) {
  const { data: userTopTracks, mutate: mutateUserTopTracks } =
    useSWR<UserTopTracks>(`/api/users/${spotifyId}/top`);

  return { userTopTracks, mutateUserTopTracks };
}
