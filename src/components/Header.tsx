import Link from "next/link";
import { useRouter } from "next/router";

import useUser from "lib/useUser";
import fetchJson from "lib/fetchJson";

export default function Header() {
  const { data: user, mutateUser } = useUser();
  const router = useRouter();

  const handleLogout = async (e: any) => {
    e.preventDefault();
    mutateUser(await fetchJson("/api/logout", { method: "POST" }), false);

    router.push("/");
  };

  return (
    <header>
      {user?.isLoggedIn ? (
        <>
          <h1>{user.spotifyId}</h1>
          <a href={"/api/logout"} onClick={handleLogout}>
            Log out
          </a>
        </>
      ) : (
        <Link href={"/api/login"} passHref>
          {/*
            TODO: this should handle login errors
            for inspiration: https://github.com/vercel/next.js/blob/canary/examples/with-iron-session/pages/login.tsx
            */}
          <button>Log In</button>
        </Link>
      )}
    </header>
  );
}
