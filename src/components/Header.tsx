import { createUseStyles } from "react-jss";
import Link from "next/link";

import Theme from "lib/theme";
import useUser from "lib/useUser";

import LogInButton from "components/Buttons/LogInButton";

const useStyles = createUseStyles((theme: Theme) => ({
  container: {
    width: "100%",
    display: "flex",
  },
  leftContainer: {},
  middleContainer: {
    flexGrow: 1,
  },
  rightContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
  navButton: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
  },
}));

const Header: React.FC = () => {
  const styles = useStyles();

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
      <div className={styles.container}>
        <div className={styles.leftContainer}>
          <Link href={"/"} passHref>
            <a>
              <h1>Music Lense</h1>
            </a>
          </Link>
        </div>
        <div className={styles.middleContainer} />
        <div className={styles.rightContainer}>
          {user?.isLoggedIn ? (
            <>
              <Link href={`/u/${user.spotifyId}`} passHref>
                <a className={styles.navButton}>
                  <p>{"Profile"}</p>
                </a>
              </Link>
              <Link href={`/others`} passHref>
                <a className={styles.navButton}>
                  <p>{"Others"}</p>
                </a>
              </Link>
              <Link href={`/account`} passHref>
                <a className={styles.navButton}>
                  <p>{"Account"}</p>
                </a>
              </Link>
            </>
          ) : (
            <LogInButton />
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
