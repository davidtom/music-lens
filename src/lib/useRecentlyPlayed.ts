import useSWR from "swr";

import type { SessionUser } from "lib/session";

export type UserRecentlyPlayed = {
  playedAt: string;
  track: {
    name: string;
    durationMs: number;
    album: {
      name: string;
    };
    artists: {
      artist: {
        name: string;
      };
    }[];
  };
}[];

export default function useRecentlyPlayed(user: SessionUser | undefined) {
  const { data: recentlyPlayed } = useSWR<UserRecentlyPlayed>(
    user?.isLoggedIn ? `/api/users/${user.id}/recently-played` : null
  );

  return { recentlyPlayed };
}
