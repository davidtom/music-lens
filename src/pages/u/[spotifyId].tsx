import { InferGetServerSidePropsType } from "next";

import { withSessionSsr, SessionUser } from "lib/session";

export const getServerSideProps = withSessionSsr(async function ({
  req,
  res,
  params,
}) {
  const user = req.session.user;

  // TODO: include this check in withSessionSsr
  if (user === undefined) {
    res.setHeader("location", "/");
    res.statusCode = 302;
    res.end();
    return {
      props: {
        user: { isLoggedIn: false, spotifyId: "" } as SessionUser,
      },
    };
  }

  // Users can only view their own pages for now
  if (user.spotifyId !== params?.spotifyId) {
    res.setHeader("location", `/u/${user.spotifyId}`);
    res.statusCode = 302;
    res.end();
  }

  return {
    props: { user: req.session.user },
  };
});

const LinkPage: React.FC<
  InferGetServerSidePropsType<typeof getServerSideProps>
> = ({ user }) => {
  if (!user) {
    return null;
  }

  return (
    <div>
      <p>{user.spotifyId}</p>
      <a href={"/api/logout"}>Log out</a>
    </div>
  );
};

export default LinkPage;
