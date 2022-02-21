import Link from "next/link";

type ViewProfileButtonProps = {
  spotifyId: string;
};

const ViewProfileButton: React.FC<ViewProfileButtonProps> = ({ spotifyId }) => {
  return (
    <Link href={`/u/${spotifyId}`} passHref>
      <a>View Profile</a>
    </Link>
  );
};

export default ViewProfileButton;
