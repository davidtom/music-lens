import Link from "next/link";

import { UserPlay } from "../pages/api/users/[spotifyId]/history";

type TrackProps = {
  track: UserPlay["track"];
};

const Track: React.FC<TrackProps> = ({ track }) => {
  return (
    <>
      <Link href={`https://open.spotify.com/track/${track.spotifyId}`} passHref>
        <a target="blank">
          <p>{track.name}</p>
        </a>
      </Link>
      <p>{track.artists.map((a: any) => a.artist.name).join(",")}</p>
    </>
  );
};

export default Track;
