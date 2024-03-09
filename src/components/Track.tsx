import Link from "next/link";

type TrackProps = {
  name: string;
  spotifyId: string;
  artistNames: string[];
};

const Track: React.FC<TrackProps> = ({ name, spotifyId, artistNames }) => {
  return (
    <>
      <Link href={`https://open.spotify.com/track/${spotifyId}`} passHref>
        <a target="blank">
          <p>{name}</p>
        </a>
      </Link>
      <p>{artistNames.join(",")}</p>
    </>
  );

  // TODO: link to artist page
  // <p>
  //   {track.artists
  //     .map((a: Artist) => (
  //       <Link
  //         key={a.id}
  //         href={`https://open.spotify.com/artist/${"butt"}`}
  //         passHref
  //       >
  //         {a.artist.name}
  //       </Link>
  //     ))
  //     .join(",")}
  // </p>
};

export default Track;
