import useUsers from "lib/useUsers";
import Link from "next/link";

type OthersPageProps = {};

const OthersPage: React.FC<OthersPageProps> = ({}) => {
  const { users } = useUsers();

  return (
    <div>
      {users?.map((user) => {
        return (
          <Link key={user.id} href={`/u/${user.spotifyId}`} passHref>
            {/* <a className={styles.navButton}> */}
            <a>
              <p>{user.displayName}</p>
            </a>
          </Link>
        );
      })}
    </div>
  );
};

export default OthersPage;
