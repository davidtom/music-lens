import { createUseStyles } from "react-jss";
import Link from "next/link";
import { useRouter } from "next/router";

import Theme from "lib/theme";
import useUserData from "lib/useUserData";
import Custom404 from "../pages/404";

const useStyles = createUseStyles((theme: Theme) => ({
  container: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
  },
  navContainer: {
    width: "100%",
    display: "flex",
  },
  navButton: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
  },
  active: {
    textDecoration: "underline",
  },
}));

const UserNavBar: React.FC = ({ children }) => {
  const styles = useStyles();
  const { query, asPath } = useRouter();

  const spotifyId = query.spotifyId as string;
  const currentPath = asPath.split(spotifyId)[1];

  const { userData, error } = useUserData(spotifyId);

  if (error?.status === 404) {
    return <Custom404 type={"User"} />;
  }

  return (
    <>
      <div className={styles.container}>
        <div>
          <h2>{userData?.displayName}</h2>
          {userData?.createdAtMs && (
            <p>{`Joined: ${new Date(
              userData?.createdAtMs
            ).toLocaleString()}`}</p>
          )}
        </div>
        <div className={styles.navContainer}>
          <Link href={`/u/${spotifyId}`} passHref>
            <a
              className={`${styles.navButton} ${
                currentPath === "" ? styles.active : ""
              }`}
            >
              <p>{"Top"}</p>
            </a>
          </Link>
          <Link href={`/u/${spotifyId}/history`} passHref>
            <a
              className={`${styles.navButton} ${
                currentPath === "/history" ? styles.active : ""
              }`}
            >
              <p>{"History"}</p>
            </a>
          </Link>
        </div>
      </div>
      {children}
    </>
  );
};

export default UserNavBar;
