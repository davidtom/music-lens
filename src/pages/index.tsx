import type { NextPage } from "next";
import Link from "next/link";
import { createUseStyles } from "react-jss";

const useStyles = createUseStyles(() => ({
  // FIXME: revisit
  container: {
    margin: "4rem 0",
    lineHeight: 1.5,
    fontSize: "1.5rem",
    textAlign: "center",
  },
}));

// TODO: check https://nextjs.org/docs/basic-features/layouts for more info on how to use layouts
const Home: NextPage = () => {
  const styles = useStyles();

  return (
    <>
      <div className={styles.container}>
        <Link href={"/api/login"} passHref>
          {/*
            TODO: this should handle login errors
            for inspieration: https://github.com/vercel/next.js/blob/canary/examples/with-iron-session/pages/login.tsx
            */}
          <button>Log In</button>
        </Link>
      </div>
    </>
  );
};

export default Home;
