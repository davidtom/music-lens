import useSWR from "swr";

import { Users } from "pages/api/users";
import { FetchError } from "lib/fetchJson";

export default function useUsers() {
  const {
    data: users,
    mutate: mutateUsers,
    error,
  } = useSWR<Users, FetchError>("/api/users");

  return { users, mutateUsers, error };
}
