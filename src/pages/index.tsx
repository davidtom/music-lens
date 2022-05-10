import type { NextPage } from "next";

import useUser from "lib/useUser";
import { useInitTracking } from "lib/tracking";
import ViewProfileButton from "components/Buttons/ViewProfileButton";
import LogInButton from "components/Buttons/LogInButton";

const Home: NextPage = () => {
  const { user } = useUser();
  useInitTracking();

  return (
    <div>
      {user?.isLoggedIn && user?.spotifyId ? (
        <ViewProfileButton spotifyId={user.spotifyId} />
      ) : (
        <LogInButton />
      )}
    </div>
  );
};

export default Home;
