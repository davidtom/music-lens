import useUsers from "lib/useUsers";
import Link from "next/link";

type OthersPageProps = {};

const OthersPage: React.FC<OthersPageProps> = ({}) => {
  const { users } = useUsers();

  return (
    <div>
      <table>
        <thead>
          <tr>
            <th>User</th>
            <th>Plays Per Day</th>
          </tr>
        </thead>
        <tbody>
          {users?.map((user) => {
            return (
              <tr key={user.spotifyId}>
                <td>
                  <Link href={`/u/${user.spotifyId}`} passHref>
                    <a>
                      <p>{user.displayName}</p>
                    </a>
                  </Link>
                </td>
                <td style={{ textAlign: "center" }}>{user.playsPerDay}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default OthersPage;
