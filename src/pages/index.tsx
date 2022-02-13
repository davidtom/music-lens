import type { NextPage } from "next";
import { createUseStyles } from "react-jss";

import useUser from "lib/useUser";
import ViewProfileButton from "components/Buttons/ViewProfileButton";
import LogInButton from "components/Buttons/LogInButton";

const useStyles = createUseStyles((theme) => ({
  // FIXME: revisit
  container: {
    margin: "4rem 0",
    lineHeight: 1.5,
    fontSize: "1.5rem",
    textAlign: "center",
  },
}));

const Home: NextPage = () => {
  const styles = useStyles();

  const { data: user } = useUser();

  return (
    <div className={styles.container}>
      {user?.isLoggedIn && user?.spotifyId ? (
        <ViewProfileButton spotifyId={user.spotifyId} />
      ) : (
        <LogInButton />
      )}
    </div>
  );
};

export default Home;
