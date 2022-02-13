import Link from "next/link";
import { useRouter } from "next/router";

import useUser from "lib/useUser";
import fetchJson from "lib/fetchJson";

const LogOutButton: React.FC = () => {
  const router = useRouter();
  const { mutateUser } = useUser();

  const handleLogout = async (e: any) => {
    e.preventDefault();
    mutateUser(await fetchJson("/api/logout", { method: "POST" }), false);

    router.push("/");
  };

  return (
    <Link href={"/api/logout"} passHref>
      <a onClick={handleLogout}>Log out</a>
    </Link>
  );
};

export default LogOutButton;
