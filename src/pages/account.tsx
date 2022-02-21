import { createUseStyles } from "react-jss";

import LogOutButton from "components/Buttons/LogOutButton";
import Theme from "lib/theme";
import useUser from "lib/useUser";

const useStyles = createUseStyles((theme: Theme) => ({
  container: {
    height: "100%",
    width: "100%",
  },
  accountContainer: {
    display: "flex",
    flexDirection: "row",
  },
  logOutContainer: {
    paddingTop: theme.spacing(4),
  },
}));

const AccountPage: React.FC = () => {
  const styles = useStyles();

  const { user } = useUser({
    redirectTo: "/",
  });

  return (
    <div className={styles.container}>
      <div className={styles.accountContainer}>
        <p>
          {"Spotify Account: "}
          <a
            href={`https://open.spotify.com/user/${user?.spotifyId}`}
            target={"_blank"}
            rel={"noreferrer"}
          >
            {user?.spotifyId}
          </a>
        </p>
      </div>
      <div className={styles.logOutContainer}>
        <LogOutButton />
      </div>
    </div>
  );
};

export default AccountPage;
