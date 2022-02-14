import Link from "next/link";
import useUser from "lib/useUser";

import LogInButton from "./Buttons/LogInButton";
import LogOutButton from "./Buttons/LogOutButton";

const Header: React.FC = () => {
  const { user } = useUser();

  return (
    <header>
      {/*
      TODO:
        - This should be an svg
        - It should not be so wide (probably fixed when its a logo but confirm)
        - It should not change style after clicked (also probably fixed via logo)
        - Should this be in components/Buttons?
      */}
      <Link href={"/"} passHref>
        <a>
          <h1>Spotify Next</h1>
        </a>
      </Link>
      {user?.isLoggedIn ? (
        <>
          <h2>{user.spotifyId}</h2>
          <LogOutButton />
        </>
      ) : (
        <LogInButton />
      )}
    </header>
  );
};

export default Header;
