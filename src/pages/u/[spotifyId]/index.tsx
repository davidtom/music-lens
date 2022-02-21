import { useEffect } from "react";

import { withSessionSsr, SessionUser } from "lib/session";
import useUser from "lib/useUser";

type LinkPageProps = {
  user?: SessionUser;
};

export const getServerSideProps = withSessionSsr(async function ({ req }) {
  const props: LinkPageProps = {
    user: req.session.user,
  };

  return {
    props,
  };
});

const LinkPage: React.FC<LinkPageProps> = ({ user }) => {
  const { mutateUser } = useUser();

  // TODO: should probably improve this?
  // Need to do this here so we capture users on login
  useEffect(() => {
    mutateUser(user);
  }, [mutateUser, user]);

  return (
    <>
      <h2>Top Songs</h2>
    </>
  );
};

export default LinkPage;
